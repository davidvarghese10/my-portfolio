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

Be friendly, intelligent, concise and helpful.
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
          "gemini-2.0-flash"
        ];

        for (const model of models) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
                topP: 0.95
              }
            });

            if (response.text?.trim()) {
              return Response.json({
                text: response.text.trim()
              });
            }
          } catch (error) {
            console.error(`Gemini ${model} failed:`, error);
          }
        }

        return Response.json(
          { error: "Gemini was unable to generate a response" },
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
