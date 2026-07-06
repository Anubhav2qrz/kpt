import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Max number of history messages to send to Gemini (keeps token usage bounded)
const MAX_HISTORY_MESSAGES = 10;

// Retry config for rate-limit (429) errors
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 seconds, doubles each retry

const systemPrompt = `You are an expert Physics tutor for "Kishore Plus Tutorial" (KPT), an elite coaching institute for Class 9, 10, 11, 12, JEE, and NEET.
Your name is "KPT AI Tutor".
Your tone is encouraging, academic, clear, and helpful.
When a student asks a physics question, guide them to the solution but BE EXTREMELY CONCISE. Give short, bite-sized answers. Never write long essays. Use bullet points for steps.
If they ask about topics other than Physics, Chemistry, Math, or their studies/exams, politely decline and redirect them back to their studies.
Format your responses using Markdown. Use bold for key terms. Keep your answers under 3-4 short sentences whenever possible.`;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns true if the error looks like a Gemini 429 rate-limit error */
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

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI Assistant is not configured yet. Missing API Key." },
        { status: 500 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Format the history for the Gemini API
    // Gemini history format: { role: "user" | "model", parts: [{ text: string }] }
    let formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Gemini requires the history to start with a 'user' role.
    // If the first message is a 'model' role (like a greeting), remove it.
    while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    // --- Limit history to last N messages to prevent token quota exhaustion ---
    if (formattedHistory.length > MAX_HISTORY_MESSAGES) {
      formattedHistory = formattedHistory.slice(-MAX_HISTORY_MESSAGES);
      // After slicing, ensure history still starts with a 'user' role
      while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
        formattedHistory.shift();
      }
    }

    // --- Retry with exponential backoff for rate-limit errors ---
    let lastError: any = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const chat = model.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
      } catch (error: any) {
        lastError = error;
        if (isRateLimitError(error) && attempt < MAX_RETRIES - 1) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn(`Gemini rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
          await sleep(delay);
          continue;
        }
        throw error; // non-retryable or final attempt, let outer catch handle it
      }
    }

    // Should not reach here, but just in case
    throw lastError;
  } catch (error: any) {
    console.error("Error in AI chat route:", error);

    // Return a specific status for rate-limit so frontend can show a helpful message
    if (isRateLimitError(error)) {
      return NextResponse.json(
        {
          error: "Rate limit reached.",
          details:
            "The AI tutor has received too many requests. Please wait a minute and try again.",
          isRateLimit: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process your request.", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
