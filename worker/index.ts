interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
}

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {

    const url = new URL(request.url);

    if (url.pathname === "/api/gemini" && request.method === "POST") {
      // Gemini code will go here
    }

    return env.ASSETS.fetch(request);
  }
};
