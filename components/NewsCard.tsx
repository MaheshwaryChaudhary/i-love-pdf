
import React, { useState, useEffect } from 'react';
import { fetchLatestPDFNews } from '../services/geminiService';

const NewsCard: React.FC = () => {
  const [news, setNews] = useState<string[]>(["Loading the latest document insights...", "Scanning global trends...", "Preparing industry update..."]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const handleFetchNews = async () => {
    setLoading(true);
    try {
      const latestNews = await fetchLatestPDFNews();
      setNews(latestNews);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchNews();
  }, []);

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <h4 className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em]">Industry Pulse</h4>
          </div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Latest News</h3>
        </div>
        
        <button 
          onClick={handleFetchNews}
          disabled={loading}
          className={`
            shimmer-btn flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95
            ${loading ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-black hover:-translate-y-0.5 shadow-lg shadow-gray-200'}
          `}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>Fetch Latest News</span>
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group/item">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover/item:bg-red-500 group-hover/item:text-white transition-all text-xs">
              0{index + 1}
            </div>
            <p className="text-gray-700 font-bold leading-relaxed text-lg tracking-tight group-hover/item:text-gray-900 transition-colors">
              {item}
            </p>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Powered by SignFlow AI News Engine</span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Updated at {lastUpdated}</span>
        </div>
      )}
    </div>
  );
};

export default NewsCard;
