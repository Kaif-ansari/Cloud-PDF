
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDF_TOOLS, ICON_MAP } from '../constants';
import { PDFTool, FileStatus, ToolType } from '../types';
import FileUploader from '../components/FileUploader';
import { 
  ArrowLeft, 
  File, 
  Settings, 
  Download, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  Send,
  Sparkles,
  X,
  Plus,
  Trash2,
  FileText,
  Zap
} from 'lucide-react';
import { geminiService, GeminiService } from '../services/geminiService';

interface ToolPageProps {
  toolId: string;
  onBack: () => void;
}

const ToolPage: React.FC<ToolPageProps> = ({ toolId, onBack }) => {
  const tool = PDF_TOOLS.find(t => t.id === toolId);
  const IconComponent = tool ? ICON_MAP[tool.icon] : null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [aiResponse, setAiResponse] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  
  // Download state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [compressionStats, setCompressionStats] = useState<{ original: string, compressed: string, saved: string } | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newFiles: FileStatus[] = selectedFiles.map(f => ({
      file: f,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleAddFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const startProcessing = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setCompressionStats(null);
    setResultBlob(null);

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + Math.random() * 15));
    }, 200);

    try {
      // Simulate backend delay for complex processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      // AI specific logic - extracts text from the first file
      if (toolId === ToolType.AI_SUMMARIZE || toolId === ToolType.AI_CHAT) {
        const text = await GeminiService.extractTextMock(files[0].file);
        if (toolId === ToolType.AI_SUMMARIZE) {
          const summary = await geminiService.summarizePDF(text);
          setAiResponse(summary || "");
        } else {
          setAiResponse("I've analyzed your document. What would you like to know?");
        }
      }

      // CORE FIX: Use actual file data for the result to preserve original content
      // In a real production app, this blob would come from a server response after processing.
      // Here, we take the original file's ArrayBuffer to ensure the downloaded file is the user's actual file.
      const firstFile = files[0].file;
      const arrayBuffer = await firstFile.arrayBuffer();
      
      // Determine the mime type for the result
      let resultMimeType = firstFile.type;
      if (toolId === ToolType.PDF_TO_WORD) resultMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (toolId === ToolType.PDF_TO_JPG) resultMimeType = 'image/jpeg';
      if (toolId === ToolType.JPG_TO_PDF) resultMimeType = 'application/pdf';

      const finalBlob = new Blob([arrayBuffer], { type: resultMimeType });
      setResultBlob(finalBlob);

      // Compression specific statistics simulation
      if (toolId === ToolType.COMPRESS) {
        const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
        const savedRatio = 0.4 + (Math.random() * 0.2); // 40-60% savings simulation
        const compressedSize = totalSize * (1 - savedRatio);
        
        setCompressionStats({
          original: (totalSize / (1024 * 1024)).toFixed(2) + ' MB',
          compressed: (compressedSize / (1024 * 1024)).toFixed(2) + ' MB',
          saved: (savedRatio * 100).toFixed(0) + '%'
        });
      }
      
      clearInterval(interval);
      setProgress(100);
      setProcessing(false);
      setCompleted(true);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      clearInterval(interval);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Determine file extension based on tool
    let extension = '.pdf';
    if (toolId === ToolType.PDF_TO_WORD) extension = '.docx';
    if (toolId === ToolType.PDF_TO_JPG) extension = '.jpg';
    if (toolId === ToolType.JPG_TO_PDF) extension = '.pdf';
    
    const fileName = files.length > 0 
      ? files[0].file.name.split('.').slice(0, -1).join('.') + '_cloudpdf' + extension
      : 'cloudpdf_result' + extension;
      
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput("");
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    
    const text = await GeminiService.extractTextMock(files[0].file);
    const response = await geminiService.chatWithPDF(text, msg, []);
    setChatHistory(prev => [...prev, { role: 'ai', content: response || "" }]);
  };

  if (!tool) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-20"
    >
      <input 
        type="file" 
        multiple 
        accept={toolId === ToolType.JPG_TO_PDF ? "image/*" : ".pdf"} 
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Header / Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <button 
            onClick={onBack}
            className="group flex items-center text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
          </button>
          
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm text-xs font-bold">
            <span className="text-slate-400">Tools</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-400 capitalize">{tool.category}</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-red-600">{tool.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Workspace Area */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {files.length === 0 ? (
                <motion.div 
                  key="uploader"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <FileUploader 
                    onFilesSelected={handleFilesSelected} 
                    accept={toolId === ToolType.JPG_TO_PDF ? "image/*" : ".pdf"}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="workbench"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[600px] flex flex-col"
                >
                  {/* File List / Content */}
                  <div className="flex-grow p-8 md:p-12 overflow-y-auto max-h-[700px]">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Workspace</h3>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{files.length} File(s) Ready</p>
                      </div>
                      {!processing && !completed && (
                        <button 
                          onClick={() => setFiles([])}
                          className="text-slate-400 hover:text-red-600 p-2 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Compression Stats Banner */}
                    {completed && toolId === ToolType.COMPRESS && compressionStats && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-[2rem] p-8 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-6">
                          <div className="bg-amber-100 p-4 rounded-2xl shadow-sm">
                            <Zap className="w-8 h-8 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-amber-900">Compression Successful!</h4>
                            <p className="text-amber-700 font-medium">Your file is now optimized for sharing.</p>
                          </div>
                        </div>
                        <div className="flex gap-8 text-right pr-4">
                          <div>
                            <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Original</p>
                            <p className="text-lg font-black text-slate-400 line-through">{compressionStats.original}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Compressed</p>
                            <p className="text-lg font-black text-amber-600">{compressionStats.compressed}</p>
                          </div>
                          <div className="bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center justify-center font-black">
                            -{compressionStats.saved}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatePresence>
                        {files.map(fs => (
                          <motion.div 
                            key={fs.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group relative bg-slate-50/80 border border-slate-100 rounded-3xl p-6 flex items-center hover:bg-white hover:shadow-xl transition-all"
                          >
                            <div className="bg-white p-4 rounded-2xl shadow-sm mr-5 group-hover:rotate-6 transition-transform">
                              <FileText className="w-7 h-7 text-red-600" />
                            </div>
                            <div className="flex-grow min-w-0 pr-6">
                              <p className="text-sm font-black text-slate-800 truncate mb-1">{fs.file.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {(fs.file.size / (1024 * 1024)).toFixed(2)}MB • {fs.file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                              </p>
                            </div>
                            {!processing && !completed && (
                              <button 
                                onClick={() => removeFile(fs.id)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {!completed && !processing && (
                        <button 
                          onClick={handleAddFilesClick}
                          className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-red-400 hover:text-red-600 transition-all hover:bg-red-50 group"
                        >
                          <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Plus className="w-5 h-5" /></div>
                          <span className="text-xs font-black uppercase tracking-widest">Add More Files</span>
                        </button>
                      )}
                    </div>

                    {/* AI Insights Panel */}
                    {(completed && (toolId === ToolType.AI_SUMMARIZE || toolId === ToolType.AI_CHAT)) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 space-y-6"
                      >
                        <div className="h-px bg-slate-100 mb-10"></div>
                        
                        {toolId === ToolType.AI_SUMMARIZE && (
                          <div className="bg-violet-50 rounded-[2rem] p-10 border border-violet-100">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="bg-white p-3 rounded-2xl shadow-sm"><Sparkles className="w-5 h-5 text-violet-600" /></div>
                              <h4 className="text-xl font-black text-violet-900 tracking-tight">AI Executive Summary</h4>
                            </div>
                            <p className="text-violet-800 leading-relaxed text-sm font-medium whitespace-pre-line bg-white/50 p-6 rounded-2xl">
                              {aiResponse}
                            </p>
                          </div>
                        )}

                        {toolId === ToolType.AI_CHAT && (
                          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl">
                            <div className="bg-slate-900 p-6 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-red-500" />
                                <span className="text-white text-xs font-black uppercase tracking-widest">AI Document Assistant</span>
                              </div>
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <div className="h-[400px] overflow-y-auto p-8 space-y-6 bg-slate-50/50">
                              <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 p-5 rounded-3xl rounded-tl-none shadow-sm max-w-[85%] text-sm font-medium text-slate-700 leading-relaxed">
                                  {aiResponse}
                                </div>
                              </div>
                              {chatHistory.map((chat, idx) => (
                                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`p-5 rounded-3xl shadow-sm max-w-[85%] text-sm font-medium leading-relaxed ${
                                    chat.role === 'user' 
                                    ? 'bg-red-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                  }`}>
                                    {chat.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="p-6 bg-white border-t border-slate-100">
                              <div className="relative group">
                                <input 
                                  type="text" 
                                  value={userInput}
                                  onChange={(e) => setUserInput(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                  placeholder="Ask me anything about these documents..."
                                  className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-8 pr-16 focus:ring-4 focus:ring-red-500/10 focus:bg-white transition-all font-medium"
                                />
                                <button 
                                  onClick={handleSendMessage}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 hover:scale-105 transition-all shadow-lg shadow-red-200"
                                >
                                  <Send className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Desktop Actions Bar */}
                  {!processing && !completed && (
                    <div className="p-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Ready to Process</p>
                      <button 
                        onClick={startProcessing}
                        className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all hover:scale-105 shadow-xl"
                      >
                        Execute {tool.title}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl sticky top-28">
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {IconComponent && <IconComponent className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">{tool.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.category} Module v2.4</p>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center">
                    <Settings className="w-3 h-3 mr-2" /> Global Parameters
                  </h4>
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-red-200 transition-colors cursor-pointer">
                      <span className="text-sm font-bold text-slate-700">High Precision OCR</span>
                      <div className="w-10 h-6 bg-slate-200 rounded-full relative p-1 group-hover:bg-red-100 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-red-200 transition-colors cursor-pointer">
                      <span className="text-sm font-bold text-slate-700">Auto-Optimization</span>
                      <div className="w-10 h-6 bg-slate-200 rounded-full relative p-1 group-hover:bg-red-100 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  {processing ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest animate-pulse">Processing...</span>
                        <span className="text-xs font-black text-red-600">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-red-600 rounded-full"
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold text-center italic uppercase">Cloud engine is allocating workers...</p>
                    </div>
                  ) : completed ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center text-emerald-500 font-black text-sm uppercase mb-4 tracking-widest animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Task Finalized
                      </div>
                      <button 
                        onClick={handleDownload}
                        className="w-full bg-red-600 text-white py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-red-200 hover:bg-red-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                      >
                        <Download className="w-6 h-6" />
                        Download Result
                      </button>
                      <button 
                        onClick={() => { 
                          setCompleted(false); 
                          setProgress(0); 
                          setFiles([]); 
                          setChatHistory([]); 
                          setResultBlob(null);
                          setCompressionStats(null);
                        }}
                        className="w-full py-4 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-widest"
                      >
                        Start Over
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button 
                        onClick={startProcessing}
                        disabled={files.length === 0}
                        className={`w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl transition-all ${
                          files.length > 0 
                          ? 'bg-slate-900 text-white hover:bg-red-600 hover:-translate-y-1' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        Process {tool.title}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest leading-relaxed">
                        BANK-GRADE SSL ENCRYPTION ACTIVE
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolPage;
