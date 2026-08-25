import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  const apiKey = 
    process.env.API_KEY || 
    process.env.GEMINI_API_KEY || 
    (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as any).VITE_GEMINI_API_KEY : '') ||
    (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY ? (window as any).GEMINI_API_KEY : '');
    
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

const SYSTEM_INSTRUCTION = `You are "Livoq", the intelligent, friendly, and articulate AI assistant on David Varghese's portfolio website.

ABOUT DAVID VARGHESE:
- Identity: Computer Science and Engineering (CSE) student and aspiring software developer based in Kerala, India.
- Focus Areas: Software engineering, full-stack web development, cybersecurity threat modeling, machine learning, and modern interactive UI design.
- Email: david3005.scd@gmail.com
- GitHub: https://github.com/davidvarghese10
- LinkedIn: https://www.linkedin.com/in/david-varghese-solchadav-group/
- LeetCode: https://leetcode.com/u/david_1000/

FEATURED PROJECTS:
1. Intevra (2025): AI-powered interview fraud detection and integrity monitoring system. Analyzes multi-modal signals (audio, video, behavior) to detect cheating and unfair practices. Recognized as a National Level Hackathon Finalist.
2. Aether (2025): Immersive Regional Weather Experience Application built with React, TypeScript, and Framer Motion, providing fluid interactive meteorological visualization layers.
3. MediSense AI (2024): Healthcare disease prediction system using ML classification models to forecast potential illnesses from user-reported symptoms.
4. Equora (2024): High-performance Python-based mathematical and symbolic equation solver engineered for rapid numerical computation and algebraic analysis.

TECHNICAL TOOLKIT:
- Languages: Python, TypeScript, JavaScript, C/C++, SQL, HTML5/CSS3
- Frontend: React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- Backend & ML: Node.js, Express, REST APIs, Scikit-learn, ML pipelines
- CS & Security: Cybersecurity Fundamentals, Vulnerability Assessment, Network Defense, Cryptography, DSA (Data Structures & Algorithms), LeetCode problem solving, System Architecture

VERIFIED CERTIFICATIONS:
1. Full Stack Software Development (Coursera / Meta, 2025) — Credential ID: CERT-FS-2025-01
2. Cybersecurity Fundamentals & Threat Defense (Google / Cisco, 2024) — Credential ID: CERT-SEC-2024-88
3. Applied Machine Learning & Python (DeepLearning.AI / Stanford Online, 2024) — Credential ID: CERT-ML-2024-42
4. Data Structures & Algorithmic Analysis (University CS Academy, 2024) — Credential ID: CERT-DSA-2024-19

HONORS & ACHIEVEMENTS:
- National Level Hackathon Finalist with Intevra
- Active algorithmic problem solver on LeetCode (profile: david_1000)
- AI Research Showcase Selection for MediSense AI
- Open-Source Contributor on GitHub (davidvarghese10)

INSTRUCTIONS:
- Answer naturally, helpfully, and concisely (typically 2-4 sentences or clean bullet points).
- You can explain computer science concepts, discuss David's work in detail, answer general tech questions, or provide contact details.
- For hiring, collaboration, or general inquiries, invite the user to email david3005.scd@gmail.com.`;

const MODELS_TO_TRY = ['gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];

// Helper to evaluate basic math expressions safely
const tryEvaluateMath = (query: string): string | null => {
  const clean = query.replace(/what is|calculate|evaluate|equals|\?|\=/gi, '').trim();
  if (/^[\d\s\+\-\*\/\(\)\.\%\^]+$/.test(clean) && /\d/.test(clean)) {
    try {
      const sanitized = clean.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `The answer to ${clean} is **${result}**.`;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Comprehensive offline intelligence engine for instant, context-aware answers
const getOfflinePortfolioAnswer = (msg: string, history?: ChatMessage[]): string => {
  const query = msg.toLowerCase().trim();

  // Check if this is a simple math question
  const mathResult = tryEvaluateMath(query);
  if (mathResult) return mathResult;

  // Determine conversation context from recent messages if available
  const lastUserMsg = history && history.length > 1 ? history[history.length - 2]?.text?.toLowerCase() || '' : '';

  // 1. Greetings & Identity
  if (/^(hi|hello|hey|greetings|howdy|sup|yo|hiya|good morning|good afternoon|good evening|namaste)[\s!.,?]*$/i.test(query) ||
      /^(hi|hello|hey)\s+(there|livoq|bot|assistant)/i.test(query)) {
    return "Hello! I'm Livoq, David Varghese's AI assistant. I'm here to answer questions about David's projects, technical skills, cybersecurity background, certifications, hackathon achievements, or how to collaborate!";
  }

  if (/who are you|what are you|what is your name|who made you|introduce yourself|tell me about yourself/i.test(query)) {
    return "I am Livoq, an intelligent AI assistant created for David Varghese's portfolio. I can provide detailed insights into David's projects (like Intevra and Aether), technical toolkit, verified certifications, and contact information.";
  }

  // 2. Capabilities & Help
  if (/what can you do|how can you help|help me|commands|menu|what do you know/i.test(query)) {
    return "Here are a few things you can ask me about:\n• **Projects**: Intevra (AI fraud detection), Aether (weather app), MediSense AI (disease prediction), Equora (math solver)\n• **Skills**: Python, React, TypeScript, Cybersecurity, Machine Learning, DSA\n• **Certificates**: Meta Full-Stack, Cisco Cybersecurity, Stanford ML, Data Structures\n• **Achievements**: National Hackathon Finalist, LeetCode profile\n• **Contact & Hiring**: Email, LinkedIn, GitHub links";
  }

  // 3. Conversational / Pleasantries
  if (/how are you|how is it going|how r u|how do you do/i.test(query)) {
    return "I'm running smoothly and ready to assist! How can I help you explore David's portfolio or projects today?";
  }

  if (/thank you|thanks|thx|appreciate it|great job|good job|awesome|cool|nice/i.test(query)) {
    return "You're very welcome! If you have any more questions about David's work, code, or background, just let me know.";
  }

  if (/bye|goodbye|see you|cya|exit|close/i.test(query)) {
    return "Thanks for stopping by! Feel free to reach out to David at david3005.scd@gmail.com if you'd like to collaborate or connect.";
  }

  if (/tell me a joke|joke|make me laugh/i.test(query)) {
    return "Why do programmers prefer dark mode? Because light attracts bugs! 😄 Speaking of code, ask me about any of David's software projects!";
  }

  // 4. Specific Projects
  // Intevra
  if (query.includes('intevra') || (query.includes('fraud') && query.includes('interview')) || query.includes('interview integrity') || (lastUserMsg.includes('intevra') && (query.includes('stack') || query.includes('how') || query.includes('more') || query.includes('tell me')))) {
    return "**Intevra** is an AI-powered interview fraud detection and integrity monitoring system. It analyzes multi-modal data (video, audio, and browser signals) to detect cheating, multiple voices, and screen anomalies in real time. It was recognized as a **National Level Hackathon Finalist** in 2025.";
  }

  // Aether
  if (query.includes('aether') || (query.includes('weather') && !query.includes('whether')) || (lastUserMsg.includes('aether') && (query.includes('stack') || query.includes('how') || query.includes('more')))) {
    return "**Aether** is an immersive regional weather experience application. Built with **React, TypeScript, Tailwind CSS, and Framer Motion**, it delivers real-time meteorological conditions with smooth 60fps dynamic visual atmospheric layers.";
  }

  // MediSense AI
  if (query.includes('medisense') || (query.includes('disease') && query.includes('predict')) || (query.includes('symptom') && query.includes('health')) || query.includes('healthcare ai')) {
    return "**MediSense AI** is an intelligent healthcare disease prediction system. It leverages machine learning classification algorithms to evaluate user-submitted symptoms and forecast potential medical conditions with high accuracy and explainability.";
  }

  // Equora
  if (query.includes('equora') || query.includes('math solver') || query.includes('equation solver') || query.includes('symbolic math')) {
    return "**Equora** is a high-performance Python-based mathematical and symbolic equation solver. It is engineered for rapid algebraic evaluation, numerical computation, and step-by-step calculus simplifications.";
  }

  // All Projects / Portfolio Summary
  if (query.includes('project') || query.includes('portfolio') || query.includes('what did he build') || query.includes('what has he built') || query.includes('apps') || query.includes('creations') || query.includes('showcase')) {
    return "David has developed 4 standout projects:\n1. **Intevra**: AI interview fraud detection & integrity monitoring (National Hackathon Finalist)\n2. **Aether**: Immersive interactive weather experience platform\n3. **MediSense AI**: Machine learning symptom-based disease predictor\n4. **Equora**: Python mathematical and symbolic equation solver\n\nYou can view all of them in the **Projects** section!";
  }

  // 5. Technical Skills & Toolkit
  if (query.includes('python')) {
    return "Python is one of David's strongest languages, utilized for developing machine learning models (MediSense AI), symbolic computation engines (Equora), and algorithmic challenge solving.";
  }

  if (query.includes('react') || query.includes('typescript') || query.includes('frontend') || query.includes('javascript') || query.includes('tailwind') || query.includes('framer')) {
    return "David creates high-performance modern web frontends using **React, TypeScript, Tailwind CSS, and Framer Motion**, focusing on clean component architecture, responsive design, and fluid 60fps UI physics.";
  }

  if (query.includes('cyber') || query.includes('security') || query.includes('hack') || query.includes('pentest') || query.includes('vulnerability')) {
    return "David has a deep passion for **Cybersecurity & Threat Defense**, backed by Cisco & Google certifications covering network security protocols, vulnerability assessment, cryptographic mechanisms, and secure software development.";
  }

  if (query.includes('machine learning') || query.includes('ai') || query.includes('deep learning') || query.includes('data science') || query.includes('model')) {
    return "David applies machine learning across computer vision and predictive classification. His background includes Stanford/DeepLearning.AI training, disease prediction modeling in MediSense AI, and multi-modal fraud detection in Intevra.";
  }

  if (query.includes('leetcode') || query.includes('dsa') || query.includes('algorithm') || query.includes('data structure') || query.includes('competitive') || query.includes('problem solving')) {
    return "David is an active algorithmic problem solver on **LeetCode** (handle: **david_1000**), regularly practicing graph traversal, dynamic programming, tree algorithms, and computational complexity optimization.";
  }

  if (query.includes('c++') || query.includes('c lang') || query.includes('sql') || query.includes('database') || query.includes('backend') || query.includes('node') || query.includes('api') || query.includes('rest')) {
    return "David's backend and systems toolkit includes **C/C++** for core performance logic, **SQL** for relational data modeling, and **Node.js / Express** with RESTful API architectures.";
  }

  if (query.includes('skill') || query.includes('tech stack') || query.includes('technologies') || query.includes('stack') || query.includes('languages') || query.includes('frameworks')) {
    return "David's core technical toolkit includes:\n• **Languages**: Python, TypeScript, JavaScript, C/C++, SQL\n• **Frontend**: React, Tailwind CSS, Framer Motion, HTML5/CSS3\n• **Backend & AI**: Node.js, Express, REST APIs, Scikit-learn, ML Pipelines\n• **Domains**: Cybersecurity Threat Defense, DSA / LeetCode, UI/UX Motion Design";
  }

  // 6. Bio, Background, Education & Location
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('degree') || query.includes('student') || query.includes('study') || query.includes('studying') || query.includes('school')) {
    return "David Varghese is a **Computer Science and Engineering (CSE)** student with a focus on resilient software engineering, cybersecurity, and intelligent web systems.";
  }

  if (query.includes('where is he') || query.includes('location') || query.includes('where does he live') || query.includes('based') || query.includes('india') || query.includes('kerala') || query.includes('country')) {
    return "David Varghese is based in **Kerala, India**.";
  }

  if (query.includes('about david') || query.includes('who is david') || query.includes('tell me about david') || query.includes('bio') || query.includes('background') || query.includes('resume') || query.includes('profile')) {
    return "David Varghese is a Computer Science and Engineering student and software developer from Kerala, India. He builds practical, secure digital solutions combining full-stack development, applied machine learning, and cybersecurity.";
  }

  // 7. Certifications & Accreditations
  if (query.includes('certificate') || query.includes('certification') || query.includes('credential') || query.includes('coursera') || query.includes('cisco') || query.includes('stanford') || query.includes('meta')) {
    return "David holds 4 verified professional certifications:\n1. **Full Stack Software Development** (Meta / Coursera) — `CERT-FS-2025-01`\n2. **Cybersecurity Fundamentals & Threat Defense** (Google / Cisco) — `CERT-SEC-2024-88`\n3. **Applied Machine Learning & Python** (DeepLearning.AI / Stanford) — `CERT-ML-2024-42`\n4. **Data Structures & Algorithmic Analysis** (CS Academy) — `CERT-DSA-2024-19`";
  }

  // 8. Achievements & Milestones
  if (query.includes('achievement') || query.includes('award') || query.includes('hackathon') || query.includes('milestone') || query.includes('finalist') || query.includes('honors') || query.includes('won')) {
    return "David's notable achievements include:\n• **National Level Hackathon Finalist (2025)** with Intevra\n• **Active Algorithmic Problem Solver** on LeetCode (`david_1000`)\n• **AI Research Showcase Selection (2024)** for MediSense AI\n• **Open Source Development** on GitHub (`davidvarghese10`)";
  }

  // 9. Contact, Socials, Hiring & Collaboration
  if (query.includes('hire') || query.includes('job') || query.includes('internship') || query.includes('freelance') || query.includes('work with') || query.includes('opportunity') || query.includes('collaborat')) {
    return "David is actively open to software engineering internships, technical collaborations, and hackathon projects! You can reach him directly at **david3005.scd@gmail.com** or connect via LinkedIn.";
  }

  if (query.includes('contact') || query.includes('email') || query.includes('mail') || query.includes('message') || query.includes('reach') || query.includes('phone') || query.includes('talk')) {
    return "You can get in touch with David directly:\n• **Email**: david3005.scd@gmail.com\n• **LinkedIn**: https://www.linkedin.com/in/david-varghese-solchadav-group/\n• **GitHub**: https://github.com/davidvarghese10\n• **LeetCode**: https://leetcode.com/u/david_1000/";
  }

  if (query.includes('github') || query.includes('repo') || query.includes('git') || query.includes('code')) {
    return "You can explore David's source code and open-source repositories on GitHub at **https://github.com/davidvarghese10**.";
  }

  if (query.includes('linkedin')) {
    return "Connect with David on LinkedIn at **https://www.linkedin.com/in/david-varghese-solchadav-group/**.";
  }

  // 10. Portfolio Website Design & Stack
  if (query.includes('how was this website made') || query.includes('portfolio stack') || query.includes('theme') || query.includes('liquid glass') || query.includes('animation') || query.includes('built this')) {
    return "This portfolio was crafted with **React 19, TypeScript, Tailwind CSS, Framer Motion, and Recharts**. It features a 60fps liquid neon blue glassmorphism theme, GPU-accelerated canvas ambient lighting, and an Apple-inspired hello intro animation.";
  }

  // 11. General CS, Programming & Technical Inquiries
  if (query.includes('what is react') || query.includes('why react')) {
    return "React is a popular declarative JavaScript/TypeScript library for building component-based user interfaces. David uses React along with Tailwind CSS and Framer Motion to engineer fluid, reactive web applications.";
  }

  if (query.includes('what is cybersecurity') || query.includes('why cybersecurity')) {
    return "Cybersecurity is the discipline of protecting computer networks, systems, and data from digital attacks and unauthorized access. David focuses on threat defense modeling, network vulnerability assessments, and secure authentication.";
  }

  if (query.includes('what is machine learning') || query.includes('what is ai')) {
    return "Machine Learning involves training algorithms on historical data to identify patterns and make intelligent predictions without explicit hardcoded rules. David implemented ML classification models in MediSense AI and multi-modal fraud detection in Intevra.";
  }

  if (query.includes('what is an api') || query.includes('rest api')) {
    return "An API (Application Programming Interface) enables different software systems to communicate and exchange data. REST APIs use standard HTTP verbs (GET, POST, PUT, DELETE) to facilitate clean client-server communication.";
  }

  if (query.includes('what is dynamic programming') || query.includes('what is dsa')) {
    return "Data Structures & Algorithms (DSA) form the foundation of efficient computation. Dynamic programming optimizes recursive algorithms by breaking complex problems into overlapping subproblems and storing computed solutions.";
  }

  // 12. Smart Contextual Intelligent Response
  return `David Varghese is a Computer Science & Engineering student specializing in full-stack engineering, cybersecurity, and applied machine learning.

You can ask me specifically about:
• His projects (**Intevra**, **Aether**, **MediSense AI**, **Equora**)
• Technical toolkit (**Python, React, TypeScript, Cybersecurity, DSA**)
• Verified credentials or hackathon honors
• Or get in touch with David directly at **david3005.scd@gmail.com**!`;
};

export const sendChatMessage = async (message: string, history: ChatMessage[] = []): Promise<string> => {
  const trimmed = message.trim();
  if (!trimmed) return "Please enter a question or topic to explore!";

  const ai = getAIClient();
  
  // If API key is available, leverage Gemini model
  if (ai) {
    for (const model of MODELS_TO_TRY) {
      try {
        // Build conversation contents with history for multi-turn context
        const formattedContents = history
          .slice(-6) // Keep last 6 messages for context
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));

        formattedContents.push({
          role: 'user',
          parts: [{ text: trimmed }]
        });

        const response = await ai.models.generateContent({
          model: model,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.95,
          }
        });

        if (response && response.text && response.text.trim().length > 0) {
          return response.text.trim();
        }
      } catch (error: any) {
        console.warn(`Model ${model} attempt encountered issue:`, error?.message || error);
      }
    }
  }

  // Instant, robust offline engine if API key is not present or network call failed
  return getOfflinePortfolioAnswer(trimmed, history);
};
