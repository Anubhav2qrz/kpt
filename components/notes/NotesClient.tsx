"use client";

import { useState } from "react";
import { Download, FileText, BookOpen, HelpCircle } from "lucide-react";
import type { Note } from "@/lib/types";

const TABS = [
  { value: "pdf", label: "PDF Notes", icon: FileText },
  { value: "formula", label: "Formula Sheets", icon: BookOpen },
  { value: "question_bank", label: "Question Banks", icon: HelpCircle },
];

interface Props {
  initialNotes: Note[];
  initialCategory: string;
}

export function NotesClient({ initialNotes, initialCategory }: Props) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [loading, setLoading] = useState(false);

  async function handleTabChange(cat: string) {
    setActiveCategory(cat);
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?category=${cat}`);
      const data = await res.json();
      setNotes(data);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === tab.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "glass-card text-[#7a8dbe] hover:text-white hover:bg-blue-600/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-36 rounded-xl animate-pulse bg-blue-900/10" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-2xl">
          <FileText className="w-16 h-16 text-blue-600/30 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No notes available yet</p>
          <p className="text-[#7a8dbe] text-sm">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const CATEGORY_META: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
    pdf: { label: "PDF Notes", color: "text-blue-400 bg-blue-600/10 border-blue-600/20", icon: FileText },
    formula: { label: "Formula Sheet", color: "text-purple-400 bg-purple-600/10 border-purple-600/20", icon: BookOpen },
    question_bank: { label: "Question Bank", color: "text-orange-400 bg-orange-600/10 border-orange-600/20", icon: HelpCircle },
  };

  const meta = CATEGORY_META[note.category] ?? CATEGORY_META.pdf;
  const Icon = meta.icon;

  return (
    <div className="glass-card p-6 flex flex-col gap-4 group hover:border-blue-600/40 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${meta.color} mb-2 inline-block`}>
            {meta.label}
          </span>
          <h3 className="text-white font-semibold text-sm leading-snug">{note.title}</h3>
          <p className="text-[#7a8dbe] text-xs mt-1">
            {new Date(note.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
      <a
        href={note.file_url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="btn-glow w-full flex items-center justify-center gap-2 text-white font-semibold px-4 py-3 rounded-xl text-sm"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </a>
    </div>
  );
}
