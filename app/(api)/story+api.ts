import { GoogleGenAI } from "@google/genai";
type StoryLine = {
  text: string;
  prompt: string;
};

export async function POST(request: Request) {
  const headers = { "Content-type": "application/json" };
  try {
    const { seed } = (await request.json()) as { seed?: string };
    if (!seed?.trim())
      return new Response(JSON.stringify({ error: "Missing Seed" }), {
        status: 400,
        headers,
      });
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey)
      return new Response(
        JSON.stringify({ error: "Server misconfigured: missing API Key" }),
        {
          headers,
          status: 500,
        }
      );

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a creative story engine. Given a seed sentence, produce a short story split into 6-10 concise lines. 
    Each line should include a vivid, single-sentence narrative and an image prompt describing a scene to illustrate that line.
    Return strict JSON as an array named lines. Each element must be an object with keys: text(string) and prompt (string).
    No additional commentary.
    Seed: ${seed}
    Return only JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    console.log(response.text);
    const rawText = response?.text || "";
    let lines: StoryLine[] = [];
    try {
      const parsed = JSON.parse(rawText);
      lines = Array.isArray(parsed?.lines) ? parsed.lines : parsed;
    } catch (error) {
      const match = rawText.match(/\[([\s\S]*?)\]/);
      if (match) lines = JSON.parse(match[0]);
      else
        return new Response(
          JSON.stringify({ error: "Failed to parse story" }),
          {
            status: 502,
            headers,
          }
        );
    }
    return new Response(JSON.stringify({ story: lines }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers,
      status: 500,
    });
  }
}
