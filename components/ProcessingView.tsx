
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PDFTool, ProcessStatus } from '../types';
import { summarizeDocument, extractInsights, compareDocuments } from '../services/geminiService';

interface ProcessingViewProps {
  tool: PDFTool;
  onBack: () => void;
  onModalOpen: (modal: 'HELP' | 'PRICING' | 'SECURITY' | 'FEATURES' | 'ABOUT' | 'LANGUAGE') => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ tool, onBack, onModalOpen }) => {
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [fileProgresses, setFileProgresses] = useState<number[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  // Photo Editor Specific State
  const [overlayText, setOverlayText] = useState('Type your message here...');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [outlineColor, setOutlineColor] = useState('#000000');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const isImageTool = tool.id.includes('img') || ['remove-bg', 'photo-editor', 'meme-gen', 'html-to-img', 'blur-face'].includes(tool.id);
  const isEditor = tool.id === 'photo-editor';

  const processingMessages = isImageTool ? [
    "Analyzing image layers...",
    "Calibrating color profiles...",
    "Applying high-fidelity filters...",
    "Running AI visual enhancement...",
    "Rendering final masterpiece..."
  ] : [
    "Reading document structure...",
    "Extracting text layers...",
    "Consulting Gemini AI...",
    "Generating professional report...",
    "Finalizing download package..."
  ];

  // Canvas Rendering for Photo Editor
  useEffect(() => {
    if (isEditor && files.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!imageObjRef.current) {
        const img = new Image();
        img.src = URL.createObjectURL(files[0]);
        img.onload = () => {
          imageObjRef.current = img;
          renderCanvas();
        };
      } else {
        renderCanvas();
      }
    }
  }, [files, overlayText, fontFamily, fontSize, textColor, isBold, isItalic, textX, textY, outlineWidth, outlineColor, status]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageObjRef.current;
    if (!canvas || !ctx || !img) return;

    // Set canvas dimensions
    const maxWidth = 1200; // Increased for better resolution
    const scale = Math.min(maxWidth / img.width, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Prepare text styling
    const fontStyle = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
    ctx.font = fontStyle;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const xPos = (textX / 100) * canvas.width;
    const yPos = (textY / 100) * canvas.height;

    // Handle Multi-line Text
    const lines = overlayText.split('\n');
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    
    lines.forEach((line, index) => {
      const currentY = yPos - (totalHeight / 2) + (index * lineHeight) + (lineHeight / 2);
      
      // Draw Outline first
      if (outlineWidth > 0) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth * 2;
        ctx.strokeText(line, xPos, currentY);
      }

      // Draw Main Text
      ctx.fillStyle = textColor;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = outlineWidth > 0 ? 0 : 8; // Only use shadow if no outline
      ctx.fillText(line, xPos, currentY);
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFiles([file]);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const simulateUpload = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setFileProgresses(prev => {
        const next = [...prev];
        next[index] = Math.round(progress);
        return next;
      });
    }, 150);
  };

  const handleFiles = useCallback((incoming: FileList | File[] | File) => {
    const arr = Array.isArray(incoming) ? incoming : (incoming instanceof FileList ? Array.from(incoming) : [incoming]);
    const allowedTypes = isImageTool ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] : ['application/pdf'];
    const filtered = arr.filter(f => allowedTypes.includes(f.type));
    
    if (filtered.length > 0) {
      const startIdx = files.length;
      setFiles(p => [...p, ...filtered]);
      setFileProgresses(p => [...p, ...new Array(filtered.length).fill(0)]);
      setStatus(ProcessStatus.FILES_SELECTED);
      filtered.forEach((_, i) => simulateUpload(startIdx + i));
    }
  }, [files, isImageTool]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const startProcess = (aiInsights: boolean = false) => {
    if (fileProgresses.some(p => p < 100)) return alert("Wait for uploads to complete.");
    setStatus(ProcessStatus.PROCESSING);
    setOverallProgress(0);
    setProcessingStep(0);
    performAction(aiInsights || ['smart-summarize', 'smart-extract', 'compare', 'upscale-img', 'remove-bg'].includes(tool.id));
  };

  const performAction = async (isAI: boolean) => {
    try {
      const stepInterval = setInterval(() => {
        setProcessingStep(prev => (prev < processingMessages.length - 1 ? prev + 1 : prev));
        setOverallProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
      }, 800);

      let res = "";
      
      if (isAI) {
        const names = files.map(f => f.name).join(', ');
        if (tool.id === 'smart-extract') {
          res = await extractInsights(`Analysis of ${names}.`);
        } else if (tool.id === 'smart-summarize') {
          res = await summarizeDocument(`Summarizing ${names}.`);
        } else if (tool.id === 'compare') {
          res = await compareDocuments("Document A", "Document B");
        } else {
          res = "AI Processing complete.";
        }
        setAiResult(res || "Gemini processing complete.");
      } else {
        await new Promise(r => setTimeout(r, 2500));
      }

      if (isEditor && canvasRef.current) {
        setProcessedImageUrl(canvasRef.current.toDataURL('image/png'));
      } else if (isImageTool && files.length > 0) {
        // For other image tools, just simulate the "before/after"
        setProcessedImageUrl(URL.createObjectURL(files[0]));
      }

      clearInterval(stepInterval);
      setOverallProgress(100);
      setTimeout(() => setStatus(ProcessStatus.COMPLETED), 500);
    } catch (e) { 
      console.error(e);
      setStatus(ProcessStatus.ERROR); 
    }
  };

  const handleDownload = () => {
    if (isEditor && processedImageUrl) {
      const a = document.createElement("a");
      a.href = processedImageUrl;
      a.download = `SignFlow_Edited_${Date.now()}.png`;
      a.click();
      return;
    }

    const ext = isImageTool ? 'png' : 'pdf';
    const content = aiResult && !isImageTool ? new Blob([aiResult], { type: "text/plain" }) : new Blob(["MOCK PRO CONTENT"], { type: isImageTool ? "image/png" : "application/pdf" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SignFlow_${tool.id}_${Date.now()}.${aiResult && !isImageTool ? 'txt' : ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allUploaded = files.length > 0 && fileProgresses.every(p => p === 100);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 relative animate-in fade-in duration-500">
      <button onClick={() => { stopCamera(); onBack(); }} className="mb-8 flex items-center text-gray-500 hover:text-red-500 font-bold group text-sm uppercase tracking-widest transition-colors">
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300">←</span> Back to tools
      </button>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col min-h-[600px] transition-all duration-500">
        <div className={`${tool.color} p-12 text-white flex items-center justify-between relative overflow-hidden transition-colors duration-500`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black tracking-tighter">{tool.name}</h2>
            <p className="text-white/80 font-medium text-xl mt-4 leading-tight">{tool.description}</p>
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-[30px] flex items-center justify-center text-5xl shadow-2xl border border-white/20 rotate-3 transition-transform hover:rotate-6 z-10">
            {tool.icon}
          </div>
        </div>

        <div className="p-12 flex-grow flex flex-col justify-center bg-gray-50/20 relative">
          {(status === ProcessStatus.IDLE || status === ProcessStatus.FILES_SELECTED) && (
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {files.length === 0 ? (
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    w-full flex flex-col items-center justify-center border-4 border-dashed rounded-[48px] p-20 
                    transition-all duration-500 cursor-pointer relative overflow-hidden group
                    ${isDragging 
                      ? 'border-indigo-500 bg-indigo-50/70 scale-[1.03] shadow-2xl' 
                      : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-lg shadow-sm'
                    }
                  `}
                  onClick={() => !isCameraActive && document.getElementById('file-input')?.click()}
                >
                  {isCameraActive ? (
                    <div className="w-full aspect-video bg-black rounded-[32px] overflow-hidden relative shadow-2xl">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white w-16 h-16 rounded-full border-4 border-white shadow-xl active:scale-95 flex items-center justify-center z-20"><div className="w-6 h-6 bg-white rounded-full"></div></button>
                    </div>
                  ) : (
                    <>
                      <div className={`
                        w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 transition-all duration-700 relative
                        ${isDragging 
                          ? 'bg-indigo-500 text-white scale-110 rotate-12' 
                          : 'bg-indigo-50 text-indigo-500 group-hover:scale-105 shadow-sm'
                        }
                      `}>
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                      </div>
                      <h3 className="text-4xl font-black mb-2 tracking-tighter text-gray-900 text-center">
                        {isDragging ? 'Ready to drop!' : isImageTool ? 'Drop images here' : 'Drop PDFs here'}
                      </h3>
                      <p className="text-xl font-medium mb-10 text-gray-400 text-center">or click to browse from device</p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <label className={`${tool.color} text-white font-black py-4 px-12 rounded-[22px] cursor-pointer transition-all shadow-xl hover:-translate-y-1 inline-block uppercase tracking-tighter text-center active:scale-95`}>
                          Choose Files
                          <input id="file-input" type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} accept={isImageTool ? "image/*" : ".pdf"} />
                        </label>
                        {tool.id === 'scan-pdf' && (
                          <button onClick={(e) => { e.stopPropagation(); startCamera(); }} className="bg-white border-2 border-gray-100 text-gray-700 font-black py-4 px-12 rounded-[22px] hover:border-red-200 hover:text-red-500 transition-all uppercase tracking-tighter shadow-md hover:-translate-y-1">Camera</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
                  {isEditor ? (
                    <div className="space-y-8">
                       <div className="bg-white border-4 border-gray-100 rounded-[32px] overflow-hidden p-4 shadow-2xl">
                          <canvas ref={canvasRef} className="max-w-full h-auto mx-auto rounded-2xl shadow-inner bg-gray-50" />
                       </div>

                       <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl space-y-8">
                          <div>
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-4">Overlay Text</label>
                            <textarea 
                              value={overlayText} 
                              onChange={(e) => setOverlayText(e.target.value)}
                              rows={3}
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 text-xl resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Font & Styling</label>
                              <select 
                                value={fontFamily} 
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                              >
                                <option value="Inter">Inter (Modern)</option>
                                <option value="Georgia">Georgia (Classic)</option>
                                <option value="Courier New">Courier (Retro)</option>
                                <option value="Impact">Impact (Heavy)</option>
                              </select>
                              <div className="flex space-x-2">
                                <button onClick={() => setIsBold(!isBold)} className={`flex-grow h-12 rounded-xl border-2 font-black text-xl transition-all ${isBold ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100'}`}>B</button>
                                <button onClick={() => setIsItalic(!isItalic)} className={`flex-grow h-12 rounded-xl border-2 font-black italic text-xl transition-all ${isItalic ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100'}`}>I</button>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Text Size & Color</label>
                              <div className="flex items-center space-x-3">
                                <span className="text-xs font-black text-gray-400 w-8">{fontSize}</span>
                                <input type="range" min="10" max="250" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="flex-grow h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                              </div>
                              <div className="flex items-center space-x-4">
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-12 rounded-xl border-none p-0 cursor-pointer bg-transparent" />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Outline (Stroke)</label>
                              <div className="flex items-center space-x-3">
                                <span className="text-xs font-black text-gray-400 w-8">{outlineWidth}</span>
                                <input type="range" min="0" max="20" value={outlineWidth} onChange={(e) => setOutlineWidth(parseInt(e.target.value))} className="flex-grow h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                              </div>
                              <div className="flex items-center space-x-4">
                                <input type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)} className="w-full h-12 rounded-xl border-none p-0 cursor-pointer bg-transparent" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">X Position ({textX}%)</label>
                                <input type="range" min="0" max="100" value={textX} onChange={(e) => setTextX(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Y Position ({textY}%)</label>
                                <input type="range" min="0" max="100" value={textY} onChange={(e) => setTextY(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-[11px]">Processing Queue ({files.length})</h4>
                        <button onClick={() => {setFiles([]); setFileProgresses([]); setStatus(ProcessStatus.IDLE);}} className="text-red-500 text-[11px] font-black uppercase tracking-widest hover:underline">Clear All</button>
                      </div>
                      
                      <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {files.map((f, i) => (
                          <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm group hover:border-indigo-100 transition-all">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 ${isImageTool ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'} rounded-xl flex items-center justify-center`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/></svg>
                              </div>
                              <span className="font-bold text-gray-800 truncate max-w-[240px] text-sm">{f.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-[11px] font-black text-indigo-600 tracking-tighter">{fileProgresses[i]}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-12">
                    <button 
                      onClick={() => startProcess()} 
                      disabled={!allUploaded} 
                      className={`flex-grow ${tool.color} text-white font-black py-6 rounded-[24px] shadow-2xl uppercase tracking-tighter text-xl disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all hover:-translate-y-1`}
                    >
                      {isEditor ? 'Export Masterpiece' : 'Process Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === ProcessStatus.PROCESSING && (
            <div className="flex flex-col items-center animate-in fade-in duration-700 py-10 max-w-xl mx-auto">
              <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                {isImageTool ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 border-[6px] border-dashed border-gray-200 rounded-[48px] animate-[spin_15s_linear_infinite]"></div>
                    <div className="absolute inset-6 bg-white rounded-[32px] shadow-2xl flex items-center justify-center overflow-hidden">
                       <div className={`w-24 h-24 ${tool.color} rounded-[20px] shadow-xl flex items-center justify-center text-white text-4xl font-black animate-pulse`}>
                          {tool.icon}
                       </div>
                       <div className="absolute top-0 left-0 w-full h-[4px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 border-[12px] border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-[12px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className={`w-24 h-24 ${tool.color} rounded-[24px] flex items-center justify-center text-white shadow-2xl animate-pulse`}>
                      <span className="text-4xl font-black">{tool.icon}</span>
                    </div>
                  </>
                )}
              </div>
              
              <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 text-center leading-none">
                {processingMessages[processingStep]}
              </h3>
              
              <div className="w-full max-w-md h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner mb-6">
                <div className={`h-full bg-gradient-to-r ${isImageTool ? 'from-indigo-500 to-blue-500' : 'from-orange-500 to-red-500'} transition-all duration-700 ease-out`} style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>
          )}

          {status === ProcessStatus.COMPLETED && (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-700 max-w-3xl mx-auto py-6">
              <div className="w-32 h-32 bg-green-500 text-white rounded-[40px] flex items-center justify-center mb-10 shadow-3xl">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" /></svg>
              </div>
              
              <h3 className="text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none">Perfect!</h3>
              <p className="text-xl text-gray-400 font-medium mb-12">Your asset has been professionally processed and is ready for use.</p>
              
              {(isImageTool || isEditor) && processedImageUrl && (
                <div className="w-full bg-white border-4 border-gray-100 rounded-[32px] p-6 mb-12 shadow-2xl overflow-hidden flex items-center justify-center bg-checkered">
                    <img src={processedImageUrl} alt="Processed result" className="max-w-full h-auto rounded-xl shadow-lg" />
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                <button onClick={handleDownload} className="shimmer-btn bg-red-500 text-white font-black py-8 px-20 rounded-[32px] shadow-4xl hover:shadow-red-200 active:scale-95 transition-all text-3xl tracking-tighter uppercase hover:-translate-y-2 flex items-center space-x-4">
                  <span>Download</span>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>
                <button onClick={() => { setStatus(ProcessStatus.IDLE); setFiles([]); setFileProgresses([]); setAiResult(null); imageObjRef.current = null; setProcessedImageUrl(null); }} className="bg-white border-4 border-gray-100 text-gray-400 font-black px-16 py-8 rounded-[32px] hover:border-gray-200 hover:text-gray-800 transition-all text-xl uppercase tracking-widest active:scale-95 hover:-translate-y-1">Restart</button>
              </div>

              <div className="mt-16 pt-10 border-t border-gray-50 w-full max-w-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                  <FooterActionButton onClick={() => onModalOpen('HELP')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} label="Help" />
                  <FooterActionButton onClick={() => onModalOpen('LANGUAGE')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>} label="Language" />
                  <FooterActionButton onClick={() => onModalOpen('PRICING')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>} label="Pricing" />
                  <FooterActionButton onClick={() => onModalOpen('SECURITY')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>} label="Security" />
                  <FooterActionButton onClick={() => onModalOpen('FEATURES')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"/></svg>} label="Features" />
                  <FooterActionButton onClick={() => onModalOpen('ABOUT')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} label="About us" />
                </div>
              </div>
            </div>
          )}

          {status === ProcessStatus.ERROR && (
             <div className="flex flex-col items-center py-10 text-center animate-in shake duration-500">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-[32px] flex items-center justify-center mb-8"><span className="text-6xl font-black">!</span></div>
                <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Something went wrong</h3>
                <button onClick={() => setStatus(ProcessStatus.IDLE)} className="bg-gray-900 text-white font-black py-6 px-16 rounded-[24px] uppercase tracking-widest">Retry</button>
             </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .bg-checkered {
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
};

const FooterActionButton = ({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-2 text-gray-400 hover:text-red-500 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-red-50 group-hover:scale-110 transition-all shadow-sm">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

function isAICompatible(id: string) {
  return ['smart-summarize', 'smart-extract', 'compare', 'upscale-img', 'remove-bg'].includes(id);
}

export default ProcessingView;
