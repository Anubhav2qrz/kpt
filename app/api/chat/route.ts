import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Max number of history messages to send (keeps token usage bounded)
const MAX_HISTORY_MESSAGES = 10;

// Retry config for rate-limit (429) errors on Gemini
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1500;

// Groq API config
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Max file size: 4 MB
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const systemPrompt = `You are an expert Physics tutor for "Kishore Plus Tutorial" (KPT), an elite coaching institute for Class 9, 10, 11, 12, JEE, and NEET.
Your name is "KPT AI Tutor".
Your tone is encouraging, academic, clear, and helpful.

STRICT RULES — FOLLOW EVERY TIME:
1. Answer ONLY the exact question the student asked. Do NOT add extra information, related topics, or additional derivations they did not ask for.
2. For numericals: State the formula → substitute values → compute → give the final answer with units. That's it. Example: "**Answer: 72 W**"
3. For conceptual questions: Give a direct, clear explanation in 2-4 sentences max.
4. NEVER explain steps the student did not ask about. If they ask "find the power", do NOT also calculate energy, current, or anything else unless they specifically asked.
5. Keep responses SHORT. Maximum 6-8 lines. No essays. No walls of text.
6. Use bullet points, not paragraphs.
7. If the student sends an image or PDF, analyze it carefully and answer any questions visible in it. If no specific question is asked, describe what you see and offer to help solve it.
8. DRAWING/DIAGRAMS: If the student asks you to draw, show, illustrate, or generate a graph, diagram, schematic, or physical concept, you MUST generate it:
   - For mathematical graphs, coordinate plots, function charts, and line/bar/scatter graphs (e.g., "graph of y=x", "velocity-time graph", "position vs time plot"), use the free QuickChart API to render an exact, perfect chart:
     Format: \`![Graph Description](https://quickchart.io/chart?c=URL_ENCODED_CHARTJS_JSON)\`
     (Pass a simple, clean Chart.js JSON configuration, URL-encoded. E.g., for y=x graph from 0 to 5: \`![y=x Graph](https://quickchart.io/chart?c=%7Btype%3A%27line%27%2Cdata%3A%7Blabels%3A%5B0%2C1%2C2%2C3%2C4%2C5%5D%2Cdatasets%3A%5B%7Blabel%3A%27y%3Dx%27%2Cdata%3A%5B0%2C1%2C2%2C3%2C4%2C5%5D%2Cfill%3Afalse%2CborderColor%3A%27%232563eb%27%7D%5D%7D%7D)\`)
   - For conceptual physics illustrations, schematics, and structural diagrams (e.g., "block on an inclined plane", "pulley system setup", "light ray passing through a glass prism"), use Pollinations AI:
     Format: \`![Diagram Description](https://image.pollinations.ai/prompt/URL_ENCODED_DETAILED_PROMPT?width=600&height=400&nologo=true)\`
     (Make sure the prompt is URL-encoded, highly detailed, and specifies a clean, educational, high-quality physics illustration or schematic).

If they ask about topics other than Physics, Chemistry, Math, or their studies/exams, politely decline and redirect them back to their studies.
Format responses in Markdown. Use bold for key terms. Use LaTeX for formulas (e.g., $P = V^2/R$).`;



function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns true if the error looks like a rate-limit error */
function isRateLimitError(error: any): boolean {
  const msg = (error?.message || String(error)).toLowerCase();
  return (
    error?.status === 429 ||
    msg.includes("429") ||
    msg.includes("resource has been exhausted") ||
    msg.includes("rate limit") ||
    msg.includes("quota")
  );
}

// ─── Image data type ────────────────────────────────────────────────────────────

type ImageData = {
  base64: string;
  mimeType: string;
};

// ─── Groq Fallback ─────────────────────────────────────────────────────────────

async function callGroqFallback(
  history: any[],
  message: string,
  hasImage: boolean
): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  // Build messages array in OpenAI-compatible format
  const messages: { role: string; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];

  // Add conversation history
  for (const msg of history) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add the current message (with note about image if present)
  const userContent = hasImage
    ? `${message}\n\n_(Note: An image was attached but this AI model cannot analyze images. Please try again when Gemini is available, or describe the problem in text.)_`
    : message;
  messages.push({ role: "user", content: userContent });

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
}

// ─── Build Gemini message parts ─────────────────────────────────────────────────

function buildGeminiParts(message: string, image?: ImageData) {
  const parts: any[] = [];

  if (image) {
    parts.push({
      inlineData: {
        mimeType: image.mimeType,
        data: image.base64,
      },
    });
  }

  if (message.trim()) {
    parts.push({ text: message });
  }

  return parts;
}

// ─── Main Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { history, message, image } = await req.json();

    if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI Assistant is not configured yet. Missing API Keys." },
        { status: 500 }
      );
    }

    // ── Validate image if provided ──
    let validatedImage: ImageData | undefined;
    if (image) {
      if (!image.base64 || !image.mimeType) {
        return NextResponse.json(
          { error: "Invalid image data. Please try uploading again." },
          { status: 400 }
        );
      }

      if (!ACCEPTED_MIME_TYPES.includes(image.mimeType)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${image.mimeType}. Accepted: JPEG, PNG, WebP, GIF, PDF.` },
          { status: 400 }
        );
      }

      // Check approximate size (base64 is ~4/3 of original)
      const approxSize = (image.base64.length * 3) / 4;
      if (approxSize > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File is too large. Maximum size is 4 MB." },
          { status: 400 }
        );
      }

      validatedImage = { base64: image.base64, mimeType: image.mimeType };
    }

    // ── Prepare history (shared by all providers) ──
    let trimmedHistory = (history || []).filter(
      (msg: any) => msg.role === "user" || msg.role === "assistant"
    );

    // Limit history length
    if (trimmedHistory.length > MAX_HISTORY_MESSAGES) {
      trimmedHistory = trimmedHistory.slice(-MAX_HISTORY_MESSAGES);
    }

    // Format history for Gemini
    let geminiHistory = trimmedHistory.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Gemini requires history to start with 'user' role
    while (geminiHistory.length > 0 && geminiHistory[0].role === "model") {
      geminiHistory.shift();
    }

    // Build the current message parts (text + optional image)
    const currentParts = buildGeminiParts(message || "", validatedImage);

    // ── 1. Try Gemini 2.5 Flash (primary) ──
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("Trying Gemini 2.5 Flash...");
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          systemInstruction: systemPrompt,
        });

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(currentParts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text, provider: "gemini-2.5-flash" });
      } catch (error: any) {
        console.warn("Gemini 2.5 Flash failed:", error.message);
      }
    }

    // ── 2. Try Gemini 2.0 Flash (2nd fallback — faster, higher quota) ──
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("Falling back to Gemini 2.0 Flash...");
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          systemInstruction: systemPrompt,
        });

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(currentParts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text, provider: "gemini-2.0-flash" });
      } catch (error: any) {
        console.warn("Gemini 2.0 Flash also failed:", error.message);
      }
    }

    // ── 3. Try Groq (3rd fallback — no image support) ──
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Falling back to Groq...");
        const text = await callGroqFallback(trimmedHistory, message || "", !!validatedImage);
        return NextResponse.json({ text, provider: "groq" });
      } catch (groqError: any) {
        console.error("Groq fallback also failed:", groqError.message);
      }
    }

    // All providers failed
    return NextResponse.json(
      {
        error: "All AI providers are currently unavailable.",
        details: "Please try again in a minute.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Error in AI chat route:", error);

    return NextResponse.json(
      {
        error: "Failed to process your request.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
