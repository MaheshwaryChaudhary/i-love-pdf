
import React, { useState, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import ToolCard from './components/ToolCard';
import NewsCard from './components/NewsCard';
import ProcessingView from './components/ProcessingView';
import AuthPage from './components/AuthPage';
import { PDFTool, ToolCategory, ViewType, AuthMode } from './types';
import { TOOLS, CATEGORIES, IMAGE_TOOLS, IMAGE_CATEGORIES } from './constants';

interface ApiKey {
  id: string;
  name: string;
  value: string;
  status: 'Active' | 'Revoked';
  created: string;
}

// --- Sub-components for API Dashboard ---

const ApiKeyRow = ({ name, value, created, onRevoke }: { name: string, value: string, created: string, onRevoke: () => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedValue = value.substring(0, 10) + "••••••••••••••••••••••••";

  return (
    <tr className="group">
      <td className="py-10 font-black text-gray-900 text-2xl tracking-tighter">{name}</td>
      <td className="py-10">
        <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl px-6 py-4 font-mono text-sm text-[#94A3B8] w-fit flex items-center space-x-6 shadow-inner relative overflow-hidden group/key">
          <span className="relative z-10">{maskedValue}</span>
          <button 
            onClick={handleCopy}
            className={`relative z-10 font-black text-[11px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 border ${copied ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-600 border-[#E2E8F0] hover:bg-gray-50'}`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </td>
      <td className="py-10">
        <div className="flex items-center space-x-2 text-green-500 font-black text-sm uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Active</span>
        </div>
        <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Created {created}</div>
      </td>
      <td className="py-10 text-right px-4">
        <button 
          onClick={onRevoke}
          className="text-red-500 font-black text-[12px] uppercase tracking-widest hover:bg-red-50 px-8 py-3 rounded-2xl transition-all border border-transparent hover:border-red-100 active:scale-95"
        >
          Revoke Key
        </button>
      </td>
    </tr>
  );
};

const ProductSwitcher = ({ currentView, onViewChange }: { currentView: ViewType | 'API_LANDING', onViewChange: (view: ViewType) => void }) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white p-2 rounded-[28px] shadow-xl border border-gray-100 flex items-center space-x-2 relative z-30">
        <button 
          onClick={() => onViewChange('LANDING')}
          className={`px-10 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${currentView === 'LANDING' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
          <span>PDF Tools</span>
        </button>
        <button 
          onClick={() => onViewChange('IMAGE_LANDING')}
          className={`px-10 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${currentView === 'IMAGE_LANDING' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          <span>Image Tools</span>
        </button>
      </div>
    </div>
  );
};

const ProductItem = ({ iconColor, heartColor, title, desc, onClick, active }: any) => (
  <div 
    className={`flex items-center space-x-8 cursor-pointer group p-7 rounded-[32px] transition-all border-2 ${active ? 'bg-white border-indigo-500 shadow-3xl scale-[1.03] relative z-10' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'}`} 
    onClick={onClick}
  >
    <div className={`w-18 h-18 ${iconColor} rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm flex-shrink-0`}>
      <svg className={`w-9 h-9 ${heartColor} drop-shadow-sm`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
    <div className="flex flex-col">
      <h5 className="font-black text-gray-800 text-3xl leading-none group-hover:text-red-500 transition-colors tracking-tighter">{title}</h5>
      <p className="text-gray-400 text-lg font-bold mt-2 leading-tight">{desc}</p>
    </div>
  </div>
);

const DetailLink = ({ icon, label, light, onClick }: any) => (
  <div onClick={onClick} className={`flex items-center space-x-8 cursor-pointer group transition-all`}>
    <div className={`w-16 h-16 flex items-center justify-center rounded-[24px] bg-white border border-[#F1F5F9] shadow-sm transition-all group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white ${light ? 'grayscale scale-75 opacity-30' : 'text-gray-400 group-hover:text-white'}`}>
      {icon}
    </div>
    <span className={`font-black tracking-tighter transition-colors group-hover:text-red-500 ${light ? 'text-2xl text-gray-400' : 'text-4xl text-gray-800'}`}>
      {label}
    </span>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType | 'API_LANDING'>('LANDING');
  const [selectedTool, setSelectedTool] = useState<PDFTool | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [activeImageCategory, setActiveImageCategory] = useState<string>('All');

  // Modal States
  const [activeModal, setActiveModal] = useState<'HELP' | 'PRICING' | 'SECURITY' | 'FEATURES' | 'ABOUT' | 'LANGUAGE' | null>(null);

  // State for API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', name: 'Production Environment', value: 'sf_live_8f2k9l3m1n0p4q5r6s7t8u9v0w1x2y3z', status: 'Active', created: 'Oct 24, 2024' },
    { id: '2', name: 'Staging/Test Key', value: 'sf_test_k9l3m1n0p4q5r6s7t8u9v0w1x2y3z8f2', status: 'Active', created: 'Jan 12, 2025' },
  ]);

  const filteredTools = useMemo(() => {
    if (activeCategory === 'All') return TOOLS;
    return TOOLS.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const filteredImageTools = useMemo(() => {
    if (activeImageCategory === 'All') return IMAGE_TOOLS;
    return IMAGE_TOOLS.filter(t => t.category.toLowerCase().includes(activeImageCategory.toLowerCase()) || t.category === activeImageCategory);
  }, [activeImageCategory]);

  const handleToolSelect = useCallback((tool: PDFTool) => {
    setSelectedTool(tool);
    setCurrentView('TOOL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToolSelectById = useCallback((toolId: string) => {
    const tool = [...TOOLS, ...IMAGE_TOOLS].find(t => t.id === toolId);
    if (tool) handleToolSelect(tool);
  }, [handleToolSelect]);

  const handleAuthTrigger = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setCurrentView('AUTH');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentView('LANDING');
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateTo = (view: ViewType | 'API_LANDING') => {
    setCurrentView(view);
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateNewKey = () => {
    const name = prompt("Enter a name for your new API key (e.g., 'Internal Tool', 'Mobile App'):");
    if (!name) return;
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: name,
      value: `sf_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status: 'Active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setApiKeys(prev => [newKey, ...prev]);
  };

  const revokeKey = (id: string) => {
    if (confirm("Are you sure you want to revoke this API key? This action is permanent and will immediately disable access for any software currently using it.")) {
      setApiKeys(prev => prev.filter(key => key.id !== id));
    }
  };

  const ModalWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500 relative flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">{title}</span>
          </div>
          <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar 
        onAuth={handleAuthTrigger} 
        onHome={handleGoHome} 
        onToolSelect={handleToolSelectById}
        onViewChange={(view) => {
          setCurrentView(view as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onModalOpen={setActiveModal}
      />

      <main className="flex-grow">
        {currentView === 'AUTH' && <AuthPage initialMode={authMode} onBack={handleGoHome} />}

        {currentView === 'TOOL' && selectedTool && (
          <ProcessingView 
            tool={selectedTool} 
            onBack={handleGoHome} 
            onModalOpen={setActiveModal}
          />
        )}

        {/* ... (API_LANDING, IMAGE_LANDING, LANDING views remain the same as previous) ... */}
        {currentView === 'API_LANDING' && (
          <div className="animate-in fade-in duration-500 bg-white min-h-screen flex flex-col">
             <section className="bg-[#111827] pt-24 pb-48 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500 rounded-full blur-[160px]"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                  <h1 className="text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
                    SignFlow API <br/> Hub & SDK
                  </h1>
                  <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    Integrate industry-leading PDF and image processing tools into your own software stack. High-availability REST API and Native SDKs.
                  </p>
                </div>
             </section>

             <section className="max-w-6xl mx-auto px-6 -mt-32 pb-24 relative z-20 w-full">
                <div className="grid lg:grid-cols-12 gap-0 bg-white rounded-[40px] shadow-3xl border border-gray-100 overflow-hidden min-h-[720px]">
                   <div className="lg:col-span-7 p-14 border-r border-gray-50 bg-white">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12">Other Products</h4>
                      <div className="space-y-8 mb-16">
                         <ProductItem 
                            onClick={() => navigateTo('LANDING')}
                            iconColor="bg-[#FFF1F2]" 
                            heartColor="text-[#E11D48]" 
                            title="SignFlow PDF" 
                            desc="Simplify document management" 
                         />
                         <ProductItem 
                            onClick={() => navigateTo('IMAGE_LANDING')}
                            iconColor="bg-[#EFF6FF]" 
                            heartColor="text-[#2563EB]" 
                            title="SignFlow Image" 
                            desc="Professional image processing tools" 
                         />
                         <ProductItem 
                            active
                            onClick={() => navigateTo('API_LANDING')}
                            iconColor="bg-[#F0FDFA]" 
                            heartColor="text-[#0D9488]" 
                            title="SignFlow API" 
                            desc="Document automation for developers" 
                         />
                      </div>
                      <div className="bg-[#F8FAFC] border border-transparent hover:border-indigo-100 rounded-[32px] p-8 flex items-center space-x-8 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors shadow-sm">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656 0l-4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-black text-gray-800 text-2xl tracking-tight">Integrations</h5>
                          <p className="text-gray-400 text-base font-medium">Zapier, Make, Wordpress, and more...</p>
                        </div>
                        <svg className="w-6 h-6 text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                      </div>
                   </div>
                   <div className="lg:col-span-5 p-14 bg-[#FAFBFF] flex flex-col">
                      <div className="space-y-12 flex-grow">
                         <DetailLink onClick={() => setActiveModal('PRICING')} icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>} label="Pricing" />
                         <DetailLink onClick={() => setActiveModal('SECURITY')} icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>} label="Security" />
                         <DetailLink onClick={() => setActiveModal('FEATURES')} icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>} label="Features" />
                         <DetailLink onClick={() => setActiveModal('ABOUT')} icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>} label="About us" />
                      </div>
                      <div className="pt-16 mt-16 border-t border-gray-100 space-y-10">
                         <DetailLink onClick={() => setActiveModal('HELP')} light icon={<svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>} label="Help" />
                         <DetailLink onClick={() => setActiveModal('LANGUAGE')} light icon={<svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>} label="Language" />
                      </div>
                   </div>
                </div>
             </section>

             <section className="max-w-6xl mx-auto px-6 pb-24 w-full">
                <div className="bg-white border border-gray-100 rounded-[40px] shadow-3xl p-12 overflow-hidden relative">
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                      <div>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">API Key Management</h3>
                        <p className="text-gray-500 font-medium text-lg">Generate and manage secure secret keys for your production and dev environments.</p>
                      </div>
                      <button 
                        onClick={generateNewKey}
                        className="mt-6 md:mt-0 bg-indigo-600 text-white font-black px-10 py-5 rounded-[22px] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95 text-sm uppercase tracking-widest hover:-translate-y-1"
                      >
                        + New Secret Key
                      </button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                          <tr className="border-b border-gray-50">
                            <th className="pb-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">Key Name</th>
                            <th className="pb-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                            <th className="pb-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="pb-8 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {apiKeys.length > 0 ? apiKeys.map(apiKey => (
                            <ApiKeyRow key={apiKey.id} name={apiKey.name} value={apiKey.value} created={apiKey.created} onRevoke={() => revokeKey(apiKey.id)} />
                          )) : (
                            <tr>
                              <td colSpan={4} className="py-20 text-center text-gray-400 font-medium text-lg italic">
                                No API keys found. Start by generating a new secret key.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                   </div>
                </div>
             </section>
          </div>
        )}

        {currentView === 'IMAGE_LANDING' && (
          <div className="animate-in fade-in duration-500">
            <section className="bg-white pt-20 pb-16 px-6 text-center border-b border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[60%] h-full bg-[#EBF5FF] opacity-30 -z-0 rounded-l-[1000px] pointer-events-none translate-x-1/4"></div>
              <div className="relative z-10">
                <h1 className="text-5xl font-black text-gray-800 mb-4 tracking-tighter">Every tool you could want to edit images in bulk</h1>
                <p className="text-xl text-gray-500 font-medium mb-12">Your online photo editor is here and forever free!</p>
                
                <ProductSwitcher currentView={currentView} onViewChange={navigateTo} />

                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {IMAGE_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveImageCategory(cat)} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${activeImageCategory === cat ? 'bg-[#333333] text-white border-[#333333] shadow-md' : 'bg-white text-gray-400 hover:text-gray-800 border-gray-100 hover:border-gray-200'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 py-12">
               <NewsCard />
            </section>
            <section className="max-w-[1400px] mx-auto px-6 py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredImageTools.map((tool) => <ToolCard key={tool.id} tool={tool} onClick={handleToolSelect} />)}
              </div>
            </section>
          </div>
        )}

        {currentView === 'LANDING' && (
          <>
            <section className="text-center py-24 px-6 bg-white relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">Every tool you need to <br className="hidden md:block" /> work with PDFs <span className="text-red-500">in one place</span></h1>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">Join millions of users who simplify document management. SignFlow is 100% FREE and easy to use.</p>
                
                <ProductSwitcher currentView={currentView} onViewChange={navigateTo} />

                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button onClick={() => document.getElementById('tool-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-red-500 text-white font-black px-12 py-5 rounded-[20px] shadow-2xl shadow-red-100 hover:shadow-red-300 transition-all hover:-translate-y-1 uppercase tracking-tighter text-lg active:scale-95">Explore All Tools</button>
                </div>
              </div>
            </section>
            
            <section className="max-w-7xl mx-auto px-6 py-12">
               <NewsCard />
            </section>

            <div className="sticky top-[73px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
              <section className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-[0.15em] ${activeCategory === cat ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
                    {cat}
                  </button>
                ))}
              </section>
            </div>
            <section id="tool-grid" className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} onClick={handleToolSelect} />)}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-24 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-16 mb-24">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center space-x-3 mb-8 cursor-pointer group" onClick={handleGoHome}>
                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-black text-xl transition-transform group-hover:scale-110">S</div>
                        <span className="font-black text-gray-900 text-2xl tracking-tighter">SignFlow</span>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed font-medium">
                        Making PDF and Image management simple, fast, and secure for everyone, everywhere. The complete toolkit for the modern software professional.
                    </p>
                </div>
                <div>
                    <h5 className="font-black text-gray-900 mb-8 uppercase text-[11px] tracking-[0.3em]">Products</h5>
                    <ul className="space-y-6 text-base text-gray-500 font-bold">
                        <li><button onClick={() => navigateTo('LANDING')} className="hover:text-red-500 transition-colors">SignFlow PDF</button></li>
                        <li><button onClick={() => navigateTo('IMAGE_LANDING')} className="hover:text-blue-500 transition-colors">SignFlow Image</button></li>
                        <li><button onClick={() => navigateTo('API_LANDING')} className="hover:text-teal-600 transition-colors">SignFlow API</button></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-black text-gray-900 mb-8 uppercase text-[11px] tracking-[0.3em]">Company</h5>
                    <ul className="space-y-6 text-base text-gray-500 font-bold">
                        <li><button onClick={() => setActiveModal('ABOUT')} className="hover:text-red-500 transition-colors">About Us</button></li>
                        <li><button onClick={() => setActiveModal('PRICING')} className="hover:text-red-500 transition-colors">Pricing</button></li>
                        <li><button onClick={() => setActiveModal('FEATURES')} className="hover:text-red-500 transition-colors">Solutions</button></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-black text-gray-900 mb-8 uppercase text-[11px] tracking-[0.3em]">Support</h5>
                    <ul className="space-y-6 text-base text-gray-500 font-bold">
                        <li><button onClick={() => setActiveModal('HELP')} className="hover:text-red-500 transition-colors">Help Center</button></li>
                        <li><button onClick={() => navigateTo('API_LANDING')} className="hover:text-red-500 transition-colors">API Docs</button></li>
                        <li><button onClick={() => setActiveModal('SECURITY')} className="hover:text-red-500 transition-colors">Security</button></li>
                    </ul>
                </div>
            </div>
            <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[11px] font-black tracking-[0.2em] uppercase">
                <div>© 2025 SIGNFLOW CORE. POWERED BY GEMINI.</div>
                <div className="mt-6 md:mt-0 flex space-x-10">
                    <a href="#" className="hover:text-red-500 transition-colors">GitHub</a>
                    <a href="#" className="hover:text-red-500 transition-colors">Twitter</a>
                    <a href="#" className="hover:text-red-500 transition-colors">Docs</a>
                </div>
            </div>
        </div>
      </footer>

      {/* GLOBAL MODALS */}
      {activeModal === 'PRICING' && (
        <ModalWrapper title="Pricing Plans">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard title="Free" price="$0" features={["Basic PDF tools", "Single image processing", "Community support"]} />
            <PricingCard title="Pro" price="$9" popular features={["Advanced AI analysis", "Batch processing", "Priority support", "Cloud storage"]} />
            <PricingCard title="Enterprise" price="$30" features={["API access", "Team collaboration", "Custom integrations", "Dedicated manager"]} />
          </div>
        </ModalWrapper>
      )}

      {activeModal === 'SECURITY' && (
        <ModalWrapper title="Security & Privacy">
          <div className="space-y-12">
            <div className="grid sm:grid-cols-2 gap-10">
              <SecurityFeature icon="🔒" title="AES-256 Encryption" desc="All files are encrypted using military-grade standards during transit and at rest." />
              <SecurityFeature icon="🗑️" title="Auto-Deletion" desc="Processed files are permanently wiped from our secure servers after 2 hours." />
              <SecurityFeature icon="🛡️" title="GDPR Compliant" desc="We adhere to strict global privacy regulations to ensure your data stays yours." />
              <SecurityFeature icon="🕵️" title="No Data Mining" desc="We never read your content or sell your data to third parties. Period." />
            </div>
            <div className="bg-red-50 p-8 rounded-[32px] border border-red-100">
               <h4 className="font-black text-red-600 mb-2 uppercase text-xs tracking-widest">Trust Commitment</h4>
               <p className="text-gray-600 font-medium leading-relaxed">SignFlow is built on the principle of zero-trust document processing. Your privacy is our product.</p>
            </div>
          </div>
        </ModalWrapper>
      )}

      {activeModal === 'FEATURES' && (
        <ModalWrapper title="Platform Features">
          <div className="grid sm:grid-cols-2 gap-8">
            <FeatureItem title="Gemini AI Assistant" desc="Summarize and extract semantic data from PDFs instantly." />
            <FeatureItem title="High-Fidelity Conversion" desc="Convert Office docs to PDF with 100% layout preservation." />
            <FeatureItem title="Professional Image Lab" desc="Advanced editing, resizing and upscaling tools." />
            <FeatureItem title="Secure Sharing" desc="Password protect and redact sensitive info before sharing." />
          </div>
        </ModalWrapper>
      )}

      {activeModal === 'ABOUT' && (
        <ModalWrapper title="About SignFlow">
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Revolutionizing Document Intelligence.</h3>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Founded in 2025, SignFlow was born out of a simple frustration: document tools were too slow, too expensive, or too complex.
            </p>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Our mission is to democratize high-end document and image processing by combining intuitive design with the power of Google's Gemini AI.
            </p>
            <div className="pt-8 border-t border-gray-100 flex items-center space-x-6">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm"></div>)}
              </div>
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Built by enthusiasts for professionals</span>
            </div>
          </div>
        </ModalWrapper>
      )}

      {activeModal === 'LANGUAGE' && (
        <ModalWrapper title="Select Language">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {["English", "Español", "Français", "Deutsch", "日本語", "中文", "Italiano", "Português", "Русский"].map(lang => (
              <button key={lang} onClick={() => setActiveModal(null)} className="p-6 rounded-2xl border border-gray-100 hover:border-red-500 hover:bg-red-50 font-black text-gray-800 transition-all text-left">
                {lang}
              </button>
            ))}
          </div>
        </ModalWrapper>
      )}

      {activeModal === 'HELP' && (
        <HelpModal onSearch={() => {}} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

const PricingCard = ({ title, price, features, popular }: any) => (
  <div className={`p-8 rounded-[40px] border-2 flex flex-col h-full relative ${popular ? 'border-red-500 bg-white shadow-3xl scale-105 z-10' : 'border-gray-100 bg-gray-50'}`}>
    {popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">Most Popular</span>}
    <h4 className="text-2xl font-black text-gray-900 mb-2">{title}</h4>
    <div className="flex items-baseline space-x-1 mb-8">
      <span className="text-5xl font-black tracking-tighter">{price}</span>
      <span className="text-gray-400 font-bold">/month</span>
    </div>
    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center space-x-3 text-sm font-bold text-gray-600">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${popular ? 'bg-red-500 text-white shadow-xl shadow-red-100 hover:bg-red-600' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'}`}>Get Started</button>
  </div>
);

const SecurityFeature = ({ icon, title, desc }: any) => (
  <div className="flex space-x-6">
    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl">{icon}</div>
    <div>
      <h5 className="font-black text-gray-900 mb-1 tracking-tight">{title}</h5>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FeatureItem = ({ title, desc }: any) => (
  <div className="p-8 bg-white border border-gray-100 rounded-[32px] hover:border-red-100 hover:shadow-xl transition-all group">
    <h5 className="text-xl font-black text-gray-900 mb-2 group-hover:text-red-500 transition-colors">{title}</h5>
    <p className="text-sm text-gray-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const HelpModal = ({ onClose }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const topics = [
    { title: 'Getting Started', desc: 'New to SignFlow? Learn the basics of document management.', icon: '🚀' },
    { title: 'PDF Tools', desc: 'How to merge, split, and compress your files effectively.', icon: '📄' },
    { title: 'AI Assistant', desc: 'Using Gemini AI for summaries and deep insights.', icon: '✨' },
    { title: 'Security & Privacy', desc: 'Learn how we protect your sensitive data.', icon: '🔒' },
    { title: 'API Integration', desc: 'Documentation for developers using our SDK.', icon: '🛠️' },
    { title: 'Billing', desc: 'Managing your subscription and invoices.', icon: '💳' },
  ];

  const filtered = topics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        <div className="w-full md:w-1/3 bg-[#F8FAFC] p-10 border-r border-gray-100">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">Help Center</span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-red-100">
              <h5 className="font-black text-gray-900 text-sm uppercase tracking-tighter mb-1">Live Support</h5>
              <button className="mt-4 w-full bg-red-500 text-white text-[10px] font-black py-3 rounded-xl uppercase tracking-widest">Start Chat</button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 p-10 relative flex flex-col">
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">How can we help?</h2>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..." 
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500"
            />
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((topic, i) => (
              <div key={i} className="bg-white border border-gray-50 p-6 rounded-3xl hover:border-red-100 hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-red-50 group-hover:scale-110 transition-all shadow-sm">{topic.icon}</div>
                <h4 className="font-black text-gray-900 text-lg mb-2 tracking-tight">{topic.title}</h4>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
