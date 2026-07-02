import { createClient } from "@/lib/supabase/server";
import { NotesClient } from "@/components/notes/NotesClient";
import type { Metadata } from "next";
import type { Note } from "@/lib/types";

export const metadata: Metadata = {
  title: "Notes & Resources — Kishore Plus Tutorial",
  description: "Download free physics notes, formula sheets, and question banks for Class 11, 12, JEE & NEET.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function NotesPage({ searchParams }: Props) {
  const { category = "pdf" } = await searchParams;
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            📄 Study Material
          </div>
          <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}>
            Notes & <span className="gradient-text-blue">Resources</span>
          </h1>
          <p className="text-[#7a8dbe] max-w-2xl">
            Download curated PDF notes, formula sheets, and question banks prepared by Kishore Sir for exam success.
          </p>
        </div>
        <NotesClient initialNotes={(notes as Note[]) ?? []} initialCategory={category} />
      </div>
    </div>
  );
}
