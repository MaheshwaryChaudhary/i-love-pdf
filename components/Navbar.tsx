
import React, { useState, useRef, useEffect } from 'react';
import { AuthMode } from '../types';

interface NavbarProps {
  onAuth: (mode: AuthMode) => void;
  onHome: () => void;
  onToolSelect: (toolId: string) => void;
  onViewChange?: (view: 'LANDING' | 'IMAGE_LANDING' | 'API_LANDING') => void;
  onModalOpen: (modal: 'HELP' | 'PRICING' | 'SECURITY' | 'FEATURES' | 'ABOUT' | 'LANGUAGE') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuth, onHome, onToolSelect, onViewChange, onModalOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (view: 'LANDING' | 'IMAGE_LANDING' | 'API_LANDING') => {
    onViewChange?.(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={onHome}>
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
             <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-black text-gray-800 tracking-tighter">SignFlow</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-6">
          <button onClick={() => onToolSelect('merge')} className="text-gray-500 font-bold hover:text-red-500 transition-colors uppercase text-[11px] tracking-widest">Merge PDF</button>
          <button onClick={() => onToolSelect('split')} className="text-gray-500 font-bold hover:text-red-500 transition-colors uppercase text-[11px] tracking-widest">Split PDF</button>
          <button onClick={() => onToolSelect('compress')} className="text-gray-500 font-bold hover:text-red-500 transition-colors uppercase text-[11px] tracking-widest">Compress PDF</button>
          
          <div className="relative" ref={toolsRef}>
            <button 
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="text-gray-500 font-bold hover:text-red-500 transition-colors uppercase text-[11px] tracking-widest flex items-center"
            >
              More Tools 
              <svg className={`ml-1 w-3 h-3 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
            </button>
            
            {isToolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-4 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <DropdownItem label="PDF to Word" onClick={() => { onToolSelect('pdf-to-word'); setIsToolsDropdownOpen(false); }} />
                <DropdownItem label="AI Summarize" onClick={() => { onToolSelect('smart-summarize'); setIsToolsDropdownOpen(false); }} />
                <DropdownItem label="Protect PDF" onClick={() => { onToolSelect('protect'); setIsToolsDropdownOpen(false); }} />
                <div className="my-2 border-t border-gray-50"></div>
                <DropdownItem label="All PDF Tools" onClick={() => { onHome(); setIsToolsDropdownOpen(false); }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 relative" ref={menuRef}>
        <button 
          onClick={() => onModalOpen('HELP')}
          className="hidden sm:block text-gray-500 font-bold hover:text-red-500 transition-colors uppercase text-[11px] tracking-widest px-4 py-2"
        >
          Help
        </button>

        <button 
          onClick={() => onAuth('LOGIN')}
          className="text-gray-600 font-bold hover:text-gray-900 px-4 py-2 text-sm uppercase tracking-tight"
        >
          Login
        </button>
        <button 
          onClick={() => onAuth('SIGNUP')}
          className="bg-red-500 text-white font-black px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95 text-xs uppercase tracking-widest"
        >
          Sign up
        </button>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-3 rounded-xl transition-all ${isMenuOpen ? 'bg-gray-100 text-red-500 shadow-inner' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h4v4H4V6zm0 7h4v4H4v-4zm0 7h4v4H4v-4zm7-14h4v4h-4V6zm0 7h4v4h-4v-4zm0 7h4v4h-4v-4zm7-14h4v4h-4V6zm0 7h4v4h-4v-4zm0 7h4v4h-4v-4z"/>
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-4 w-[600px] bg-white rounded-[24px] shadow-3xl border border-gray-100 overflow-hidden flex animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-[55%] p-10 border-r border-gray-50 bg-white">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Products</h4>
              <div className="space-y-4">
                <ProductItem 
                  onClick={() => handleProductClick('LANDING')}
                  iconColor="bg-[#FFF1F2]" 
                  heartColor="text-[#E11D48]" 
                  title="SignFlow PDF" 
                  desc="Simplify document management" 
                />
                <ProductItem 
                  onClick={() => handleProductClick('IMAGE_LANDING')}
                  iconColor="bg-[#EFF6FF]" 
                  heartColor="text-[#2563EB]" 
                  title="SignFlow Image" 
                  desc="Professional image processing" 
                />
                <ProductItem 
                  onClick={() => handleProductClick('API_LANDING')}
                  iconColor="bg-[#F0FDFA]" 
                  heartColor="text-[#0D9488]" 
                  title="SignFlow API" 
                  desc="Document automation" 
                />
              </div>
            </div>

            <div className="w-[45%] p-8 bg-white flex flex-col">
              <div className="space-y-6 flex-grow">
                <MenuActionLink 
                  onClick={() => { onModalOpen('PRICING'); setIsMenuOpen(false); }}
                  label="Pricing" 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>} 
                />
                <MenuActionLink 
                  onClick={() => { onModalOpen('SECURITY'); setIsMenuOpen(false); }}
                  label="Security" 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>} 
                />
                <MenuActionLink 
                  onClick={() => { onModalOpen('FEATURES'); setIsMenuOpen(false); }}
                  label="Features" 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>} 
                />
                <MenuActionLink 
                  onClick={() => { onModalOpen('ABOUT'); setIsMenuOpen(false); }}
                  label="About us" 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>} 
                />
                
                <div className="my-6 border-t border-gray-100"></div>

                <MenuActionLink 
                  onClick={() => { onModalOpen('HELP'); setIsMenuOpen(false); }}
                  label="Help" 
                  isSecondary
                  icon={<svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>} 
                />
                <MenuActionLink 
                  onClick={() => { onModalOpen('LANGUAGE'); setIsMenuOpen(false); }}
                  label="Language" 
                  isSecondary
                  icon={<svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const ProductItem = ({ iconColor, heartColor, title, desc, onClick }: { iconColor: string, heartColor: string, title: string, desc: string, onClick?: () => void }) => (
  <div className="flex items-center space-x-6 cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 transition-all" onClick={onClick}>
    <div className={`w-14 h-14 ${iconColor} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
      <svg className={`w-7 h-7 ${heartColor}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
    <div className="flex flex-col">
      <h5 className="font-black text-gray-800 text-lg leading-tight group-hover:text-red-500 transition-colors tracking-tight">{title}</h5>
      <p className="text-gray-400 text-[11px] font-bold leading-tight mt-1">{desc}</p>
    </div>
  </div>
);

const MenuActionLink = ({ icon, label, isSecondary, onClick }: { icon: React.ReactNode, label: string, isSecondary?: boolean, onClick?: () => void }) => (
  <div onClick={onClick} className="flex items-center space-x-6 cursor-pointer group transition-colors">
    <div className={`text-gray-400 group-hover:text-red-500 transition-colors ${isSecondary ? 'w-5 h-5' : 'w-6 h-6'}`}>
      {icon}
    </div>
    <span className={`font-black tracking-tight transition-colors group-hover:text-red-500 ${isSecondary ? 'text-lg text-gray-500' : 'text-2xl text-[#374151]'}`}>
      {label}
    </span>
  </div>
);

const DropdownItem = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full text-left px-6 py-2.5 text-xs font-black text-gray-500 hover:text-red-500 hover:bg-red-50/50 transition-all uppercase tracking-widest"
  >
    {label}
  </button>
);

export default Navbar;
