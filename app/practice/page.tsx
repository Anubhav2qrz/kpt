import { getDailyQuestion } from "@/lib/practice-questions";
import { QuestionCard } from "@/components/practice/QuestionCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Practice — Kishore Plus Tutorial",
  description: "Practice one new physics question every day. Sharpen your problem-solving skills for JEE & NEET.",
};

export const dynamic = "force-dynamic";

export default function PracticePage() {
  const question = getDailyQuestion();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            🎯 Daily Practice
          </div>
          <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}>
            Question of the <span className="text-orange-500">Day</span>
          </h1>
          <p className="text-[#7a8dbe]">
            One new physics question every day. Come back tomorrow for the next challenge!
          </p>
        </div>

        <QuestionCard question={question} />

        <div className="mt-8 glass-card p-6 text-center">
          <p className="text-[#7a8dbe] text-sm mb-2">
            📅 Questions rotate daily — bookmark this page to build a daily study habit!
          </p>
          <p className="text-blue-400 text-xs font-semibold">
            Question #{question.index + 1} of 30 — Topic: {question.topic}
          </p>
        </div>
      </div>
    </div>
  );
}
