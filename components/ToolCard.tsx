
import React from 'react';
import { motion } from 'framer-motion';
import { PDFTool } from '../types';
import { ICON_MAP } from '../constants';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: PDFTool;
  onClick: (toolId: string) => void;
  index: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, index }) => {
  const IconComponent = ICON_MAP[tool.icon];
  
  const glowStyles: Record<string, string> = {
    'edit': 'group-hover:shadow-red-200/50',
    'optimize': 'group-hover:shadow-amber-200/50',
    'convert': 'group-hover:shadow-indigo-200/50',
    'ai': 'group-hover:shadow-violet-200/50'
  };

  const isAI = tool.category === 'ai';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(tool.id)}
      className={`group relative bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 hover:border-slate-200 transition-all duration-300 cursor-pointer overflow-hidden ${glowStyles[tool.category]} hover:shadow-2xl`}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
          >
            {IconComponent && <IconComponent className="w-7 h-7" />}
          </motion.div>
          {isAI && (
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-violet-200">
              <Sparkles className="w-3 h-3" /> AI Powered
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-900 mb-2.5 group-hover:text-red-600 transition-colors">
          {tool.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
          {tool.description}
        </p>
        
        <div className="mt-auto flex items-center text-xs font-bold text-slate-400 group-hover:text-red-600 transition-all">
          <span>CONFIGURE TOOL</span>
          <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Background Decor */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${tool.color}`}></div>
    </motion.div>
  );
};

export default ToolCard;
