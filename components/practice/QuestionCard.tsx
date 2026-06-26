"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Lightbulb } from "lucide-react";
import type { PracticeQuestion } from "@/lib/practice-questions";

interface Props {
  question: PracticeQuestion & { index: number };
}

export function QuestionCard({ question }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown to midnight
  useEffect(() => {
    function calcTime() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    }
    calcTime();
    const id = setInterval(calcTime, 1000);
    return () => clearInterval(id);
  }, []);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  const isCorrect = selected === question.answer;

  return (
    <div className="glass-card p-8 space-y-6">
      {/* Topic badge */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-blue-600/15 border border-blue-600/25 text-blue-400 text-xs font-semibold">
          {question.topic}
        </span>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--kpt-muted)" }}>
          <Clock className="w-3.5 h-3.5" />
          Next question in{" "}
          <span className="font-mono text-orange-400 font-bold">{timeLeft}</span>
        </div>
      </div>

      {/* Question */}
      <div>
        <h2 className="font-semibold text-xl leading-relaxed" style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}>
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          let style = "border-blue-600/20 hover:border-blue-600/40 hover:bg-blue-600/5";
          let textStyle: React.CSSProperties = { color: "var(--kpt-muted)" };
          let defaultLabelStyle = "bg-blue-600/10 text-blue-400";
          if (revealed) {
            if (idx === question.answer) {
              style = "border-green-500/50 bg-green-500/10 text-green-400";
              textStyle = {};
              defaultLabelStyle = "bg-green-500/20 text-green-400";
            } else if (idx === selected && idx !== question.answer) {
              style = "border-red-500/50 bg-red-500/10 text-red-400";
              textStyle = {};
              defaultLabelStyle = "bg-red-500/20 text-red-400";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${style} ${revealed ? "cursor-default" : "cursor-pointer"}`}
              style={!revealed || (idx !== question.answer && idx !== selected) ? textStyle : {}}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                revealed && idx === question.answer ? "bg-green-500/20 text-green-400" :
                revealed && idx === selected && idx !== question.answer ? "bg-red-500/20 text-red-400" :
                defaultLabelStyle
              }`}>
                {["A", "B", "C", "D"][idx]}
              </span>
              <span className="text-sm">{opt}</span>
              {revealed && idx === question.answer && (
                <CheckCircle className="w-5 h-5 text-green-400 ml-auto flex-shrink-0" />
              )}
              {revealed && idx === selected && idx !== question.answer && (
                <XCircle className="w-5 h-5 text-red-400 ml-auto flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result & Explanation */}
      {revealed && (
        <div className={`rounded-xl p-5 border ${isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-orange-500/10 border-orange-500/30"}`}>
          <div className="flex items-center gap-2 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">Excellent! Correct Answer!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-bold">Not quite — Keep practising!</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed" style={{ color: "var(--kpt-text)" }}>{question.explanation}</p>
          </div>
        </div>
      )}

      {!revealed && (
        <p className="text-center text-xs" style={{ color: "var(--kpt-muted)" }}>
          👆 Select an option to reveal the answer and explanation
        </p>
      )}
    </div>
  );
}
