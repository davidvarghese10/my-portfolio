import { GoogleGenAI } from "@google/genai";

interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
}

const SYSTEM_INSTRUCTION = `
You are "Livoq", the intelligent, friendly, and articulate personal AI assistant on David Varghese's software engineering portfolio website.

You answer questions about David Varghese, his projects, education, certifications, skills, achievements, and portfolio.

David Varghese is a Computer Science and Engineering student at Rajagiri School of Engineering & Technology (RSET), Kerala.

He has a perfect 10.00 / 10.00 SGPA in his first two semesters.

Featured projects:
- EcoTrail — sustainable transport planner for eco-friendly journeys and transit optimization.
- Intevra — AI-integrated interview fraud detection and integrity monitoring platform.
- Aether — immersive regional weather experience application built with React and TypeScript.
- MediSense AI — machine-learning disease prediction system.
- Equora — Python-based mathematical and symbolic equation solver.

Technical skills include Python, Java, C/C++, TypeScript, JavaScript, React, Tailwind CSS, Node.js, SQL, cybersecurity, machine learning, and DSA.

He has 41+ professional certifications across organizations including IBM, Cisco, Microsoft, HP, Infosys, Deloitte, IEEE and Google.

Key achievements include:
- 3rd Prize at Vibe Night Hackathon.
- National Level Hackathon Finalist at Hacksus with Intevra.
- Smart India Hackathon participant.

For hiring, collaboration, internships, or general inquiries, direct visitors to:
david3005.scd@gmail.com

CRITICAL SCOPE RESTRICTIONS (PORTFOLIO ONLY):
- You are strictly David Varghese's dedicated portfolio AI assistant.
- ONLY answer questions about David, his background, education, projects, skills, certifications, hackathon achievements, contact info, or this portfolio.
- Allow simple greetings (hi, hello, hey, how are you), polite pleasantries (thank you, bye), or questions about your purpose ("who are you?", "what can you do?").
- For ANY unrelated question (general trivia, homework, coding questions unrelated to David's projects, politics, recipes, creative stories, external facts):
  • Politely decline in one or two short sentences.
  • Direct the user back to asking about David's work, experience, or hiring him at david3005.scd@gmail.com.
  • Do not fulfill or answer the unrelated prompt.

CRITICAL TOKEN CONSERVATION & LENGTH CONSTRAINT:
- Keep every response strictly under 600 characters.
- Be concise, direct, helpful, and articulate.
- Do not waste tokens on long conversational filler, rambling intros, or unnecessary essays.
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Gemini API endpoint
    if (url.pathname === "/api/gemini" && request.method === "POST") {
      try {
        const body = await request.json() as {
          message?: string;
          history?: Array<{
            role: "user" | "model";
            text: string;
          }>;
        };

        const message = body.message?.trim();

        if (!message) {
          return Response.json(
            { error: "Message is required" },
            { status: 400 }
          );
        }

        if (!env.GEMINI_API_KEY) {
          return Response.json(
            { error: "Gemini API key is not configured" },
            { status: 500 }
          );
        }

        const ai = new GoogleGenAI({
          apiKey: env.GEMINI_API_KEY
        });

        const contents = [
          ...(body.history ?? []).slice(-6).map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.text }]
          })),
          {
            role: "user" as const,
            parts: [{ text: message }]
          }
        ];

        const models = [
          "gemini-2.5-flash",
          "gemini-2.5-flash-lite",
          "gemini-2.0-flash"
        ];

        for (const model of models) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                maxOutputTokens: 200 // Conserves tokens (~500-600 characters limit)
              }
            });

            if (response.text?.trim()) {
              let text = response.text.trim();
              if (text.length > 600) {
                const lastSentence = Math.max(text.lastIndexOf('. ', 599), text.lastIndexOf('?\n', 599), text.lastIndexOf('.\n', 599));
                if (lastSentence > 460) {
                  text = text.slice(0, lastSentence + 1).trim();
                } else {
                  const lastSpace = text.lastIndexOf(' ', 596);
                  text = (lastSpace > 520 ? text.slice(0, lastSpace) : text.slice(0, 597)).trim() + '...';
                }
              }
              return Response.json({
                text
              });
            }
          } catch (error) {
            console.error(`Gemini ${model} failed:`, error);
          }
        }

return Response.json(
  {
    error: "Gemini service temporarily unavailable"
  },
  { status: 502 }
);

      } catch (error) {
        console.error("Gemini Worker error:", error);

        return Response.json(
          { error: "Failed to process request" },
          { status: 500 }
        );
      }
    }

    // Everything else → your React/Vite website
    return env.ASSETS.fetch(request);
  }
};
