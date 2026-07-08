"use client";

import React from "react";

interface AnimatedBotProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AnimatedBot({ className = "", size = "md" }: AnimatedBotProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Outer Glow Circle */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[4px] animate-pulse" />
      
      {/* Cute Floating Bot body */}
      <div className="relative w-full h-full flex items-center justify-center animate-bounce-slow">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_4px_rgba(96,165,250,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antennas / Ears with wiggle animation */}
          <g className="animate-wiggle origin-bottom" style={{ transformOrigin: "50px 80px" }}>
            <path
              d="M32 25 L25 15 M68 25 L75 15"
              stroke="url(#botGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="23" cy="12" r="5" fill="#f97316" className="animate-pulse" />
            <circle cx="77" cy="12" r="5" fill="#f97316" className="animate-pulse" />
          </g>

          {/* Head Body */}
          <rect
            x="15"
            y="25"
            width="70"
            height="55"
            rx="24"
            fill="url(#botGrad)"
            stroke="#2563eb"
            strokeWidth="3.5"
          />

          {/* Face Screen */}
          <rect
            x="24"
            y="35"
            width="52"
            height="32"
            rx="12"
            fill="#050a1e"
            stroke="#1d4ed8"
            strokeWidth="2"
          />

          {/* Digital Eyes (with Blinking animation) */}
          <ellipse
            cx="39"
            cy="51"
            rx="4.5"
            ry="6.5"
            fill="#60a5fa"
            className="animate-blink origin-center"
            style={{ transformOrigin: "39px 51px" }}
          />
          <ellipse
            cx="61"
            cy="51"
            rx="4.5"
            ry="6.5"
            fill="#60a5fa"
            className="animate-blink origin-center"
            style={{ transformOrigin: "61px 51px" }}
          />

          {/* Smile / Mouth */}
          <path
            d="M45 59 Q50 63 55 59"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Rosy Cheeks */}
          <circle cx="31" cy="56" r="2.5" fill="#f43f5e" opacity="0.6" />
          <circle cx="69" cy="56" r="2.5" fill="#f43f5e" opacity="0.6" />

          {/* Gradients definitions */}
          <defs>
            <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
