import React, { useState, useEffect } from 'react';
// If this still shows an error, ensure the path to your types file is correct
import { AuthMode } from '../types'; 

interface AuthPageProps {
  initialMode: AuthMode;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onBack }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onBack(); // Simulate successful auth
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white animate-in fade-in duration-500 overflow-hidden fixed inset-0 z-[100]">
      {/* Left Panel */}
      <div className="lg:w-1/2 bg-[#F8FAFC] flex flex-col justify-center p-12 lg:p-24 relative overflow-hidden hidden lg:flex">
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-3 mb-12 cursor-pointer group" onClick={onBack}>
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110">S</div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">SignFlow</span>
          </div>

          <h2 className="text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
            {mode === 'SIGNUP' ? 'Join millions of users working better with PDFs' : 'The professional toolkit for your documents'}
          </h2>
          
          <div className="space-y-8">
            <ValueItem icon="⚡" title="Bulk Processing" desc="Process hundreds of files at once." />
            <ValueItem icon="✨" title="Gemini AI Tools" desc="Summarize and analyze with advanced AI." />
            <ValueItem icon="🔒" title="Bank-Level Security" desc="Encrypted and automatically deleted." />
          </div>
        </div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-50 rounded-full blur-[120px] -z-0"></div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-24 bg-white relative">
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">
            {mode === 'LOGIN' ? 'Login' : 'Sign Up'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'SIGNUP' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" required placeholder="John Doe" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-red-500 outline-none transition-all" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input type="email" required placeholder="name@company.com" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-red-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input type="password" required placeholder="••••••••" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-red-500 outline-none transition-all" />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-500 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : (mode === 'LOGIN' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
              className="font-black text-red-500 uppercase tracking-widest text-xs"
            >
              {mode === 'LOGIN' ? 'Switch to Sign Up' : 'Switch to Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueItem = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="flex items-start space-x-5">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100 flex-shrink-0">{icon}</div>
    <div>
      <h4 className="text-lg font-black text-gray-900 tracking-tight">{title}</h4>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SocialButton = ({ icon, label }: { icon: string; label: string }) => (
  <button className="flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all w-full">
    <img src={icon} className="h-5 w-5" alt={label} />
    <span className="text-sm font-bold text-gray-700">{label}</span>
  </button>
);

export default AuthPage;