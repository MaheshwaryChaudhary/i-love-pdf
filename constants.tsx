
import { PDFTool, ToolCategory } from './types';

export const TOOLS: PDFTool[] = [
  // ORGANIZE
  { id: 'merge', name: 'Merge PDF', description: 'Unify your workflow. Effortlessly combine multiple files into one perfectly organized PDF.', icon: 'M', color: 'bg-orange-500', category: 'Organize' },
  { id: 'split', name: 'Split PDF', description: 'Precision separation. Extract specific page ranges or divide large files into manageable parts instantly.', icon: 'S', color: 'bg-orange-400', category: 'Organize' },
  { id: 'remove-pages', name: 'Remove Pages', description: 'Clean your workspace. Strip unwanted pages from your PDFs to keep only what matters.', icon: '🗑️', color: 'bg-orange-600', category: 'Organize' },
  { id: 'extract-pages', name: 'Extract Pages', description: 'Isolate key content. Pull high-priority pages into a fresh, new PDF document with one click.', icon: '📂', color: 'bg-orange-300', category: 'Organize' },
  { id: 'organize', name: 'Organize PDF', description: 'Master your layout. Rearrange, rotate, and sort pages using a simple drag-and-drop interface.', icon: 'O', color: 'bg-orange-500', category: 'Organize' },
  { id: 'scan-pdf', name: 'Scan to PDF', description: 'Go paperless. Transform physical documents into high-quality digital PDFs using your device camera.', icon: '📷', color: 'bg-orange-400', category: 'Organize' },
  { id: 'rotate', name: 'Rotate PDF', description: 'Perfect orientation. Bulk rotate pages to ensure every document is readable and professional.', icon: '🔄', color: 'bg-orange-500', category: 'Organize' },
  { id: 'page-numbers', name: 'Page Numbers', description: 'Professional indexing. Add customized page numbers to keep your long-form documents structured.', icon: '1️⃣', color: 'bg-orange-600', category: 'Organize' },
  { id: 'watermark', name: 'Add Watermark', description: 'Protect your IP. Stamp professional text or image watermarks across all pages effortlessly.', icon: '💧', color: 'bg-orange-400', category: 'Organize' },
  { id: 'crop', name: 'Crop PDF', description: 'Surgical precision. Trim page margins or focus on specific content areas with easy-to-use crop tools.', icon: '✂️', color: 'bg-orange-500', category: 'Organize' },

  // OPTIMIZE
  { id: 'compress', name: 'Compress PDF', description: 'Shrink your storage, not your quality. Drastically reduce file sizes for faster sharing and uploading.', icon: 'C', color: 'bg-red-500', category: 'Optimize' },
  { id: 'repair', name: 'Repair PDF', description: 'Rescue your data. Restore access to corrupted or damaged PDFs with advanced recovery algorithms.', icon: '🛠️', color: 'bg-red-400', category: 'Optimize' },
  { id: 'ocr', name: 'OCR PDF', description: 'Make it searchable. Convert scanned images and static PDFs into fully editable, searchable text layers.', icon: '👁️', color: 'bg-red-600', category: 'Optimize' },
  { id: 'edit', name: 'Edit PDF', description: 'Direct modification. Add text, images, and annotations directly to your PDF without original source files.', icon: '📝', color: 'bg-red-500', category: 'Optimize' },

  // CONVERT TO PDF
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Gallery to Document. Convert image collections into professional, high-fidelity PDF presentations.', icon: '🖼️', color: 'bg-blue-500', category: 'Convert to PDF' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Flawless publishing. Transform Word docs into universal PDFs while preserving every font and layout detail.', icon: 'W', color: 'bg-blue-600', category: 'Convert to PDF' },
  { id: 'ppt-to-pdf', name: 'POWERPOINT to PDF', description: 'Pitch preservation. Lock in your slide designs by converting complex presentations into shareable PDFs.', icon: 'P', color: 'bg-blue-700', category: 'Convert to PDF' },
  { id: 'excel-to-pdf', name: 'EXCEL to PDF', description: 'Report ready. Turn spreadsheets into clean, readable PDF reports that look great on any device.', icon: 'X', color: 'bg-blue-500', category: 'Convert to PDF' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Web archiving. Convert entire live web pages into high-quality PDFs for offline reading or proofing.', icon: '🌐', color: 'bg-blue-400', category: 'Convert to PDF' },

  // CONVERT FROM PDF
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Visual extraction. Save every PDF page as a high-resolution JPG image for social media or slides.', icon: '🖼️', color: 'bg-cyan-500', category: 'Convert from PDF' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Unlock editability. Transform static PDFs back into fully editable Word documents with high accuracy.', icon: 'P', color: 'bg-cyan-600', category: 'Convert from PDF' },
  { id: 'pdf-to-ppt', name: 'PDF to POWERPOINT', description: 'Slide revival. Convert PDF reports back into editable PowerPoint slides for your next big meeting.', icon: '📽️', color: 'bg-cyan-700', category: 'Convert from PDF' },
  { id: 'pdf-to-excel', name: 'PDF to EXCEL', description: 'Data harvesting. Extract complex tables from PDFs directly into clean, organized Excel spreadsheets.', icon: '📊', color: 'bg-cyan-500', category: 'Convert from PDF' },
  { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', description: 'Future-proof archiving. Convert documents to the long-term ISO standard for digital preservation.', icon: '📜', color: 'bg-cyan-400', category: 'Convert from PDF' },

  // SECURITY
  { id: 'unlock', name: 'Unlock PDF', description: 'Restore access. Quickly remove restrictions and passwords from secured PDFs to get work done.', icon: '🔓', color: 'bg-gray-700', category: 'Security' },
  { id: 'protect', name: 'Protect PDF', description: 'Bank-grade security. Secure sensitive documents with industrial encryption and custom permissions.', icon: '🔒', color: 'bg-gray-800', category: 'Security' },
  { id: 'sign', name: 'Sign PDF', description: 'Streamline agreements. Add legally-binding digital signatures to any document without printing.', icon: '✍️', color: 'bg-gray-900', category: 'Security' },
  { id: 'redact', name: 'Redact PDF', description: 'Privacy assurance. Permanently blackout sensitive information and metadata for safe public sharing.', icon: '◼️', color: 'bg-black', category: 'Security' },

  // SMART / NEW
  { 
    id: 'compare', 
    name: 'Compare PDF', 
    description: 'Precision auditing. Side-by-side comparison of two PDFs with intelligent highlighting of all differences.', 
    icon: '⚖️', 
    color: 'bg-indigo-600', 
    category: 'Smart', 
    isNew: true 
  },
  { 
    id: 'smart-summarize', 
    name: 'AI Summarize', 
    description: 'Instant clarity. Leverage Gemini AI to distill lengthy documents into actionable summaries in seconds.', 
    icon: '✨', 
    color: 'bg-indigo-500', 
    category: 'Smart' 
  },
  { 
    id: 'smart-extract', 
    name: 'AI Extract Insights', 
    description: 'Uncover hidden value. Use Gemini AI to automatically identify stakeholders, dates, and strategic insights.', 
    icon: '🧠', 
    color: 'bg-indigo-700', 
    category: 'Smart' 
  },
];

export const IMAGE_TOOLS: PDFTool[] = [
  { id: 'compress-img', name: 'Compress IMAGE', description: 'Optimize for speed. Reduce image file sizes for faster web performance without visual quality loss.', icon: '↘️↖️', color: 'bg-green-500', category: 'Image-Optimize' },
  { id: 'resize-img', name: 'Resize IMAGE', description: 'Perfect fit. Adjust your images to exact pixel or percentage dimensions with high-quality resampling.', icon: '📐', color: 'bg-blue-400', category: 'Image-Optimize' },
  { id: 'crop-img', name: 'Crop IMAGE', description: 'Refine your focus. Trim unwanted edges or focus on subjects with an intuitive visual cropping tool.', icon: '✂️', color: 'bg-cyan-500', category: 'Image-Edit' },
  { id: 'convert-to-jpg', name: 'Convert to JPG', description: 'Universal format. Bulk transform various image types into high-compatibility JPGs instantly.', icon: '🖼️', color: 'bg-yellow-500', category: 'Image-Convert' },
  { id: 'convert-from-jpg', name: 'Convert from JPG', description: 'Total flexibility. Turn JPGs into PNGs for transparency or create animated GIFs from multiple shots.', icon: '📂', color: 'bg-yellow-600', category: 'Image-Convert' },
  { id: 'photo-editor', name: 'Photo editor', description: 'Creative control. Enhance shots with professional filters, text overlays, and high-end editing tools.', icon: '✏️', color: 'bg-purple-500', category: 'Image-Edit' },
  { id: 'upscale-img', name: 'Upscale Image', description: 'Beyond resolution. Use AI to enlarge images while restoring detail and removing visual noise.', icon: '✨', color: 'bg-green-400', category: 'Image-Optimize', isNew: true },
  { id: 'remove-bg', name: 'Remove background', description: 'Instant cutouts. Isolate subjects with high-precision AI background removal in one single click.', icon: '🖼️', color: 'bg-green-600', category: 'Image-Edit', isNew: true },
  { id: 'watermark-img', name: 'Watermark IMAGE', description: 'Branding security. Stamp text or logos over your images with custom transparency and placement.', icon: '💧', color: 'bg-blue-600', category: 'Image-Security' } as any,
  { id: 'meme-gen', name: 'Meme generator', description: 'Viral creativity. Fast-track your memes using popular templates or your own custom images.', icon: '😄', color: 'bg-pink-500', category: 'Image-Creative' },
  { id: 'rotate-img', name: 'Rotate IMAGE', description: 'Bulk alignment. Fix the orientation of entire image collections simultaneously with smart rotation.', icon: '🔄', color: 'bg-cyan-400', category: 'Image-Edit' },
  { id: 'html-to-img', name: 'HTML to IMAGE', description: 'Web capture. Transform live websites into high-resolution JPG or SVG images for your portfolio.', icon: '🌐', color: 'bg-orange-500', category: 'Image-Creative' },
  { id: 'blur-face', name: 'Blur face', description: 'Privacy protection. Automatically detect and obscure faces or sensitive info for safe public sharing.', icon: '👤', color: 'bg-indigo-500', category: 'Image-Security', isNew: true } as any,
];

export const CATEGORIES: ToolCategory[] = [
  'All', 'Organize', 'Optimize', 'Convert to PDF', 'Convert from PDF', 'Security', 'Smart'
];

export const IMAGE_CATEGORIES: string[] = [
  'All', 'Optimize', 'Creative', 'Edit', 'Convert', 'Security'
];
