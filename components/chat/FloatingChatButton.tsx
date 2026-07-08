"use client";

import React, { useState, useEffect } from "react";
import { useChatContext } from "./ChatContext";

export function FloatingChatButton() {
  const { isOpen, toggleChat } = useChatContext();
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  // Auto-hide bubble after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // If the chat modal is already open, hide the floating button to avoid overlap/clutter
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end select-none">
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div
          className="mb-2 bg-[var(--kpt-glass-bg)] border border-[var(--kpt-border)] text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-1.5 relative animate-bounce-slow max-w-[180px] text-right cursor-pointer"
          onClick={() => setShowSpeechBubble(false)}
          title="Dismiss tooltip"
          style={{
            borderColor: "rgba(96, 165, 250, 0.25)",
            boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.15)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
          </span>
          <span>Ask Kip anything! 🤖</span>
          
          {/* Arrow */}
          <div
            className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 rotate-45 border-r border-b border-[var(--kpt-border)] bg-[var(--kpt-glass-bg)]"
            style={{
              borderColor: "rgba(96, 165, 250, 0.25)",
            }}
          />
        </div>
      )}

      {/* Walking Character Container */}
      <div className="relative w-36 h-10 pointer-events-none mb-[-5px] mr-1">
        {/* Walking Robot Mascot (Kip) */}
        <div className="absolute left-1 bottom-0 w-9 h-9 animate-pace origin-bottom">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(37,99,235,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Leg */}
            <line
              x1="35"
              y1="72"
              x2="35"
              y2="92"
              stroke="#2563eb"
              strokeWidth="8"
              strokeLinecap="round"
              className="animate-walk-left"
              style={{ transformOrigin: "35px 72px" }}
            />
            {/* Right Leg */}
            <line
              x1="65"
              y1="72"
              x2="65"
              y2="92"
              stroke="#2563eb"
              strokeWidth="8"
              strokeLinecap="round"
              className="animate-walk-right"
              style={{ transformOrigin: "65px 72px" }}
            />

            {/* Antennas / Ears */}
            <g className="animate-wiggle origin-bottom" style={{ transformOrigin: "50px 80px" }}>
              <path
                d="M32 25 L25 15 M68 25 L75 15"
                stroke="url(#mascotGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="23" cy="12" r="5" fill="#f97316" className="animate-pulse" />
              <circle cx="77" cy="12" r="5" fill="#f97316" className="animate-pulse" />
            </g>

            {/* Head / Body */}
            <rect
              x="15"
              y="22"
              width="70"
              height="52"
              rx="24"
              fill="url(#mascotGrad)"
              stroke="#2563eb"
              strokeWidth="3.5"
            />

            {/* Face Screen */}
            <rect
              x="24"
              y="32"
              width="52"
              height="30"
              rx="12"
              fill="#050a1e"
              stroke="#1d4ed8"
              strokeWidth="2"
            />

            {/* Digital Eyes (Blinking) */}
            <ellipse
              cx="39"
              cy="47"
              rx="4.5"
              ry="6.5"
              fill="#60a5fa"
              className="animate-blink origin-center"
              style={{ transformOrigin: "39px 47px" }}
            />
            <ellipse
              cx="61"
              cy="47"
              rx="4.5"
              ry="6.5"
              fill="#60a5fa"
              className="animate-blink origin-center"
              style={{ transformOrigin: "61px 47px" }}
            />

            {/* Smile */}
            <path
              d="M45 54 Q50 58 55 54"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cheek glow */}
            <circle cx="31" cy="51" r="2" fill="#f43f5e" opacity="0.6" />
            <circle cx="69" cy="51" r="2" fill="#f43f5e" opacity="0.6" />

            {/* Gradients */}
            <defs>
              <linearGradient id="mascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="60%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Button Wrapper with pulsing organic aura rings */}
      <div className="relative">
        {/* Glowing Aura Rings */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-[12px] scale-105 animate-pulse pointer-events-none" />
        <div
          className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-[20px] scale-125 animate-pulse pointer-events-none"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Neon track */}
        <div className="absolute top-[-1px] left-1 right-1 h-[1.5px] bg-gradient-to-r from-blue-500/10 via-blue-400 to-blue-500/10 shadow-[0_0_6px_rgba(96,165,250,0.6)] z-10" />

        {/* Button */}
        <button
          onClick={toggleChat}
          className="relative w-36 h-11 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-xl cursor-pointer glow-border group overflow-hidden"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(37, 99, 235, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.25)";
          }}
        >
          {/* Subtle shimmer effect on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          <svg className="w-3.5 h-3.5 text-blue-300 animate-pulse flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813zM18 10.5l-.5 3-.5-3-3-.5 3-.5.5-3.5.5 3 3 .5-3 .5z" />
          </svg>
          
          <span className="tracking-wider uppercase" style={{ fontFamily: "Outfit" }}>Ask Kip</span>
          
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
        </button>
      </div>
    </div>
  );
}
