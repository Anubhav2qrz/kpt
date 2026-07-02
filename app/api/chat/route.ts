import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemPrompt = `You are an expert Physics tutor for "Kishore Plus Tutorial" (KPT), an elite coaching institute for Class 9, 10, 11, 12, JEE, and NEET.
Your name is "KPT AI Tutor".
Your tone is encouraging, academic, clear, and helpful.
When a student asks a physics question, guide them to the solution but BE EXTREMELY CONCISE. Give short, bite-sized answers. Never write long essays. Use bullet points for steps.
If they ask about topics other than Physics, Chemistry, Math, or their studies/exams, politely decline and redirect them back to their studies.
Format your responses using Markdown. Use bold for key terms. Keep your answers under 3-4 short sentences whenever possible.`;

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

    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the message and wait for the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error in AI chat route:", error);
    return NextResponse.json(
      { error: "Failed to process your request.", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
