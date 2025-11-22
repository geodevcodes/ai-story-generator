import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type StoryLine = {
  text: string;
  prompt: string;
};

export async function POST(req: Request) {
  const headers = { "Content-Type": "application/json" };

  try {
    const body = await req.json();
    const { seed } = body;

    if (!seed?.trim()) {
      return new Response(JSON.stringify({ error: "Missing Seed" }), {
        status: 400,
        headers,
      });
    }

    const prompt = `
      You are a creative story engine.

      Given a seed sentence, produce a short story split into 6-10 concise lines. 
      Each line should include a vivid, single-sentence narrative and an image prompt describing a scene to illustrate that line.
      Return strict JSON as an array named lines. Each element must be an object with keys: text(string) and prompt (string).
      No additional commentary
      Return ONLY valid JSON:
      Seed: "${seed}"
    `;

    console.log("📤 Sending prompt to OpenAI...");

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    console.log("📥 Raw AI Output:", response.output_text);
    
    const rawText = response.output_text ?? "";
    let lines: StoryLine[] = [];

    try {
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedText);
      lines = Array.isArray(parsed?.lines) ? parsed.lines : parsed;
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to parse story",
          details: String(error),
        }),
        { status: 502, headers }
      );
    }

    return new Response(JSON.stringify({ story: lines }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);

    return new Response(
      JSON.stringify({ error: "Server error", details: String(error) }),
      { status: 500, headers }
    );
  }
}
