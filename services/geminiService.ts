
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use process.env.API_KEY directly in the constructor
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async summarizePDF(text: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Please provide a professional, concise summary of the following PDF content. 
        Focus on key findings and essential takeaways: \n\n${text}`,
        config: {
          temperature: 0.7,
          topP: 0.8,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Summarization Error:", error);
      throw error;
    }
  }

  async chatWithPDF(pdfContext: string, userMessage: string, history: { role: string, parts: { text: string }[] }[]) {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are a helpful PDF assistant. You have access to the following context extracted from a PDF: ${pdfContext}. Answer the user's questions strictly based on this context. If you don't know the answer, say you don't know.`,
        }
      });

      const response = await chat.sendMessage({ message: userMessage });
      return response.text;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  }

  // Simplified PDF text extraction (In production, this happens on backend with python)
  static async extractTextMock(file: File): Promise<string> {
    // In a real app, we'd use pdfjs-dist here or send to backend
    return "This is a simulated extraction of text from " + file.name + ". In a production environment, our Python microservice using pdfplumber would extract thousands of words from this document to feed into the Gemini API.";
  }
}

export const geminiService = new GeminiService();
