import React, { useState } from 'react';
import { PDFTool } from '../types';

interface ToolCardProps {
  tool: PDFTool;
  onClick: (tool: PDFTool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={() => onClick(tool)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-red-100 flex flex-col h-full overflow-hidden"
    >
      {tool.isNew && (
        <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse z-20">
          New
        </span>
      )}

      {/* Dynamic Slide-up Context Tooltip (Shows full description on hover) */}
      <div className={`
        absolute inset-0 bg-white/95 backdrop-blur-md p-6 flex flex-col justify-center text-center transition-all duration-500 ease-out z-10
        ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}>
        <div className={`${tool.color} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
          <span className="font-black">{tool.icon.length > 2 ? '✨' : tool.icon}</span>
        </div>
        <h4 className="font-black text-gray-900 text-sm mb-2 uppercase tracking-tight">{tool.name}</h4>
        <p className="text-[11px] text-gray-600 font-medium leading-relaxed mb-4">{tool.description}</p>
        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Click to launch tool</span>
      </div>

      {/* Default Card View */}
      <div className="relative z-0 flex flex-col h-full">
        <div className={`${tool.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-sm transition-transform group-hover:scale-110`}>
          {tool.icon.length > 2 ? <span className="text-2xl">{tool.icon}</span> : <span className="font-bold text-xl">{tool.icon}</span>}
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-2 uppercase tracking-tight">{tool.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed flex-grow line-clamp-2">
          {tool.description}
        </p>
      </div>
    </div>
  );
};

export default ToolCard;