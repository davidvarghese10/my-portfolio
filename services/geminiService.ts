import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  const apiKey = 
    process.env.API_KEY || 
    process.env.GEMINI_API_KEY || 
    (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as any).VITE_GEMINI_API_KEY : '');
    
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!aiInstance) {
    try {
      aiInstance = new GoogleGenAI({ apiKey: apiKey.trim() });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return aiInstance;
};

const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'];

// Intelligent knowledge base for instant answers on static deployments (e.g. GitHub Pages)
const getOfflinePortfolioAnswer = (msg: string): string => {
  const query = msg.toLowerCase();

  if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('who are you') || query.includes('introduce')) {
    return "Hi! I'm Livoq, David Varghese's AI assistant. David is a CSE student and aspiring software developer interested in cybersecurity and emerging technologies. Feel free to ask about his projects, achievements, certificates, or contact details!";
  }

  if (query.includes('intevra') || query.includes('fraud') || query.includes('interview')) {
    return "Intevra is an AI-integrated interview fraud detection and integrity monitoring system developed by David, selected as a National Level Hackathon finalist.";
  }

  if (query.includes('aether') || query.includes('weather')) {
    return "Aether is an immersive regional weather experience application featuring interactive environmental visualizations, fluid transitions, and responsive data layers.";
  }

  if (query.includes('medisense') || query.includes('disease') || query.includes('health') || query.includes('symptom')) {
    return "MediSense AI is a machine-learning powered healthcare prediction system that forecasts potential conditions based on patient-provided symptoms.";
  }

  if (query.includes('equora') || query.includes('math') || query.includes('equation')) {
    return "Equora is an algorithmic Python-based mathematical equation and symbolic solver designed for rapid calculation and algebraic resolution.";
  }

  if (query.includes('project') || query.includes('work') || query.includes('build')) {
    return "David's core projects include: 1. Intevra (AI interview fraud detection), 2. Aether (Immersive weather app), 3. MediSense AI (Disease prediction), and 4. Equora (Math solver). You can explore them in the Projects tab!";
  }

  if (query.includes('achievement') || query.includes('hackathon') || query.includes('award') || query.includes('milestone')) {
    return "David's key achievements include being a National Hackathon Finalist with Intevra, active algorithmic problem solving on LeetCode, and presenting emerging tech research prototypes. Check the Achievements tab!";
  }

  if (query.includes('certificate') || query.includes('certification') || query.includes('credential') || query.includes('course')) {
    return "David holds verified certificates across Full Stack Development, Cybersecurity Fundamentals, Machine Learning, and Data Structures & Algorithms. Check the Certificates tab for details!";
  }

  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('hire') || query.includes('linkedin') || query.includes('github')) {
    return "You can reach David directly via email at david3005.scd@gmail.com, or connect via GitHub, LinkedIn, and LeetCode in the Contact section!";
  }

  if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('python') || query.includes('react')) {
    return "David specializes in Python, React, TypeScript, Cybersecurity & threat detection, Algorithm design, and modern Applied AI.";
  }

  return "David Varghese is a CSE student focusing on software engineering, cybersecurity, and applied AI. You can reach him at david3005.scd@gmail.com for collaborations or project discussions!";
};

export const sendChatMessage = async (message: string): Promise<string> => {
  const ai = getAIClient();
  
  // If API key is not present in static client build, use the instant intelligent knowledge base
  if (!ai) {
    return getOfflinePortfolioAnswer(message);
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
      console.warn(`Model ${model} attempt info:`, error?.message || error);
      lastError = error;
    }
  }

  console.warn("Live API call encountered an issue, falling back to instant knowledge base:", lastError);
  // Seamless fallback so the user always gets a helpful, accurate answer rather than an error banner
  return getOfflinePortfolioAnswer(message);
};

