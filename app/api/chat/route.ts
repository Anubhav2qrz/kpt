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

// ─── Groq Fallback ─────────────────────────────────────────────────────────────

async function callGroqFallback(
  history: any[],
  message: string
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

  // Add the current message
  messages.push({ role: "user", content: message });

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

// ─── Main Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json();

    if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI Assistant is not configured yet. Missing API Keys." },
        { status: 500 }
      );
    }

    // ── Prepare history (shared by both providers) ──
    let trimmedHistory = (history || []).filter(
      (msg: any) => msg.role === "user" || msg.role === "assistant"
    );

    // Limit history length
    if (trimmedHistory.length > MAX_HISTORY_MESSAGES) {
      trimmedHistory = trimmedHistory.slice(-MAX_HISTORY_MESSAGES);
    }

    // ── Try Gemini first ──
    if (process.env.GEMINI_API_KEY) {
      let geminiError: any = null;

      // Format history for Gemini
      let geminiHistory = trimmedHistory.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      // Gemini requires history to start with 'user' role
      while (geminiHistory.length > 0 && geminiHistory[0].role === "model") {
        geminiHistory.shift();
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
      });

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const chat = model.startChat({ history: geminiHistory });
          const result = await chat.sendMessage(message);
          const response = await result.response;
          const text = response.text();

          // Gemini succeeded!
          return NextResponse.json({ text, provider: "gemini" });
        } catch (error: any) {
          geminiError = error;
          if (isRateLimitError(error) && attempt < MAX_RETRIES - 1) {
            const delay = BASE_DELAY_MS * Math.pow(2, attempt);
            console.warn(
              `Gemini rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`
            );
            await sleep(delay);
            continue;
          }
          // If it's a rate limit on the last attempt, break to try Groq
          if (isRateLimitError(error)) {
            console.warn("Gemini rate limit exhausted, falling back to Groq...");
            break;
          }
          // For non-rate-limit errors, also try Groq as fallback
          console.error("Gemini error, falling back to Groq:", error.message);
          break;
        }
      }
    }

    // ── Fallback to Groq ──
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Using Groq fallback...");
        const text = await callGroqFallback(trimmedHistory, message);
        return NextResponse.json({ text, provider: "groq" });
      } catch (groqError: any) {
        console.error("Groq fallback also failed:", groqError.message);
        return NextResponse.json(
          {
            error: "Both AI providers are currently unavailable.",
            details: "Please try again in a minute.",
          },
          { status: 503 }
        );
      }
    }

    // Neither provider available
    return NextResponse.json(
      { error: "No AI provider is available.", details: "Please try again later." },
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
