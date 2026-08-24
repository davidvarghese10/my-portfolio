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

// Intelligent conversational knowledge engine for instant, accurate answers across topics
const getOfflinePortfolioAnswer = (msg: string): string => {
  const query = msg.toLowerCase().trim();

  // 1. Greetings & Introductions (Match whole words to avoid false triggers like "this", "which", "shield")
  const isGreetingOnly = /^(hi|hello|hey|greetings|howdy|sup|yo|hiya)(\s+.*|\!|\?|\.)*$/i.test(query) ||
    /^(who are you|what is your name|introduce yourself|who are u)/i.test(query);

  if (isGreetingOnly) {
    return "Hello! I'm Livoq, David Varghese's AI assistant. Feel free to ask me anything about David's projects, technical skills, cybersecurity background, certificates, achievements, or how to get in touch!";
  }

  // 2. Specific Projects
  if (query.includes('intevra') || (query.includes('fraud') && query.includes('interview')) || query.includes('interview')) {
    return "Intevra is an AI-powered interview fraud detection and integrity monitoring system. It analyzes multi-modal signals to flag unfair practices and ensure genuine assessments, recognized as a National Level Hackathon finalist.";
  }

  if (query.includes('aether') || (query.includes('weather') && !query.includes('whether'))) {
    return "Aether is an immersive regional weather dashboard built with React, TypeScript, and modern fluid animations that delivers real-time meteorological data through interactive visual layers.";
  }

  if (query.includes('medisense') || query.includes('disease') || (query.includes('symptom') && query.includes('predict'))) {
    return "MediSense AI is an intelligent healthcare prediction platform that utilizes machine learning classification models to forecast potential illnesses based on reported symptoms.";
  }

  if (query.includes('equora') || query.includes('math solver') || query.includes('equation solver')) {
    return "Equora is a high-performance Python-based mathematical and symbolic equation solver engineered for rapid numerical computation and algebraic analysis.";
  }

  // All Projects
  if (query.includes('project') || query.includes('portfolio') || query.includes('work') || query.includes('what did he build') || query.includes('what has he made')) {
    return "David's highlighted projects are:\n1. Intevra — AI interview fraud detection (National Hackathon Finalist)\n2. Aether — Immersive weather experience app\n3. MediSense AI — Healthcare disease predictor\n4. Equora — Python symbolic math solver\n\nYou can explore interactive cards for all of them in the Projects tab!";
  }

  // 3. Education, Background, Bio
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('degree') || query.includes('student') || query.includes('school') || query.includes('study') || query.includes('studying')) {
    return "David Varghese is a Computer Science and Engineering (CSE) student with a strong passion for software architecture, cybersecurity, and intelligent systems engineering.";
  }

  if (query.includes('about david') || query.includes('who is david') || query.includes('tell me about david') || query.includes('bio') || query.includes('background') || query.includes('resume')) {
    return "David Varghese is a developer and CSE student focusing on full-stack web applications, cybersecurity threat modeling, and machine learning. He builds high-performance, aesthetically refined digital products.";
  }

  // 4. Skills & Tech Stack
  if (query.includes('skill') || query.includes('tech stack') || query.includes('language') || query.includes('technology') || query.includes('technologies') || query.includes('framework') || query.includes('stack')) {
    return "David's core technical toolkit includes:\n• Languages: Python, TypeScript, JavaScript, C/C++, SQL\n• Frontend: React, Tailwind CSS, Framer Motion, HTML5/CSS3\n• Backend & AI: Node.js, Express, REST APIs, Scikit-learn, PyTorch/ML\n• Domains: Cybersecurity fundamentals, Algorithmic optimization, System design";
  }

  if (query.includes('python')) {
    return "Python is one of David's primary languages, used extensively for machine learning models (MediSense AI), algorithmic problem solving, and symbolic math engines (Equora).";
  }

  if (query.includes('react') || query.includes('typescript') || query.includes('frontend') || query.includes('javascript')) {
    return "David develops modern frontend architectures using React, TypeScript, Tailwind CSS, and Framer Motion, focusing on 60fps fluid UI physics and clean component hierarchy.";
  }

  if (query.includes('cyber') || query.includes('security') || query.includes('hack')) {
    return "David is deeply interested in Cybersecurity, with coursework and certifications covering network defense, vulnerability assessment, cryptography fundamentals, and secure coding practices.";
  }

  if (query.includes('leetcode') || query.includes('dsa') || query.includes('algorithm') || query.includes('data structure') || query.includes('competitive')) {
    return "David actively solves algorithmic problems on LeetCode and competitive programming platforms, covering graph traversal, dynamic programming, trees, and computational complexity.";
  }

  // 5. Achievements & Milestones
  if (query.includes('achievement') || query.includes('award') || query.includes('hackathon') || query.includes('milestone') || query.includes('honors') || query.includes('won') || query.includes('finalist')) {
    return "Key Achievements:\n• National Level Hackathon Finalist with Intevra\n• Active algorithmic contributor on LeetCode\n• AI Research Showcase selection for MediSense AI\n• Open Source contributor on GitHub\n\nVisit the Achievements tab to learn more!";
  }

  // 6. Certificates & Accreditations
  if (query.includes('certificate') || query.includes('certification') || query.includes('credential') || query.includes('course') || query.includes('certified') || query.includes('accreditation')) {
    return "Verified Certifications:\n1. Full Stack Software Development (Meta / Coursera)\n2. Cybersecurity Fundamentals & Threat Defense (Google / Cisco)\n3. Applied Machine Learning & Python (DeepLearning.AI / Stanford)\n4. Data Structures & Algorithmic Analysis\n\nCheck out the Certificates tab for credential IDs!";
  }

  // 7. Contact, Hiring, Socials
  if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('reach') || query.includes('message') || query.includes('collaborate') || query.includes('job') || query.includes('opportunity') || query.includes('talk')) {
    return "You can reach David directly via email at david3005.scd@gmail.com. You can also connect via LinkedIn, GitHub, and Instagram using the links in the Contact section!";
  }

  if (query.includes('github') || query.includes('repo') || query.includes('git')) {
    return "David's open-source repositories and codebases are hosted on GitHub at https://github.com/david3005-scd.";
  }

  if (query.includes('linkedin')) {
    return "You can connect with David on LinkedIn at https://www.linkedin.com/in/david-varghese-26173031b.";
  }

  // 8. General & How-are-you queries
  if (query.includes('how are you') || query.includes('how r u') || query.includes('whats up') || query.includes("what's up")) {
    return "I'm doing great, thank you! Ready to help you learn more about David's projects, skills, or achievements. What would you like to explore?";
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('thx')) {
    return "You're very welcome! Feel free to ask if you have any more questions about David's work or want to get in touch with him.";
  }

  if (query.includes('help') || query.includes('what can you do') || query.includes('commands')) {
    return "I can answer questions regarding David Varghese's:\n• Projects (Intevra, Aether, MediSense AI, Equora)\n• Education & Technical Skills (Python, React, Cybersecurity, ML)\n• Verified Certificates & Credentials\n• Hackathon Achievements\n• Contact details & Social profiles\n\nWhat would you like to know?";
  }

  // 9. Fallback tailored answer
  return `Regarding "${msg}": David Varghese is a CSE student specializing in software engineering, cybersecurity, and AI. For specific discussions or collaboration, you can reach him directly at david3005.scd@gmail.com!`;
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

