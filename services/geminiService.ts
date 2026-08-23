import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  const apiKey = 
    process.env.API_KEY || 
    process.env.GEMINI_API_KEY || 
    (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as any).VITE_GEMINI_API_KEY : '');
    
  if (!apiKey || apiKey.trim() === '') {
    console.warn("Gemini API key is not configured.");
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return aiInstance;
};

const MODELS_TO_TRY = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'];

export const sendChatMessage = async (message: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return "The AI assistant is offline: Gemini API key is missing. Please ensure GEMINI_API_KEY is configured in your environment.";
  }

  let lastError: any = null;

  for (const model of MODELS_TO_TRY) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: message,
        config: {
          systemInstruction: "You are a helpful AI assistant for David Varghese's portfolio website. Your name is 'Livoq'. You are polite, enthusiastic, and concise. David Varghese is a CSE student and aspiring software developer interested in cybersecurity and emerging technologies. His key projects are: 1. Intevra (AI integrated interview fraud detection system), 2. Aether (Immersive Regional Weather Experience Application), 3. MediSense AI (disease prediction system based on symptoms), 4. Equora (Python-Based Mathematical Equation Solver). Keep answers short (under 50 words unless asked for detail) and encourage visitors to connect via david3005.scd@gmail.com.",
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (error: any) {
      console.warn(`Model ${model} failed, trying fallback:`, error?.message || error);
      lastError = error;
      // If error is 503 or overload, loop continues to try next model
    }
  }

  console.error("All Gemini API models failed:", lastError);
  return "The AI assistant is experiencing temporary high demand right now. Please try again in a few moments or email directly at david3005.scd@gmail.com!";
};
