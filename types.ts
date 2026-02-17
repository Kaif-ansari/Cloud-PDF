
export enum ToolType {
  MERGE = 'merge',
  SPLIT = 'split',
  COMPRESS = 'compress',
  PDF_TO_WORD = 'pdf-to-word',
  PDF_TO_JPG = 'pdf-to-jpg',
  JPG_TO_PDF = 'jpg-to-pdf',
  WATERMARK = 'watermark',
  ROTATE = 'rotate',
  AI_CHAT = 'ai-chat',
  AI_SUMMARIZE = 'ai-summarize'
}

export interface PDFTool {
  id: ToolType;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'edit' | 'convert' | 'optimize' | 'ai';
}

export interface FileStatus {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'premium';
  usageCount: number;
}
