"use client";

import React from "react";
import { useChatContext } from "./ChatContext";

export function FloatingChatButton() {
  const { isOpen, toggleChat } = useChatContext();

  // If the chat modal is already open, hide the floating button to avoid overlap/clutter
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-center select-none">
      {/* Walking Character Container */}
      <div className="relative w-36 h-10 pointer-events-none mb-[-5px]">
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

      {/* Button */}
      <button
        onClick={toggleChat}
        className="w-36 h-11 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 border border-blue-500/30 transition-all duration-300 shadow-lg cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.92), rgba(29, 78, 216, 0.92))",
          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(37, 99, 235, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.35)";
        }}
      >
        <span>Ask AI Tutor</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
        </span>
      </button>
    </div>
  );
}
