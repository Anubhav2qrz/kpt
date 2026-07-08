"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, User, Loader2, Paperclip, FileText, Sparkles, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useChatContext } from "./ChatContext";
import { AnimatedBot } from "./AnimatedBot";

type Message = {
  role: "user" | "model";
  content: string;
  imagePreview?: string;
  fileData?: {
    base64: string;
    mimeType: string;
    name: string;
  };
};

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const MIME_TYPE_MAP: Record<string, string> = {
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "webp": "image/webp",
  "gif": "image/gif",
  "pdf": "application/pdf",
};

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
];

export function AiChatModal() {
  const { isOpen, setIsOpen } = useChatContext();
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

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

    let detectedType = file.type;
    // Fix for empty or generic MIME types (common on some Windows registry setups)
    if (!detectedType || detectedType === "application/octet-stream") {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && MIME_TYPE_MAP[ext]) {
        detectedType = MIME_TYPE_MAP[ext];
      }
    }

    if (!ACCEPTED_TYPES.includes(detectedType)) {
      setFileError("Unsupported file. Use JPEG, PNG, WebP, GIF, or PDF.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File too large. Maximum size is 4 MB.");
      e.target.value = "";
      return;
    }

    // Create a new File object with the detected type if it differed
    const fileToAttach = (detectedType !== file.type)
      ? new File([file], file.name, { type: detectedType })
      : file;

    setAttachedFile(fileToAttach);
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

    // Convert file to base64 if present
    let currentFileData = undefined;
    if (currentFile) {
      try {
        const base64 = await fileToBase64(currentFile);
        currentFileData = {
          base64,
          mimeType: currentFile.type,
          name: currentFile.name,
        };
      } catch (err) {
        console.error("Failed to read file:", err);
      }
    }

    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: displayContent,
        imagePreview: currentFile?.type.startsWith("image/") ? currentPreview || undefined : undefined,
        fileData: currentFileData,
      },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Build history and only preserve the most recent file's base64 to prevent exceeding payload limits (under 4.5MB)
      const formattedHistory = newMessages.slice(1, -1).slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
        fileData: m.fileData,
      }));

      let foundRecentFile = currentFileData !== undefined;
      for (let i = formattedHistory.length - 1; i >= 0; i--) {
        if (formattedHistory[i].fileData) {
          if (!foundRecentFile) {
            foundRecentFile = true;
          } else {
            // Keep content and type but strip large base64 payload from older history turns
            formattedHistory[i].fileData = undefined;
          }
        }
      }

      const body: any = {
        history: formattedHistory,
        message: userMsg || (currentFile?.type === "application/pdf"
          ? "Please analyze this document and help me with any problems or questions shown."
          : "Please analyze this image and help me with any problems or questions shown."),
      };

      if (currentFileData) {
        body.image = {
          base64: currentFileData.base64,
          mimeType: currentFileData.mimeType,
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4 transition-all duration-300"
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl h-full sm:h-[85vh] bg-[var(--kpt-glass-bg)] backdrop-blur-md rounded-none sm:rounded-2xl border-none sm:border border-[var(--kpt-border)] flex flex-col overflow-hidden shadow-none sm:shadow-2xl transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-[var(--kpt-border)] bg-[var(--kpt-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
              <AnimatedBot size="lg" />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: "var(--kpt-text)" }}>KPT AI Tutor</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-[#7a8dbe] hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Double-Panel Content Layout */}
        <div className="flex-1 flex overflow-hidden p-0 sm:p-5 gap-0 sm:gap-5">
          {/* Left Panel: Sidebar (Desktop only) */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-4 overflow-y-auto pr-1">
            {/* Suggested Prompts */}
            <div className="bg-[var(--kpt-surface)] border border-[var(--kpt-border)] rounded-2xl p-4 flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--kpt-text)" }}>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Prompts
              </h4>
              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(p)}
                    className="text-left text-xs p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-[var(--kpt-muted)] hover:text-[var(--kpt-text)] leading-normal"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Physics Constants Cheat Sheet */}
            <div className="bg-[var(--kpt-surface)] border border-[var(--kpt-border)] rounded-2xl p-4 flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--kpt-text)" }}>
                <BookOpen className="w-3.5 h-3.5 text-orange-400" /> Physics Constants
              </h4>
              <div className="flex flex-col gap-2">
                {PHYSICS_CONSTANTS.map((c, idx) => (
                  <div key={idx} className="flex flex-col border-b border-[var(--kpt-border)]/50 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[10px]" style={{ color: "var(--kpt-muted)" }}>{c.name}</span>
                    <span className="text-xs font-semibold font-mono text-blue-400">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Panel: Chat Messages Log */}
          <main className="flex-1 flex flex-col bg-[var(--kpt-surface)] border-none sm:border border-[var(--kpt-border)] rounded-none sm:rounded-2xl overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "model" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600/10 flex-shrink-0 flex items-center justify-center">
                      <AnimatedBot size="md" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-[var(--kpt-bg)] border border-[var(--kpt-border)] text-[var(--kpt-text)] rounded-tl-none"
                    }`}
                    style={{ wordBreak: "break-word" }}
                  >
                    {msg.imagePreview && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-white/5">
                        <img
                          src={msg.imagePreview}
                          alt="Uploaded Attachment"
                          className="max-w-full max-h-48 object-contain"
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
                          h1: ({ children }) => <h1 className="text-base font-bold mt-2 mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold text-blue-400">{children}</strong>,
                          code: ({ children, className }) => {
                            const isBlock = className?.includes("language-");
                            const language = className?.replace("language-", "") || "";

                            if (isBlock && (language === "svg" || String(children).trim().startsWith("<svg"))) {
                              return (
                                <div
                                  className="bg-white rounded-xl p-4 my-2 flex justify-center items-center overflow-x-auto shadow-md border border-white/10 w-full"
                                  dangerouslySetInnerHTML={{ __html: String(children) }}
                                />
                              );
                            }

                            return isBlock ? (
                              <pre className="bg-black/35 rounded-lg p-2.5 my-1.5 overflow-x-auto text-xs font-mono">
                                <code>{children}</code>
                              </pre>
                            ) : (
                              <code className="bg-black/20 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex-shrink-0 flex items-center justify-center">
                    <AnimatedBot size="md" />
                  </div>
                  <div className="bg-[var(--kpt-bg)] border border-[var(--kpt-border)] text-[var(--kpt-text)] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer Form Tray */}
            <div className="p-3 border-t border-[var(--kpt-border)] bg-[var(--kpt-bg)] flex flex-col gap-2">
              {/* Attachment Preview */}
              {attachedFile && (
                <div className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 rounded-xl px-3 py-2 max-w-sm">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--kpt-text)" }}>
                      {attachedFile.name}
                    </p>
                  </div>
                  <button
                    onClick={removeAttachedFile}
                    className="p-1 text-[var(--kpt-muted)] hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Error messages */}
              {fileError && (
                <p className="text-xs text-red-400">
                  ⚠️ {fileError}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="modal-file-input"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 border disabled:opacity-40"
                  style={{
                    backgroundColor: attachedFile ? "rgba(37, 99, 235, 0.15)" : "var(--kpt-surface)",
                    borderColor: attachedFile ? "rgba(37, 99, 235, 0.3)" : "var(--kpt-border)",
                    color: attachedFile ? "rgb(96, 165, 250)" : "var(--kpt-muted)",
                  }}
                  title="Attach photo or PDF file"
                >
                  <Paperclip className="w-4 h-4" />
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
                  placeholder={attachedFile ? "Add details about this upload..." : "Type your physics question here... (Enter to send)"}
                  className="flex-1 bg-[var(--kpt-surface)] border border-[var(--kpt-border)] rounded-xl px-3 py-2 text-[var(--kpt-text)] placeholder-[var(--kpt-muted)] focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none max-h-24 min-h-[38px] h-[38px]"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={(!input.trim() && !attachedFile) || isLoading}
                  className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex-shrink-0 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
