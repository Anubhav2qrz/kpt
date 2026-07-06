"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2, Paperclip, FileText, ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useChatContext } from "./ChatContext";

type Message = {
  role: "user" | "model";
  content: string;
  imagePreview?: string; // data URL for displaying uploaded images in chat
};

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export function AiChatWidget() {
  const { isOpen, setIsOpen } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am the KPT AI Tutor. Ask me a question or upload a photo of a problem! 📸",
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

  // Generate file preview when a file is attached
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
      // For PDFs, just show an icon
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
      setFileError("File too large. Maximum 4 MB.");
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
        // Strip the data:... prefix to get raw base64
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const userMsg = input.trim();
    const currentFile = attachedFile;
    const currentPreview = filePreview;
    setInput("");
    removeAttachedFile();

    // Build display content
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

    // Add user message to UI
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
      // Build request body
      const body: any = {
        history: messages.slice(1).slice(-10).map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
        message: userMsg || "Please analyze this image and help me with any problems or questions shown.",
      };

      // Add image if present
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
        throw new Error(
          errorData?.error || "Sorry, I couldn't process that. Please try again! 🙏"
        );
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
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[90vw] sm:w-[420px] h-[540px] max-h-[85vh] glass-card rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--kpt-border)] bg-[var(--kpt-surface)] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: "var(--kpt-text)" }}>KPT AI Tutor</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-[#7a8dbe] hover:text-blue-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex-shrink-0 flex items-center justify-center text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-[var(--kpt-surface)] border border-[var(--kpt-border)] text-[var(--kpt-text)] rounded-tl-none"
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                {/* Image preview in user message */}
                {msg.imagePreview && (
                  <div className="mb-2 rounded-lg overflow-hidden">
                    <img
                      src={msg.imagePreview}
                      alt="Uploaded"
                      className="max-w-full max-h-40 rounded-lg object-contain"
                    />
                  </div>
                )}

                {msg.role === "user" ? (
                  <p>{msg.content}</p>
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
                        return isBlock ? (
                          <pre className="bg-black/30 rounded-lg p-2 my-1.5 overflow-x-auto text-xs"><code>{children}</code></pre>
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
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex-shrink-0 flex items-center justify-center text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-[var(--kpt-surface)] border border-[var(--kpt-border)] text-[var(--kpt-text)] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview Bar */}
        {attachedFile && (
          <div className="px-4 pt-2 border-t border-[var(--kpt-border)] bg-[var(--kpt-surface)]">
            <div className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 rounded-xl px-3 py-2">
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
                <p className="text-xs font-medium truncate" style={{ color: "var(--kpt-text)" }}>
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
          </div>
        )}

        {/* File Error */}
        {fileError && (
          <div className="px-4 pt-2">
            <p className="text-xs text-red-400 flex items-center gap-1">
              ⚠️ {fileError}
            </p>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[var(--kpt-border)] bg-[var(--kpt-surface)] rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="chat-file-input"
            />

            {/* Attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 border disabled:opacity-40"
              style={{
                backgroundColor: attachedFile ? "rgba(37, 99, 235, 0.15)" : "var(--kpt-bg)",
                borderColor: attachedFile ? "rgba(37, 99, 235, 0.3)" : "var(--kpt-border)",
                color: attachedFile ? "rgb(96, 165, 250)" : "var(--kpt-muted)",
              }}
              title="Attach image or PDF"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={attachedFile ? "Add a message (optional)..." : "Ask a physics question..."}
              className="flex-1 bg-[var(--kpt-bg)] border border-[var(--kpt-border)] rounded-xl px-4 py-2 text-[var(--kpt-text)] placeholder-[var(--kpt-muted)] focus:outline-none focus:border-blue-500 transition-colors text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={(!input.trim() && !attachedFile) || isLoading}
              className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
