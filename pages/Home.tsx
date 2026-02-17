
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDF_TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import { Shield, Zap, Sparkles, Clock, Search, Filter } from 'lucide-react';

interface HomeProps {
  onToolSelect: (toolId: string) => void;
}

const Home: React.FC<HomeProps> = ({ onToolSelect }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'edit', name: 'Edit' },
    { id: 'convert', name: 'Convert' },
    { id: 'optimize', name: 'Optimize' },
    { id: 'ai', name: 'AI Features' }
  ];

  const filteredTools = PDF_TOOLS.filter(t => {
    const matchesFilter = filter === 'all' || t.category === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mesh-gradient min-h-screen">
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-red-500" /> Professional Grade PDF Suite
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-[900] text-slate-900 mb-8 tracking-tighter leading-[0.95]"
          >
            Simplify your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">Document Workflow.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            A high-performance toolkit designed to handle PDFs with speed and precision. No ads, no bloat, just pure productivity.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search tools (e.g., 'Merge', 'Word')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-lg font-medium"
              />
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto mb-16 px-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-8 gap-4 overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === cat.id 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-200' 
                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <Filter className="w-4 h-4" /> 
              Showing {filteredTools.length} tools
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-32">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onClick={onToolSelect} 
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Dynamic Trust Section */}
        <div className="max-w-7xl mx-auto bg-white rounded-[3.5rem] p-12 md:p-24 border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Enterprise-Grade Security by Default.</h2>
              <div className="space-y-8">
                {[
                  { icon: Shield, title: 'End-to-End Encryption', desc: 'Your files are processed using bank-grade AES-256 bit encryption.' },
                  { icon: Clock, title: 'Automatic Sanitization', desc: 'All files are permanently deleted from our servers within 2 hours.' },
                  { icon: Zap, title: 'ISO 27001 Infrastructure', desc: 'Running on globally recognized secure cloud infrastructure.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="bg-red-50 p-4 rounded-2xl shrink-0"><item.icon className="w-6 h-6 text-red-600" /></div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-inner">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black">CP</div>
                <div>
                  <h3 className="font-black text-slate-900">CloudPDF Workspace</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active System Status: Normal</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-4 bg-slate-200 rounded-full w-3/4 shimmer"></div>
                <div className="h-4 bg-slate-200 rounded-full w-full shimmer"></div>
                <div className="h-4 bg-slate-200 rounded-full w-1/2 shimmer"></div>
                <div className="grid grid-cols-3 gap-4 mt-10">
                  <div className="h-20 bg-white rounded-2xl border border-slate-100"></div>
                  <div className="h-20 bg-white rounded-2xl border border-slate-100"></div>
                  <div className="h-20 bg-white rounded-2xl border border-slate-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
