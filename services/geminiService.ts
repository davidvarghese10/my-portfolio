import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

let aiInstance: GoogleGenAI | null = null;
let currentKeyUsed: string = '';

export const getStoredApiKey = (): string => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('user_gemini_api_key');
      if (stored && stored.trim()) return stored.trim();
    }
  } catch {
    // Ignore storage exceptions
  }

  const envKey = 
    process.env.API_KEY || 
    process.env.GEMINI_API_KEY || 
    (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as any).VITE_GEMINI_API_KEY : '') ||
    (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY ? (window as any).GEMINI_API_KEY : '');

  return (envKey && typeof envKey === 'string') ? envKey.trim() : '';
};

export const setStoredApiKey = (key: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (key && key.trim()) {
        localStorage.setItem('user_gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('user_gemini_api_key');
      }
      aiInstance = null; // Reset cached client
    }
  } catch {
    // Ignore storage exceptions
  }
};

const getAIClient = (): GoogleGenAI | null => {
  const apiKey = getStoredApiKey();
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!aiInstance || currentKeyUsed !== apiKey) {
    try {
      aiInstance = new GoogleGenAI({ apiKey: apiKey.trim() });
      currentKeyUsed = apiKey;
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return aiInstance;
};

const SYSTEM_INSTRUCTION = `You are "Livoq", the intelligent, friendly, and articulate personal AI assistant on David Varghese's software engineering portfolio website.

ABOUT DAVID VARGHESE:
- Identity: Computer Science and Engineering (CSE) student at Rajagiri School of Engineering & Technology, Kakkanad (2025–2029) and aspiring software developer based in Kerala, India.
- Academic Excellence: Holds a perfect 10.00 / 10.00 SGPA across Semester 1 and Semester 2 in B.Tech CSE. Higher Secondary (XII) in Computer Science (with Maths) Stream from Devamatha CMI Public School (CBSE - 96.0%, 2023–2025). High School (X) from CMI Public School, Chalakudy (CBSE - 97.6%, 2022–2023).
- Focus Areas: Full-stack web development, software engineering, cybersecurity threat modeling, machine learning pipelines, and interactive UI design.
- Email: david3005.scd@gmail.com
- GitHub: https://github.com/davidvarghese10
- LinkedIn: https://www.linkedin.com/in/david-varghese-solchadav-group/
- LeetCode: https://leetcode.com/u/david_1000/

FEATURED PROJECTS:
1. Intevra (2026): AI-powered interview fraud detection and integrity monitoring system. Analyzes multi-modal data (video, audio, browser signals) to detect cheating, multiple voices, and screen anomalies in real time. Recognized as a National Level Hackathon Finalist.
2. Aether (2026): Immersive Regional Weather Experience Application built with React, TypeScript, and Framer Motion, delivering fluid 60fps meteorological visual simulation layers.
3. MediSense AI (2026): Healthcare disease prediction system using ML classification models to forecast potential illnesses from user-reported symptoms with high accuracy.
4. Equora (2023): High-performance Python-based mathematical and symbolic equation solver engineered for rapid numerical computation and algebraic analysis.

TECHNICAL TOOLKIT:
- Languages & Core: OOP in Java, C Programming, DSA, Python, TypeScript, JavaScript, C/C++, SQL, HTML5/CSS3
- Frontend: React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- Backend & ML: Node.js, Express, REST APIs, Scikit-learn, ML pipelines
- CS & Security: Cybersecurity Fundamentals, Vulnerability Assessment, Network Defense, Cryptography, DSA (Data Structures & Algorithms), LeetCode problem solving, System Architecture

VERIFIED CERTIFICATIONS (41 total accreditations, with 18 featured across IBM, Cisco, Microsoft, HP, Infosys, FutureSkills Prime, Google, IEEE, Deloitte):
- 2026: Vulnerability Management (IBM), Data Science & Analytics (HP), Programming Fundamentals using Python (Infosys), Artificial Intelligence (Infosys), Describe the Concepts of Cybersecurity (Microsoft), Digital 101 (30 Hours) (FutureSkills Prime)
- 2025: Cybersecurity Fundamentals (IBM), Cyber Threat Management (Cisco), Introduction to IoT & Digital Transformation (Cisco), Technology Job Simulation (Deloitte), English for Technical Professionals (IEEE), Quantum Machine Learning (IBM)
- 2024: AI Fundamentals (IBM), Developing Front-End Apps with React (IBM), Software Engineering Essentials (IBM), Introduction to Software Engineering with Honors (IBM), Introduction to Cybersecurity (Cisco)
- 2023: Fundamentals of Digital Marketing (Google)
- Full Registry: https://www.linkedin.com/in/david-varghese-solchadav-group/details/certifications/

HONORS & ACHIEVEMENTS:
- 5+ Hackathons Participated & National Level Hackathon Finalist with Intevra
- Active algorithmic problem solver on LeetCode (profile: david_1000)
- AI Research Showcase Selection for MediSense AI
- Open-Source Contributor on GitHub (davidvarghese10)

INSTRUCTIONS:
- Answer naturally, helpfully, and concisely (typically 2-4 sentences or clean bullet points).
- You can explain computer science concepts, discuss David's work in detail, answer general tech/coding questions, or provide contact details.
- For hiring, collaboration, or general inquiries, invite the user to email david3005.scd@gmail.com.`;

const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

// Safe math expression evaluator
const tryEvaluateMath = (query: string): string | null => {
  const clean = query.replace(/what is|calculate|evaluate|equals|solve|\?|\=/gi, '').trim();
  if (/^[\d\s\+\-\*\/\(\)\.\%\^]+$/.test(clean) && /\d/.test(clean)) {
    try {
      const sanitized = clean.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `The calculated result for \`${clean}\` is **${result}**.`;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Comprehensive offline intelligence engine with semantic pattern matching
export const getOfflinePortfolioAnswer = (msg: string, history: ChatMessage[] = []): string => {
  const query = msg.toLowerCase().trim();

  // 1. Math calculation
  const mathResult = tryEvaluateMath(query);
  if (mathResult) return mathResult;

  // 2. Greetings & Salutations
  if (/^(hi|hello|hey|greetings|howdy|sup|yo|hiya|good\s+(morning|afternoon|evening)|namaste)[\s!.,?]*$/i.test(query) ||
      /^(hi|hello|hey)\s+(there|livoq|bot|assistant|david)/i.test(query)) {
    return "Hello! I'm Livoq, David Varghese's AI assistant. Ask me anything about David's projects (like Intevra or Aether), technical skills, cybersecurity background, certifications, hackathon awards, or how to get in touch!";
  }

  // 3. Identity & Assistant Purpose
  if (query.includes('who are you') || query.includes('what is your name') || query.includes('what are you') || query.includes('introduce yourself') || query.includes('who made you') || query.includes('tell me about yourself')) {
    return "I am **Livoq**, the interactive AI assistant on David Varghese's portfolio. I can answer questions about David's software engineering background, full-stack & machine learning projects, cybersecurity training, certifications, and collaboration opportunities.";
  }

  // 4. Capabilities & Help
  if (query.includes('what can you do') || query.includes('how can you help') || query.includes('help me') || query === 'help' || query.includes('commands') || query.includes('menu')) {
    return "Here are key topics you can ask me about:\n• **Featured Projects**: Intevra (AI fraud detection), Aether (interactive weather), MediSense AI (disease predictor), Equora (equation solver)\n• **Technical Toolkit**: Python, React, TypeScript, Tailwind, Cybersecurity, Machine Learning, DSA\n• **Verified Credentials**: Meta Full-Stack, Cisco Cybersecurity, Stanford ML, Data Structures\n• **Achievements**: National Hackathon Finalist, LeetCode problem solving (`david_1000`)\n• **Contact & Hiring**: Email (`david3005.scd@gmail.com`), LinkedIn, GitHub";
  }

  // 5. Conversational & Pleasantries
  if (query.includes('how are you') || query.includes('how are u') || query.includes('how is it going') || query.includes('how do you do')) {
    return "I'm running at full speed and ready to help! What would you like to know about David's work or technical projects?";
  }

  if (query.includes('thank') || query.includes('thx') || query.includes('appreciate') || query.includes('good job') || query.includes('great job') || query.includes('awesome') || query.includes('cool')) {
    return "You're very welcome! If you have any more questions about David's code, projects, or background, feel free to ask anytime.";
  }

  if (query.includes('bye') || query.includes('goodbye') || query.includes('see you') || query.includes('cya')) {
    return "Have a great day! Don't hesitate to reach out to David directly at **david3005.scd@gmail.com** for collaborations or inquiries.";
  }

  if (query.includes('joke') || query.includes('funny') || query.includes('make me laugh')) {
    return "Why do programmers prefer dark mode? Because light attracts bugs! 😄 Speaking of code, feel free to ask about any of David's software projects!";
  }

  // 6. Deep Project Knowledge
  // Intevra
  if (query.includes('intevra') || (query.includes('fraud') && query.includes('interview')) || query.includes('interview integrity') || query.includes('cheating detection')) {
    return "**Intevra (2026)** is an AI-powered interview fraud detection and integrity monitoring platform. It uses multi-modal intelligence (facial posture analysis, voice verification, and browser signal tracking) to identify unfair practices and proxy candidates in real time. It was selected as a **National Level Hackathon Finalist**!";
  }

  // Aether
  if (query.includes('aether') || (query.includes('weather') && !query.includes('whether'))) {
    return "**Aether (2026)** is an immersive regional weather experience application engineered with **React, TypeScript, Tailwind CSS, and Framer Motion**. It presents meteorological data through dynamic 60fps atmospheric visualizations and responsive particle simulations.";
  }

  // MediSense AI
  if (query.includes('medisense') || query.includes('disease') || query.includes('symptom') || query.includes('health') || query.includes('medical')) {
    return "**MediSense AI (2026)** is an intelligent healthcare disease prediction system. Built with Python and Scikit-learn classification pipelines, it accurately evaluates user-reported symptoms to predict potential conditions with explainable diagnostic insights.";
  }

  // Equora
  if (query.includes('equora') || query.includes('equation') || query.includes('math solver') || query.includes('symbolic math') || query.includes('calculus')) {
    return "**Equora (2023)** is a high-performance mathematical and symbolic equation solver written in Python. It features custom algebraic simplification engines, numerical root finders, and step-by-step calculus solving.";
  }

  // All Projects
  if (query.includes('project') || query.includes('portfolio') || query.includes('built') || query.includes('work') || query.includes('app') || query.includes('showcase')) {
    return "David has developed 4 major projects:\n1. **Intevra (2026)**: AI interview fraud detection platform (National Hackathon Finalist)\n2. **Aether (2026)**: Immersive weather visualization experience (React & Framer Motion)\n3. **MediSense AI (2026)**: Machine learning symptom-based disease predictor\n4. **Equora (2023)**: Python mathematical and symbolic equation solver\n\nYou can explore interactive cards for each in the **Projects** section!";
  }

  // 7. Technical Skills & Languages
  if (query.includes('java') || query.includes('oop')) {
    return "David possesses strong proficiency in **Object-Oriented Programming (OOP) in Java**, utilizing principles like encapsulation, polymorphism, inheritance, and modular design patterns to build structured software systems.";
  }

  if (query.includes('dsa') || query.includes('c programming') || query.includes('c language') || query.includes('c code')) {
    return "David has comprehensive hands-on expertise in **C Programming & DSA (Data Structures and Algorithms)**, including manual memory management (pointers/malloc), linked lists, binary trees, heaps, graphs, sorting algorithms, and time/space complexity optimization.";
  }

  if (query.includes('python')) {
    return "Python is one of David's primary languages, used extensively for machine learning modeling (MediSense AI), symbolic computation engines (Equora), and data structure algorithms.";
  }

  if (query.includes('react') || query.includes('typescript') || query.includes('javascript') || query.includes('frontend') || query.includes('tailwind') || query.includes('css')) {
    return "David builds modern web applications using **React, TypeScript, Tailwind CSS, and Framer Motion**, specializing in fluid 60fps micro-interactions, responsive design, and modular state management.";
  }

  if (query.includes('cyber') || query.includes('security') || query.includes('hack') || query.includes('pentest') || query.includes('vulnerab') || query.includes('threat') || query.includes('defense')) {
    return "David has foundational expertise in **Cybersecurity & Threat Defense**, backed by Cisco & Google certifications covering network defense protocols, vulnerability assessment, cryptographic security, and secure software engineering.";
  }

  if (query.includes('machine learning') || query.includes('ai') || query.includes('deep learning') || query.includes('scikit') || query.includes('model') || query.includes('neural')) {
    return "David applies Machine Learning across predictive classification and computer vision, including training symptom classifiers in MediSense AI and multi-modal fraud detection in Intevra.";
  }

  if (query.includes('leetcode') || query.includes('dsa') || query.includes('algorithm') || query.includes('data structure') || query.includes('competitive') || query.includes('problem solving')) {
    return "David actively solves algorithmic problems on **LeetCode** under the profile **david_1000** and implements **DSA in C and Java**, with a focus on graph traversal, dynamic programming, tree algorithms, and asymptotic complexity optimization.";
  }

  if (query.includes('c++') || query.includes('c lang') || query.includes('sql') || query.includes('database') || query.includes('backend') || query.includes('node') || query.includes('express') || query.includes('api') || query.includes('rest')) {
    return "David's backend and systems toolkit includes **Node.js, Express, REST APIs, and SQL** for database architecture, along with **C/C++ & Java** for low-level systems programming and DSA.";
  }

  if (query.includes('skill') || query.includes('stack') || query.includes('tech') || query.includes('language') || query.includes('framework') || query.includes('tool')) {
    return "David's core technical toolkit comprises:\n• **Languages & Core**: OOP in Java, C Programming, DSA, Python, TypeScript, JavaScript, C/C++, SQL\n• **Frontend**: React, Tailwind CSS, Framer Motion, HTML5/CSS3\n• **Backend & ML**: Node.js, Express, REST APIs, Scikit-learn\n• **Core Disciplines**: Cybersecurity Threat Defense, DSA / LeetCode, UI/UX Motion Design";
  }

  // 8. Bio, Background, Education & Location
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('degree') || query.includes('student') || query.includes('study') || query.includes('studying') || query.includes('school') || query.includes('rajagiri') || query.includes('sgpa') || query.includes('marks') || query.includes('grade')) {
    return "David Varghese is pursuing a **B.Tech in Computer Science and Engineering (CSE)** at **Rajagiri School of Engineering & Technology, Kakkanad** (2025–2029), maintaining a perfect **10.00 / 10.00 SGPA** in S1 & S2. He completed Class XII in the **Computer Science (with Maths) Stream** at **Devamatha CMI Public School** (CBSE, 96.0%) and Class X at **CMI Public School, Chalakudy** (CBSE, 97.6%). You can explore his full academic record in the **Education** tab!";
  }

  if (query.includes('where') || query.includes('location') || query.includes('live') || query.includes('based') || query.includes('india') || query.includes('kerala') || query.includes('city') || query.includes('country')) {
    return "David Varghese is based in **Kerala, India**.";
  }

  if (query.includes('who is david') || query.includes('about david') || query.includes('tell me about david') || query.includes('bio') || query.includes('background') || query.includes('resume') || query.includes('profile')) {
    return "David Varghese is a Computer Science & Engineering student and software developer from Kerala, India. He builds robust, visually engaging applications combining full-stack web technologies, applied machine learning, and cybersecurity principles.";
  }

  // 9. Certifications & Accreditations
  if (query.includes('certificat') || query.includes('credential') || query.includes('coursera') || query.includes('cisco') || query.includes('stanford') || query.includes('meta') || query.includes('ibm') || query.includes('microsoft') || query.includes('hp') || query.includes('infosys') || query.includes('ieee') || query.includes('deloitte') || query.includes('futureskills')) {
    return "David holds 41 verified professional certifications (including 18 featured across IBM, Cisco, Microsoft, HP, Infosys Springboard, FutureSkills Prime, Google, IEEE, and Deloitte, spanning Vulnerability Management, Cyber Threat Management, AI Fundamentals, and React Application Development). You can view the highlight cards in the **Certificates** tab or browse his full 41-certificate registry on [LinkedIn](https://www.linkedin.com/in/david-varghese-solchadav-group/details/certifications/)!";
  }

  // 10. Achievements & Milestones
  if (query.includes('achievement') || query.includes('award') || query.includes('hackathon') || query.includes('finalist') || query.includes('milestone') || query.includes('honor') || query.includes('won')) {
    return "Key achievements for David include:\n• **National Level Hackathon Finalist (2025)** with Intevra\n• **Active Algorithmic Problem Solver** on LeetCode (`david_1000`)\n• **AI Research Showcase Selection (2024)** for MediSense AI\n• **Open-Source Software Development** on GitHub (`davidvarghese10`)";
  }

  // 11. Contact, Socials, Hiring & Collaboration
  if (query.includes('hire') || query.includes('job') || query.includes('intern') || query.includes('freelance') || query.includes('opportunity') || query.includes('collaborat') || query.includes('work with') || query.includes('why should i hire')) {
    return "David is actively seeking software engineering internships and technical collaborations! He brings strong problem-solving skills (LeetCode), modern full-stack capabilities, and cybersecurity awareness. Reach him directly at **david3005.scd@gmail.com**.";
  }

  if (query.includes('contact') || query.includes('email') || query.includes('mail') || query.includes('reach') || query.includes('message') || query.includes('phone') || query.includes('touch')) {
    return "You can get in touch with David directly:\n• **Email**: david3005.scd@gmail.com\n• **LinkedIn**: https://www.linkedin.com/in/david-varghese-solchadav-group/\n• **GitHub**: https://github.com/davidvarghese10\n• **LeetCode**: https://leetcode.com/u/david_1000/";
  }

  if (query.includes('github') || query.includes('repo') || query.includes('git') || query.includes('code')) {
    return "You can view David's public source code repositories on GitHub at **https://github.com/davidvarghese10**.";
  }

  if (query.includes('linkedin')) {
    return "Connect with David on LinkedIn at **https://www.linkedin.com/in/david-varghese-solchadav-group/**.";
  }

  // 12. Portfolio Design & Tech Stack
  if (query.includes('how was this website') || query.includes('how did you build this') || query.includes('liquid glass') || query.includes('portfolio design') || query.includes('theme') || query.includes('animation')) {
    return "This portfolio is built with **React 19, TypeScript, Tailwind CSS, and Framer Motion**. It features a 60fps liquid neon blue glassmorphism theme, GPU-accelerated canvas lighting, an Apple-inspired hello intro animation, and an interactive AI assistant!";
  }

  // 13. Computer Science & Software Concepts
  if (query.includes('what is react')) {
    return "React is a component-driven JavaScript/TypeScript UI library. David uses React with TypeScript and Framer Motion to build reactive, high-performance web applications.";
  }

  if (query.includes('what is cybersecurity') || query.includes('what is threat modeling')) {
    return "Cybersecurity protects computer systems, networks, and data against digital threats. Threat modeling identifies potential vulnerabilities and vectors so proactive defenses can be implemented.";
  }

  if (query.includes('what is machine learning') || query.includes('what is ai')) {
    return "Machine Learning involves algorithms that learn patterns from training data to make predictions or classifications without manual rule programming. David has implemented ML classification models in MediSense AI and Intevra.";
  }

  if (query.includes('what is dynamic programming')) {
    return "Dynamic Programming is an optimization technique that breaks complex problems into simpler subproblems, storing the results (memoization/tabulation) to avoid redundant computations. David practices DP problems frequently on LeetCode.";
  }

  if (query.includes('what is an api') || query.includes('rest api')) {
    return "An API (Application Programming Interface) allows different software applications to communicate. REST APIs use standard HTTP verbs (GET, POST, PUT, DELETE) to manage data exchange between client and server.";
  }

  // 14. Intelligent Semantic Keyword Synthesizer for Any Open Question
  return `David Varghese is a Computer Science & Engineering student specializing in full-stack web development, cybersecurity, and machine learning.

I can provide details about:
• **Projects**: Intevra (AI fraud detection), Aether (weather visualizer), MediSense AI, Equora
• **Technical Skills**: Python, React, TypeScript, C/C++, SQL, Cybersecurity, DSA
• **Credentials**: Meta Full-Stack, Cisco Cybersecurity, Stanford ML certifications
• **Collaboration**: Reach David at **david3005.scd@gmail.com**!

*(Tip: You can also tap the key icon at the top of this chat to connect your personal Gemini API Key for unlimited open-ended AI conversation!)*`;
};

export const sendChatMessage = async (message: string, history: ChatMessage[] = []): Promise<string> => {
  const trimmed = message.trim();
  if (!trimmed) return "Please enter a question or topic to explore!";

  const ai = getAIClient();
  
  // If API key is available (either environment or user-provided in settings), query Gemini
  if (ai) {
    for (const model of MODELS_TO_TRY) {
      try {
        const formattedContents = history
          .slice(-6)
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

  // Fallback to the intelligent portfolio engine
  return getOfflinePortfolioAnswer(trimmed, history);
};
