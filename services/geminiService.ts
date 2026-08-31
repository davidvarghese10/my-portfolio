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
- Identity: Computer Science and Engineering (CSE) student at Rajagiri School of Engineering & Technology (RSET), Kakkanad, Kochi, Kerala, India (2025–2029) and an aspiring software developer.
- Academic Excellence: Perfect 10.00 / 10.00 SGPA in Semester 1 (S1) and Semester 2 (S2) in B.Tech CSE.
- Schooling:
  • Higher Secondary (Class XII): Devamatha CMI Public School, Thrissur (CBSE - 96.0%, 2023–2025) in Computer Science with Mathematics stream.
  • Secondary School (Class X): CMI Public School, Chalakudy (CBSE - 97.6%, 2022–2023).
- Focus Disciplines: Full-stack web development, cybersecurity & vulnerability management, applied machine learning pipelines, algorithmic problem solving (DSA), and interactive motion design.
- Contact & Profiles:
  • Email: david3005.scd@gmail.com
  • GitHub: https://github.com/davidvarghese10
  • LinkedIn: https://www.linkedin.com/in/david-varghese-solchadav-group/
  • LeetCode: https://leetcode.com/u/david_1000/

FEATURED PROJECTS:
1. Intevra (2026) — Category: AI & Security
   • Overview: AI-integrated interview fraud detection and integrity monitoring platform.
   • Features: Multi-modal anomaly detection analyzing facial posture, eye gaze, multiple voices, background acoustic discrepancies, and browser focus/window switching.
   • Recognition: National Level Hackathon Finalist at Hacksus (Rajagiri School of Engineering & Technology).
2. Aether (2026) — Category: Interactive Web & UI Engineering
   • Overview: Immersive Regional Weather Experience Application.
   • Tech Stack: React, TypeScript, Tailwind CSS, Framer Motion, Recharts.
   • Features: 60fps GPU-accelerated atmospheric visual layers, particle rain/cloud simulations, real-time regional meteorological metrics, and responsive interactive telemetry.
3. MediSense AI (2026) — Category: Healthcare AI
   • Overview: Machine learning disease prediction system evaluating patient-reported symptoms.
   • Tech Stack: Python, Scikit-learn, statistical data preprocessing pipelines.
   • Features: Multi-symptom probability scoring, predictive diagnostic insights, and transparent risk factor breakdown.
4. Equora (2023) — Category: Python & Algorithms
   • Overview: High-performance mathematical and symbolic equation solver in Python.
   • Features: Custom algebraic parser, polynomial root-finder, calculus differentiation & integration engines, and step-by-step mathematical reasoning.

WORK EXPERIENCE & INTERNSHIPS:
- Technical Intern at Edunet Foundation in collaboration with IBM SkillsBuild (4-Week Intensive Program):
  • Focused on cloud computing architectures, AI foundations, software engineering paradigms, and practical problem solving.
  • Completed technical evaluations and practical project implementations in the IBM SkillsBuild ecosystem.

VERIFIED CERTIFICATIONS (41 Total Accreditations; 18 Key Featured across 9 Prestigious Organizations):
- IBM:
  • Vulnerability Management (2026)
  • Cybersecurity Fundamentals (2025)
  • Quantum Machine Learning (2025)
  • AI Fundamentals (2024)
  • Developing Front-End Apps with React (2024)
  • Software Engineering Essentials (2024)
  • Introduction to Software Engineering with Honors (2024)
- Cisco:
  • Cyber Threat Management (2025)
  • Introduction to IoT and Digital Transformation (2025)
  • Introduction to Cybersecurity (2024)
- Microsoft: Describe the Concepts of Cybersecurity (2026)
- HP: Data Science & Analytics (2026)
- Infosys Springboard:
  • Programming Fundamentals Using Python (2026)
  • Artificial Intelligence (2026)
- FutureSkills Prime: Digital 101 (30 Hours) (2026)
- Deloitte: Technology Job Simulation (2025)
- IEEE: English for Technical Professionals (2025)
- Google: Fundamentals of Digital Marketing (2023)
- Full 41-certificate registry: https://www.linkedin.com/in/david-varghese-solchadav-group/details/certifications/

KEY ACHIEVEMENTS & MILESTONES:
- 3rd Prize at Vibe Night Hackathon (Abhiyanthriki Tech Fest, Rajagiri School of Engineering & Technology)
- National Level Hackathon Finalist at Hacksus (Rajagiri School of Engineering & Technology) with Intevra
- Smart India Hackathon (SIH) Participant (Ministry of Education & AICTE)
- Active LeetCode problem solver (Profile: david_1000) focusing on Graphs, Trees, Dynamic Programming, and Greedy algorithms.

TECHNICAL TOOLKIT:
- Languages & Core: OOP in Java, C Programming, DSA, Python, TypeScript, JavaScript, C/C++, SQL, HTML5/CSS3
- Frontend: React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Vite
- Backend & Systems: Node.js, Express, REST APIs, Git, GitHub
- Security: Vulnerability Assessment, Network Defense, Cryptography, Threat Modeling, Security Auditing
- Data & AI: Machine Learning, Scikit-learn, Data Analysis, Statistical Modeling

INSTRUCTIONS FOR RESPONSES:
- Provide friendly, intelligent, crisp, and helpful answers.
- Highlight David's strengths in academic rigor, problem-solving, cybersecurity, and modern UI engineering.
- For hiring, collaboration, or general inquiries, invite users to contact david3005.scd@gmail.com.`;

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

// Comprehensive offline intelligence engine with multi-layered semantic matching
export const getOfflinePortfolioAnswer = (msg: string, history: ChatMessage[] = []): string => {
  const query = msg.toLowerCase().trim();

  // 1. Math calculation
  const mathResult = tryEvaluateMath(query);
  if (mathResult) return mathResult;

  // 2. Greetings & Salutations
  if (/^(hi|hello|hey|greetings|howdy|sup|yo|hiya|good\s+(morning|afternoon|evening)|namaste|vanakkam)[\s!.,?]*$/i.test(query) ||
      /^(hi|hello|hey)\s+(there|livoq|bot|assistant|david)/i.test(query)) {
    return "Hello! I'm **Livoq**, David Varghese's personal AI assistant. I'm ready to answer anything about David's projects (like Intevra or Aether), technical skills, academic record at Rajagiri, 41+ certifications, hackathon awards, or how to get in touch!";
  }

  // 3. Identity & Assistant Purpose
  if (query.includes('who are you') || query.includes('what is your name') || query.includes('what are you') || query.includes('introduce yourself') || query.includes('who made you') || query.includes('tell me about yourself') || query.includes('what is livoq') || query.includes('who is livoq')) {
    return "I am **Livoq**, the interactive AI assistant on David Varghese's software engineering portfolio. I have deep knowledge of David's academic journey at Rajagiri (10.00 SGPA), his 4 major software projects, his 41+ professional accreditations (IBM, Cisco, Microsoft, HP, etc.), his internship with Edunet/IBM SkillsBuild, and his hackathon achievements.";
  }

  // 4. Capabilities & Help / Menu
  if (query.includes('what can you do') || query.includes('how can you help') || query.includes('help me') || query === 'help' || query.includes('commands') || query.includes('menu') || query.includes('topics')) {
    return "Here are the key areas you can ask me about:\n\n• **Featured Projects**: Intevra (AI fraud detection), Aether (interactive weather platform), MediSense AI (disease predictor), Equora (equation solver)\n• **Academic Background**: B.Tech CSE at Rajagiri School of Engineering & Technology (10.00 / 10.00 SGPA), Devamatha CMI (96%), CMI Chalakudy (97.6%)\n• **Technical Toolkit**: Python, Java (OOP), C Programming, DSA, React, TypeScript, Tailwind CSS, Cybersecurity, Machine Learning\n• **Industry Experience**: 4-Week Technical Internship at Edunet Foundation & IBM SkillsBuild\n• **Verified Certifications**: 41 total accreditations spanning IBM, Cisco, Microsoft, HP, Infosys, Deloitte, IEEE, Google\n• **Hackathons & Honors**: Vibe Night 3rd Prize, National Finalist at Hacksus, SIH participant, LeetCode (`david_1000`)\n• **Contact & Socials**: Email (`david3005.scd@gmail.com`), LinkedIn, GitHub, LeetCode";
  }

  // 5. Conversational & Pleasantries
  if (query.includes('how are you') || query.includes('how are u') || query.includes('how is it going') || query.includes('how do you do') || query.includes('whats up') || query.includes("what's up")) {
    return "I'm running smoothly at 60fps and ready to help! Feel free to ask about David's projects, academic track record, technical toolkit, or upcoming collaboration opportunities.";
  }

  if (query.includes('thank') || query.includes('thx') || query.includes('appreciate') || query.includes('good job') || query.includes('great job') || query.includes('awesome') || query.includes('cool') || query.includes('nice') || query.includes('well done')) {
    return "You're very welcome! If you have any more questions about David's code, engineering projects, or background, feel free to ask anytime.";
  }

  if (query.includes('bye') || query.includes('goodbye') || query.includes('see you') || query.includes('cya') || query.includes('good night') || query.includes('take care')) {
    return "Have a wonderful day! Don't hesitate to reach out to David directly at **david3005.scd@gmail.com** for collaborations, hiring inquiries, or discussions.";
  }

  if (query.includes('joke') || query.includes('funny') || query.includes('make me laugh')) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
      "There are 10 types of people in the world: those who understand binary, and those who don't!",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
      "Why do Java programmers wear glasses? Because they don't C#! ☕"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)] + " Speaking of programming, ask me anything about David's software work!";
  }

  // 6. Deep Project Knowledge
  // Intevra
  if (query.includes('intevra') || (query.includes('fraud') && query.includes('interview')) || query.includes('interview integrity') || query.includes('cheating detection') || query.includes('hacksus')) {
    return "**Intevra (2026)** is an AI-powered interview fraud detection and integrity monitoring system.\n\n• **Core Purpose**: Prevents unfair practices and proxy test-taking in remote technical interviews.\n• **Technology & Intelligence**: Utilizes multi-modal machine learning signals to monitor facial posture, eye gaze tracking, background voices/speech anomalies, and real-time browser focus/window switching.\n• **Achievement**: Selected as a **National Level Hackathon Finalist** at Hacksus (Rajagiri School of Engineering & Technology).";
  }

  // Aether
  if (query.includes('aether') || (query.includes('weather') && !query.includes('whether')) || query.includes('meteorolog') || query.includes('atmosphere')) {
    return "**Aether (2026)** is an immersive regional weather experience application.\n\n• **Tech Stack**: Built with **React, TypeScript, Tailwind CSS, and Framer Motion** with Recharts.\n• **Key Features**: Delivers fluid 60fps atmospheric visualizations, GPU-accelerated particle rain/cloud simulation layers, and comprehensive regional telemetry (humidity, wind speed, precipitation curves, and UV indices).\n• **UI/UX Craft**: Focuses on micro-animations, glassmorphism aesthetics, and clean data visualizations.";
  }

  // MediSense AI
  if (query.includes('medisense') || query.includes('disease') || query.includes('symptom') || query.includes('health') || query.includes('medical') || query.includes('diagnosis')) {
    return "**MediSense AI (2026)** is an intelligent healthcare disease prediction system.\n\n• **Core Purpose**: Predicts potential illnesses from user-reported symptom combinations with high statistical confidence.\n• **Tech Stack**: Engineered in **Python** using **Scikit-learn classification pipelines** and structured health datasets.\n• **Capabilities**: Provides probabilistic illness likelihoods, diagnostic explanations, and risk-factor breakdowns to assist users in understanding their symptoms.";
  }

  // Equora
  if (query.includes('equora') || query.includes('equation') || query.includes('math solver') || query.includes('symbolic math') || query.includes('calculus') || query.includes('algebra')) {
    return "**Equora (2023)** is a high-performance Python-based mathematical and symbolic equation solver.\n\n• **Capabilities**: Parses and evaluates complex algebraic expressions, computes polynomial roots, and performs step-by-step calculus (differentiation and integration).\n• **Architecture**: Features a custom symbolic parsing engine designed for rapid numerical evaluation and clean step-by-step mathematical reasoning.";
  }

  // General Projects Overview
  if (query.includes('project') || query.includes('portfolio') || query.includes('built') || query.includes('work') || query.includes('apps') || query.includes('showcase')) {
    return "David has developed 4 major projects featured in his portfolio:\n\n1. **Intevra (2026)** — AI Interview Fraud Detection System (National Hackathon Finalist)\n2. **Aether (2026)** — Immersive Regional Weather Experience Application (React + Framer Motion)\n3. **MediSense AI (2026)** — Machine Learning Disease Prediction System (Python + Scikit-learn)\n4. **Equora (2023)** — High-Performance Python Mathematical & Symbolic Equation Solver\n\nYou can explore each project interactively in the **Projects** section!";
  }

  // 7. Academic Record & Education
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('degree') || query.includes('student') || query.includes('study') || query.includes('studying') || query.includes('school') || query.includes('rajagiri') || query.includes('rset') || query.includes('sgpa') || query.includes('marks') || query.includes('grade') || query.includes('academic') || query.includes('cgpa') || query.includes('gpa') || query.includes('tenth') || query.includes('twelfth') || query.includes('cbse') || query.includes('devamatha')) {
    return "**David Varghese's Academic Credentials**:\n\n• **B.Tech in Computer Science & Engineering (2025–2029)**:\n  Rajagiri School of Engineering & Technology (RSET), Kakkanad, Kochi, Kerala.\n  *Academic Distinction*: Perfect **10.00 / 10.00 SGPA** in Semester 1 (S1) and Semester 2 (S2).\n\n• **Higher Secondary (Class XII, 2023–2025)**:\n  Devamatha CMI Public School, Thrissur (CBSE) — **96.0%** in Computer Science with Mathematics stream.\n\n• **High School (Class X, 2022–2023)**:\n  CMI Public School, Chalakudy (CBSE) — **97.6%** with top academic honors.\n\nExplore full details in the **Education** section!";
  }

  // 8. Work Experience & Internship
  if (query.includes('experience') || query.includes('internship') || query.includes('intern') || query.includes('edunet') || query.includes('ibm skillsbuild') || query.includes('skillsbuild') || query.includes('job') || query.includes('work experience')) {
    return "**Technical Internship — Edunet Foundation in collaboration with IBM SkillsBuild**:\n\n• **Format & Duration**: Intensive 4-Week Technical Internship Program.\n• **Curriculum & Focus**: Covered cloud computing foundations, artificial intelligence paradigms, enterprise software engineering workflows, and hands-on collaborative problem solving.\n• **Outcome**: Successfully completed practical project modules and technical evaluations within the IBM SkillsBuild learning ecosystem.\n\nSee the **Experience** section for more!";
  }

  // 9. Detailed Certifications & Accreditations (41 Total, 18 Featured)
  if (query.includes('certificat') || query.includes('credential') || query.includes('accreditation') || query.includes('ibm') || query.includes('cisco') || query.includes('microsoft') || query.includes('hp') || query.includes('infosys') || query.includes('deloitte') || query.includes('ieee') || query.includes('futureskills') || query.includes('google')) {
    if (query.includes('ibm')) {
      return "**David's IBM Certifications** include:\n• Vulnerability Management (2026)\n• Cybersecurity Fundamentals (2025)\n• Quantum Machine Learning (2025)\n• AI Fundamentals (2024)\n• Developing Front-End Apps with React (2024)\n• Software Engineering Essentials (2024)\n• Introduction to Software Engineering with Honors (2024)";
    }
    if (query.includes('cisco')) {
      return "**David's Cisco Certifications** include:\n• Cyber Threat Management (2025) — Threat hunting, SOC analysis, incident response\n• Introduction to IoT and Digital Transformation (2025)\n• Introduction to Cybersecurity (2024) — Network defense protocols";
    }
    if (query.includes('microsoft')) {
      return "**David's Microsoft Certification**: *Describe the Concepts of Cybersecurity* (2026), focusing on Zero Trust architecture, threat protection, and cloud security.";
    }
    if (query.includes('hp')) {
      return "**David's HP Certification**: *Data Science & Analytics* (2026), covering exploratory data analysis, predictive modeling, and statistical workflows.";
    }
    if (query.includes('infosys')) {
      return "**David's Infosys Springboard Certifications**:\n• Programming Fundamentals Using Python (2026)\n• Artificial Intelligence (2026)";
    }
    return "David holds **41 verified professional accreditations**, with 18 prominently featured:\n\n• **IBM (7 Credentials)**: Vulnerability Management, Cybersecurity Fundamentals, Quantum ML, React Apps, AI Fundamentals, Software Engineering with Honors\n• **Cisco (3 Credentials)**: Cyber Threat Management, IoT & Digital Transformation, Cybersecurity\n• **Microsoft**: Describe the Concepts of Cybersecurity (2026)\n• **HP**: Data Science & Analytics (2026)\n• **Infosys Springboard**: Python Fundamentals & AI (2026)\n• **FutureSkills Prime**: Digital 101 (30 Hours) (2026)\n• **Deloitte**: Technology Job Simulation (2025)\n• **IEEE**: English for Technical Professionals (2025)\n• **Google**: Fundamentals of Digital Marketing (2023)\n\nBrowse all cards in the **Certificates** section or view the complete 41-credential registry on [LinkedIn](https://www.linkedin.com/in/david-varghese-solchadav-group/details/certifications/)!";
  }

  // 10. Achievements & Hackathons
  if (query.includes('achievement') || query.includes('award') || query.includes('hackathon') || query.includes('finalist') || query.includes('milestone') || query.includes('honor') || query.includes('won') || query.includes('vibe night') || query.includes('smart india') || query.includes('sih') || query.includes('prize')) {
    return "**Key Honors & Hackathon Achievements**:\n\n1. **3rd Prize — Vibe Night Hackathon (2025)**:\n   Conducted as part of the Abhiyanthriki Tech Fest at Rajagiri School of Engineering & Technology.\n2. **National Level Hackathon Finalist — Hacksus (2025)**:\n   Selected among top teams nationwide with **Intevra**, an AI interview integrity and fraud detection system.\n3. **Smart India Hackathon (SIH, 2024–2025)**:\n   Participant in India's flagship national hackathon organized by the Ministry of Education & AICTE.\n4. **Competitive Coding on LeetCode**:\n   Active problem solver under handle **david_1000** practicing graph theory, dynamic programming, and data structures.";
  }

  // 11. Technical Skills, Languages & Tools
  // Java & OOP
  if (query.includes('java') || query.includes('oop') || query.includes('object oriented')) {
    return "David has extensive proficiency in **Object-Oriented Programming (OOP) in Java**, utilizing principles like encapsulation, polymorphism, inheritance, and modular design patterns to build structured, maintainable software systems.";
  }

  // C Programming & Low-level
  if (query.includes('c programming') || query.includes('c language') || query.includes('c code') || query.includes('pointers') || query.includes('memory management')) {
    return "David has comprehensive hands-on expertise in **C Programming & low-level memory management**, including pointer arithmetic, manual heap allocations (`malloc`/`free`), system calls, and core data structure implementations from scratch.";
  }

  // DSA & LeetCode
  if (query.includes('dsa') || query.includes('data structure') || query.includes('algorithm') || query.includes('leetcode') || query.includes('competitive') || query.includes('problem solving') || query.includes('binary tree') || query.includes('graph') || query.includes('dynamic programming')) {
    return "David actively practices Data Structures & Algorithms on **LeetCode** (profile: **david_1000**) and implements core DSA in C and Java. His toolkit covers:\n• **Data Structures**: Arrays, Linked Lists, Stacks, Queues, Binary Trees, BSTs, Heaps, Hash Maps, Graphs\n• **Algorithms**: Graph Traversals (BFS/DFS, Dijkstra), Dynamic Programming, Divide & Conquer, Two Pointers, Sliding Window, Asymptotic Complexity (Big-O) optimization.";
  }

  // Python
  if (query.includes('python')) {
    return "Python is one of David's core languages, used for machine learning pipelines (MediSense AI), symbolic algebra and numerical computation engines (Equora), and automation scripts. He holds verified Python certifications from Infosys Springboard.";
  }

  // React & Web Development
  if (query.includes('react') || query.includes('typescript') || query.includes('javascript') || query.includes('frontend') || query.includes('tailwind') || query.includes('css') || query.includes('framer') || query.includes('html')) {
    return "David develops modern, responsive web applications using **React, TypeScript, Tailwind CSS, and Framer Motion**. He focuses on 60fps micro-interactions, clean glassmorphism UI/UX, robust component architectures, and certified IBM Front-End React practices.";
  }

  // Cybersecurity
  if (query.includes('cyber') || query.includes('security') || query.includes('hack') || query.includes('vulnerab') || query.includes('threat') || query.includes('defense') || query.includes('zero trust') || query.includes('soc') || query.includes('cryptography')) {
    return "David has robust foundational expertise in **Cybersecurity & Threat Defense**, backed by verified certifications from **IBM, Cisco, and Microsoft**. His knowledge covers Vulnerability Management, Cyber Threat Intelligence, Network Defense Protocols, Incident Response, Cryptography, and Zero Trust security models.";
  }

  // Machine Learning & AI
  if (query.includes('machine learning') || query.includes('ai') || query.includes('deep learning') || query.includes('scikit') || query.includes('model') || query.includes('neural') || query.includes('predict')) {
    return "David applies Machine Learning across predictive classification and computer vision, such as symptom classification in **MediSense AI**, multi-modal fraud detection in **Intevra**, and quantum algorithms through IBM's **Quantum Machine Learning** certification.";
  }

  // Backend & Databases
  if (query.includes('backend') || query.includes('node') || query.includes('express') || query.includes('sql') || query.includes('database') || query.includes('api') || query.includes('rest') || query.includes('c++')) {
    return "David's backend and systems toolkit includes **Node.js, Express, RESTful APIs, and SQL** for database design, complemented by **C/C++ and Java** for systems-level programming and algorithmic implementations.";
  }

  // General Skills Overview
  if (query.includes('skill') || query.includes('stack') || query.includes('tech') || query.includes('tool') || query.includes('toolkit')) {
    return "David's technical toolkit includes:\n\n• **Languages**: Python, Java (OOP), C, C++, TypeScript, JavaScript, SQL\n• **Frontend**: React, Tailwind CSS, Framer Motion, Recharts, HTML5/CSS3\n• **Backend & Systems**: Node.js, Express, REST APIs, Git, GitHub\n• **Cybersecurity**: Vulnerability Assessment, Threat Defense, Network Security, Cryptography\n• **Data & AI**: Machine Learning, Scikit-learn, Data Analytics (HP certified)\n• **Core CS**: Data Structures & Algorithms (DSA), LeetCode (`david_1000`), System Design Principles";
  }

  // 12. Location, Bio & Background
  if (query.includes('where') || query.includes('location') || query.includes('live') || query.includes('based') || query.includes('india') || query.includes('kerala') || query.includes('city') || query.includes('kochi') || query.includes('kakkanad') || query.includes('chalakudy') || query.includes('thrissur')) {
    return "David Varghese is based in **Kerala, India** and currently studies in **Kakkanad, Kochi** at Rajagiri School of Engineering & Technology.";
  }

  if (query.includes('who is david') || query.includes('about david') || query.includes('tell me about david') || query.includes('bio') || query.includes('background') || query.includes('summary') || query.includes('profile')) {
    return "**David Varghese** is a Computer Science and Engineering student at Rajagiri School of Engineering & Technology, Kerala (10.00 SGPA) and an aspiring software developer. He combines full-stack web engineering, applied machine learning, and cybersecurity to build resilient, real-world solutions.";
  }

  // 13. Hiring, Collaboration & Contact
  if (query.includes('hire') || query.includes('job') || query.includes('intern') || query.includes('freelance') || query.includes('opportunity') || query.includes('collaborat') || query.includes('work with') || query.includes('why should i hire') || query.includes('strengths') || query.includes('resume') || query.includes('cv')) {
    return "**Why Work with David Varghese?**\n\n• **Academic Distinction**: Flawless 10.00 / 10.00 SGPA in B.Tech CSE at Rajagiri.\n• **Proven Hackathon Execution**: National Level Finalist at Hacksus with Intevra; 3rd Prize winner at Vibe Night.\n• **Strong Algorithmic Foundation**: Deep DSA expertise in C/Java and regular problem-solving on LeetCode (`david_1000`).\n• **Security & Full-Stack Rigor**: 41+ verified certifications (IBM, Cisco, Microsoft, HP).\n\nDavid is open to software engineering internships, technical collaborations, and hackathon teams! Reach him at **david3005.scd@gmail.com**.";
  }

  if (query.includes('contact') || query.includes('email') || query.includes('mail') || query.includes('reach') || query.includes('message') || query.includes('phone') || query.includes('touch') || query.includes('social')) {
    return "You can get in touch with David directly:\n\n• **Email**: david3005.scd@gmail.com\n• **LinkedIn**: https://www.linkedin.com/in/david-varghese-solchadav-group/\n• **GitHub**: https://github.com/davidvarghese10\n• **LeetCode**: https://leetcode.com/u/david_1000/";
  }

  if (query.includes('github') || query.includes('repo') || query.includes('git') || query.includes('source code')) {
    return "Check out David's open-source projects and code repositories on GitHub: **https://github.com/davidvarghese10**.";
  }

  if (query.includes('linkedin')) {
    return "Connect with David on LinkedIn: **https://www.linkedin.com/in/david-varghese-solchadav-group/**.";
  }

  if (query.includes('leetcode')) {
    return "View David's algorithmic problem-solving track record on LeetCode: **https://leetcode.com/u/david_1000/**.";
  }

  // 14. Portfolio Design & Aesthetic
  if (query.includes('how was this website') || query.includes('how did you build this') || query.includes('liquid glass') || query.includes('portfolio design') || query.includes('theme') || query.includes('animation') || query.includes('tech stack of this site')) {
    return "This portfolio is crafted using **React 19, TypeScript, Tailwind CSS, and Framer Motion**:\n\n• **Design Language**: Futuristic Liquid Glassmorphism with electric cyan (#00f3ff) accents.\n• **Performance**: 60fps GPU-accelerated interactive canvas lighting and fluid section transitions.\n• **Features**: Apple-inspired multilingual loader, radar skills visualization, interactive project galleries, and the built-in Livoq AI engine.";
  }

  // 15. Core Computer Science & Concept Explanations
  if (query.includes('what is react')) {
    return "**React** is a popular component-driven JavaScript/TypeScript UI library. David uses React with TypeScript and Framer Motion to build responsive, reactive web applications with state-driven modular architectures.";
  }

  if (query.includes('what is cybersecurity') || query.includes('what is vulnerability')) {
    return "**Cybersecurity** is the practice of protecting computer networks, systems, and programs from digital attacks. David has completed IBM Vulnerability Management and Cisco Cyber Threat Management training to audit and secure software architectures.";
  }

  if (query.includes('what is machine learning') || query.includes('what is ai')) {
    return "**Machine Learning** is a branch of artificial intelligence where algorithms identify patterns in data to make classifications or predictions. David implements ML classification pipelines in projects like MediSense AI and Intevra.";
  }

  // 16. Fallback Synthesizer
  return `David Varghese is a Computer Science & Engineering student at Rajagiri (10.00 SGPA) specializing in full-stack web engineering, cybersecurity, and machine learning.

I can share details on:
• **Featured Projects**: Intevra (AI fraud detection), Aether (interactive weather), MediSense AI, Equora
• **Academic Record**: Perfect 10.00 SGPA at RSET, Class XII (96.0%), Class X (97.6%)
• **Certifications & Skills**: 41+ credentials across IBM, Cisco, Microsoft, HP, Infosys, Deloitte, IEEE
• **Contact & Hiring**: Email him at **david3005.scd@gmail.com**!

*(Tip: You can also click the 🔑 key icon in the chat header to connect your personal Gemini API Key for unlimited open-ended AI conversation!)*`;
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
