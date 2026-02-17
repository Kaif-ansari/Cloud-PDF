
import React, { useCallback, useRef, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  multiple = true, 
  accept = ".pdf",
  maxSizeMB = 50 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative w-full min-h-[400px] flex flex-col items-center justify-center p-12
        border-3 border-dashed rounded-3xl transition-all cursor-pointer
        ${isDragging 
          ? 'border-red-500 bg-red-50 scale-[0.99]' 
          : 'border-slate-200 bg-white hover:border-red-400 hover:bg-slate-50'
        }
      `}
    >
      <input 
        type="file" 
        multiple={multiple} 
        accept={accept} 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <Upload className="w-12 h-12 text-red-600" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
        Select PDF files
      </h2>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        or drop PDFs here. Your files are processed securely and deleted automatically after download.
      </p>
      
      <button className="bg-red-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95">
        Select Files
      </button>

      <div className="absolute bottom-8 flex items-center text-slate-400 text-xs">
        <AlertCircle className="w-4 h-4 mr-2" />
        <span>Max file size: {maxSizeMB}MB</span>
      </div>
    </div>
  );
};

export default FileUploader;
