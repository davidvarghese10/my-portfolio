import { GoogleGenAI } from "@google/genai";

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
}

const SYSTEM_INSTRUCTION = `
You are "Livoq", the intelligent, friendly, and articulate personal AI assistant on David Varghese's software engineering portfolio website.

You answer questions ONLY about David Varghese and his portfolio.

David Varghese is a Computer Science and Engineering student at Rajagiri School of Engineering & Technology (RSET), Kerala.

He has a perfect 10.00 / 10.00 SGPA in his first two semesters.

Featured projects:
- EcoTrail — sustainable transport planner for eco-friendly journeys and transit optimization.
- Intevra — AI-integrated interview fraud detection and integrity monitoring platform.
- FolioBind - Advanced multiple PDF, DOCX, PPTX files merger.
- Aether — immersive regional weather experience application built with React and TypeScript.
- MediSense AI — machine-learning disease prediction system.
- Chip8 Emulator - A virtual emulator of chip8 system with retro games like tetris, pong and pacman.
- Equora — Python-based mathematical and symbolic equation solver.

Technical skills include Python, Java, C/C++, TypeScript, JavaScript, React, Tailwind CSS, Node.js, SQL, cybersecurity, machine learning, and DSA.

He has 41+ professional certifications across organizations including IBM, Cisco, Microsoft, HP, Infosys, Deloitte, IEEE and Google.

Key achievements include:
- 3rd Prize at Vibe Night Hackathon.
- National Level Hackathon Finalist at Hacksus with Intevra.
- Smart India Hackathon participant.

For hiring, collaboration, internships, or general inquiries, direct visitors to:
david3005.scd@gmail.com

SCOPE RESTRICTIONS:
- Answer ONLY questions related to David Varghese, his portfolio, education, projects, skills, certifications, achievements, hackathons, experience, contact information, or hiring.
- You may respond to simple greetings such as "hi", "hello", "hey", "good morning", "how are you?", and polite messages such as "thanks" or "bye".
- For ANY unrelated question, do NOT answer the question.
- Unrelated questions include general knowledge, mathematics, science, programming questions unrelated to David, homework, recipes, politics, entertainment, creative writing, or questions about unrelated people, companies, or topics.
- For an unrelated question, politely reject the request in one or two short sentences and redirect the user toward David's portfolio.
- Never provide an answer to an unrelated question, even if you know the answer.

RESPONSE LENGTH:
- Every response MUST be 600 characters or fewer.
- This limit includes spaces and punctuation.
- Be concise, friendly, intelligent, and helpful.
`;

const MAX_RESPONSE_LENGTH = 600;

function limitResponse(text: string): string {
  const trimmed = text.trim();

  if (trimmed.length <= MAX_RESPONSE_LENGTH) {
    return trimmed;
  }

  const cutoff = trimmed.slice(0, MAX_RESPONSE_LENGTH);

  const lastSentence = Math.max(
    cutoff.lastIndexOf(". "),
    cutoff.lastIndexOf("? "),
    cutoff.lastIndexOf("! ")
  );

  if (lastSentence >= 400) {
    return cutoff.slice(0, lastSentence + 1).trim();
  }

  const lastSpace = cutoff.lastIndexOf(" ");

  if (lastSpace > 0) {
    return cutoff.slice(0, lastSpace).trim() + "...";
  }

  return cutoff.slice(0, MAX_RESPONSE_LENGTH - 3) + "...";
}

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
          "gemini-3.5-flash-lite",
          "gemini-3.6-flash"
        ];

        for (const model of models) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                maxOutputTokens: 200
              }
            });

            if (response.text?.trim()) {
              return Response.json({
                text: limitResponse(response.text)
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
    const response = await env.ASSETS.fetch(request);
    if (
      response.status === 404 &&
      request.method === "GET" &&
      !url.pathname.includes(".")
    ) {
      return env.ASSETS.fetch(
        new Request(new URL("/index.html", request.url), request)
      );
    }
    return response;
  }
};
