"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, Send, Bot, User, Loader2, Paperclip, FileText, ArrowLeft, HelpCircle, Sparkles, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Message = {
  role: "user" | "model";
  content: string;
  imagePreview?: string;
};

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const SUGGESTED_PROMPTS = [
  "Explain Newton's Laws of Motion in simple terms.",
  "Solve this: A car starts from rest and accelerates at 2m/s² for 5 seconds. Find distance.",
  "What is the difference between elastic and inelastic collision?",
  "Derive the formula for escape velocity.",
];

const PHYSICS_CONSTANTS = [
  { name: "Acceleration due to gravity (g)", value: "9.8 m/s²" },
  { name: "Speed of Light (c)", value: "3 × 10⁸ m/s" },
  { name: "Universal Gravitational (G)", value: "6.67 × 10⁻¹¹ N·m²/kg²" },
  { name: "Planck's Constant (h)", value: "6.63 × 10⁻³⁴ J·s" },
  { name: "Elementary Charge (e)", value: "1.6 × 10⁻¹⁹ C" },
  { name: "Avogadro's Number (N_A)", value: "6.02 × 10²³ mol⁻¹" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am your KPT AI Tutor. Ask me any Physics question, or upload a photo of a problem from your book/notes! 📸\n\nI can analyze equations, diagrams, and text to give you quick, step-by-step solutions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!attachedFile) {
      setFilePreview(null);
      return;
    }

    if (attachedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(attachedFile);
    } else {
      setFilePreview(null);
    }
  }, [attachedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Unsupported file. Use JPEG, PNG, WebP, GIF, or PDF.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File too large. Maximum size is 4 MB.");
      e.target.value = "";
      return;
    }

    setAttachedFile(file);
    setFileError(null);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSendPrompt = (promptText: string) => {
    if (isLoading) return;
    setInput(promptText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const userMsg = input.trim();
    const currentFile = attachedFile;
    const currentPreview = filePreview;
    setInput("");
    removeAttachedFile();

    // Display string
    let displayContent = userMsg;
    if (currentFile && !userMsg) {
      displayContent = currentFile.type === "application/pdf"
        ? `📄 ${currentFile.name}`
        : `📷 Uploaded an image`;
    } else if (currentFile && userMsg) {
      displayContent = currentFile.type === "application/pdf"
        ? `📄 ${currentFile.name}\n\n${userMsg}`
        : userMsg;
    }

    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: displayContent,
        imagePreview: currentFile?.type.startsWith("image/") ? currentPreview || undefined : undefined,
      },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const body: any = {
        history: messages.slice(1).slice(-10).map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
        message: userMsg || "Please analyze this image and help me with any problems or questions shown.",
      };

      if (currentFile) {
        const base64 = await fileToBase64(currentFile);
        body.image = {
          base64,
          mimeType: currentFile.type,
        };
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Sorry, I couldn't process that. Please try again! 🙏");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "model", content: data.text }]);
    } catch (error: any) {
      console.error(error);
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: error.message || "Sorry, something went wrong. Please try again in a moment! 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--kpt-bg)] flex flex-col pt-16">
      {/* Top Navigation Row */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--kpt-nav-bg)] border-b border-[var(--kpt-border)] backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-40">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-blue-400"
          style={{ color: "var(--kpt-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ color: "var(--kpt-text)" }}>
              KPT AI Tutor
            </h1>
          </div>
        </div>
        <div className="w-24 text-right">
          <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5 justify-end">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Live
          </span>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Panel: Cheatsheets & Guides (Hidden on Mobile) */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-6 overflow-y-auto">
          {/* Quick Prompts */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--kpt-text)" }}>
              <Sparkles className="w-4 h-4 text-blue-400" /> Suggested Prompts
            </h2>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(p)}
                  className="text-left text-xs p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/35 hover:bg-blue-500/5 transition-all text-[var(--kpt-muted)] hover:text-[var(--kpt-text)]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Physics Cheat Sheet */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--kpt-text)" }}>
              <BookOpen className="w-4 h-4 text-orange-400" /> Constant Cheat Sheet
            </h2>
            <div className="flex flex-col gap-3">
              {PHYSICS_CONSTANTS.map((c, idx) => (
                <div key={idx} className="flex flex-col border-b border-[var(--kpt-border)] pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px]" style={{ color: "var(--kpt-muted)" }}>{c.name}</span>
                  <span className="text-xs font-semibold font-mono text-blue-400">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Panel: Wide Chat Console */}
        <main className="flex-1 flex flex-col glass-card overflow-hidden relative">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 flex-shrink-0 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Bot className="w-6 h-6" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-4 text-sm sm:text-base leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10"
                      : "bg-[var(--kpt-surface)] border border-[var(--kpt-border)] text-[var(--kpt-text)] rounded-tl-none"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {msg.imagePreview && (
                    <div className="mb-3 rounded-xl overflow-hidden max-w-md border border-white/10 shadow-md">
                      <img
                        src={msg.imagePreview}
                        alt="Attachment"
                        className="w-full max-h-72 object-contain bg-black/40"
                      />
                    </div>
                  )}

                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-blue-400">{children}</strong>,
                        code: ({ children, className }) => {
                          const isBlock = className?.includes("language-");
                          return isBlock ? (
                            <pre className="bg-black/35 rounded-xl p-3 my-2 overflow-x-auto text-xs font-mono border border-white/5">
                              <code>{children}</code>
                            </pre>
                          ) : (
                            <code className="bg-black/25 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center shadow-lg border border-blue-500/20">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex-shrink-0 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="bg-[var(--kpt-surface)] border border-[var(--kpt-border)] text-[var(--kpt-text)] rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="text-sm font-medium">Tutor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Action Tray */}
          <div className="p-4 border-t border-[var(--kpt-border)] bg-[var(--kpt-surface)] flex flex-col gap-3">
            {/* Attachment preview bar */}
            {attachedFile && (
              <div className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/25 rounded-xl px-3 py-2.5 max-w-md animate-fade-in">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--kpt-text)" }}>
                    {attachedFile.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--kpt-muted)" }}>
                    {(attachedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  onClick={removeAttachedFile}
                  className="p-1 text-[var(--kpt-muted)] hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error notifications */}
            {fileError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                ⚠️ {fileError}
              </p>
            )}

            {/* Actual Input */}
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="page-file-input"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 border disabled:opacity-40"
                style={{
                  backgroundColor: attachedFile ? "rgba(37, 99, 235, 0.15)" : "var(--kpt-bg)",
                  borderColor: attachedFile ? "rgba(37, 99, 235, 0.3)" : "var(--kpt-border)",
                  color: attachedFile ? "rgb(96, 165, 250)" : "var(--kpt-muted)",
                }}
                title="Attach photo or PDF document"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={attachedFile ? "Add details about this upload..." : "Type your physics question here... (Press Enter to send)"}
                className="flex-1 bg-[var(--kpt-bg)] border border-[var(--kpt-border)] rounded-xl px-4 py-3 text-[var(--kpt-text)] placeholder-[var(--kpt-muted)] focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base resize-none max-h-32 min-h-[48px] h-[48px]"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={(!input.trim() && !attachedFile) || isLoading}
                className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex-shrink-0 shadow-lg shadow-blue-600/10"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
