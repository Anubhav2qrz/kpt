"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Message = {
  role: "user" | "model";
  content: string;
};

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am the KPT AI Tutor. How can I help you with your studies today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Only send the last 10 messages of history to keep token usage low
      const recentHistory = messages.slice(1).slice(-10);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: recentHistory,
          message: userMsg,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429 || errData.isRateLimit) {
          throw new Error(
            "The AI tutor is taking a short break due to high usage. Please wait about a minute and try again! 🕐"
          );
        }
        throw new Error(errData.details || "Failed to get response");
      }

      const data = await response.json();
      
      setMessages([...newMessages, { role: "model", content: data.text }]);
    } catch (error: any) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "model", content: `${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 px-6 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all z-50 hover:scale-105 active:scale-95 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Tutor Chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-bold tracking-wide">AI Tutor</span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh] glass-card rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
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

        {/* Input */}
        <div className="p-4 border-t border-[var(--kpt-border)] bg-[var(--kpt-surface)] rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a physics question..."
              className="flex-1 bg-[var(--kpt-bg)] border border-[var(--kpt-border)] rounded-xl px-4 py-2 text-[var(--kpt-text)] placeholder-[var(--kpt-muted)] focus:outline-none focus:border-blue-500 transition-colors text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
