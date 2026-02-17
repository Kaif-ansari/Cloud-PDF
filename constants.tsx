
import React from 'react';
import { 
  Combine, 
  Scissors, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Stamp, 
  RotateCw, 
  MessageSquareText, 
  Sparkles,
  FileCode
} from 'lucide-react';
import { PDFTool, ToolType } from './types';

export const PDF_TOOLS: PDFTool[] = [
  {
    id: ToolType.MERGE,
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document easily.',
    icon: 'Combine',
    color: 'bg-blue-500',
    category: 'edit'
  },
  {
    id: ToolType.SPLIT,
    title: 'Split PDF',
    description: 'Extract pages from your PDF or save each page as a separate PDF.',
    icon: 'Scissors',
    color: 'bg-red-500',
    category: 'edit'
  },
  {
    id: ToolType.COMPRESS,
    title: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: 'Zap',
    color: 'bg-amber-500',
    category: 'optimize'
  },
  {
    id: ToolType.PDF_TO_WORD,
    title: 'PDF to Word',
    description: 'Convert your PDF documents to Word documents with high accuracy.',
    icon: 'FileCode',
    color: 'bg-indigo-500',
    category: 'convert'
  },
  {
    id: ToolType.PDF_TO_JPG,
    title: 'PDF to JPG',
    description: 'Extract images from your PDF or save each page as a JPG image.',
    icon: 'ImageIcon',
    color: 'bg-emerald-500',
    category: 'convert'
  },
  {
    id: ToolType.WATERMARK,
    title: 'Watermark',
    description: 'Stamp an image or text over your PDF in seconds.',
    icon: 'Stamp',
    color: 'bg-pink-500',
    category: 'edit'
  },
  {
    id: ToolType.ROTATE,
    title: 'Rotate PDF',
    description: 'Rotate your PDF pages how you need them. Even multiple PDFs!',
    icon: 'RotateCw',
    color: 'bg-purple-500',
    category: 'edit'
  },
  {
    id: ToolType.AI_CHAT,
    title: 'Chat with PDF',
    description: 'Ask questions, get summaries, and extract insights using AI.',
    icon: 'MessageSquareText',
    color: 'bg-cyan-500',
    category: 'ai'
  },
  {
    id: ToolType.AI_SUMMARIZE,
    title: 'AI Summarize',
    description: 'Instantly summarize long PDF documents into key bullet points.',
    icon: 'Sparkles',
    color: 'bg-violet-500',
    category: 'ai'
  }
];

export const ICON_MAP: Record<string, any> = {
  Combine,
  Scissors,
  Zap,
  FileText,
  ImageIcon,
  Stamp,
  RotateCw,
  MessageSquareText,
  Sparkles,
  FileCode
};
