import { createClient } from "@/lib/supabase/server";
import { VideoLibraryClient } from "@/components/videos/VideoLibraryClient";
import type { Metadata } from "next";
import type { Video } from "@/lib/types";

export const metadata: Metadata = {
  title: "Video Library — Kishore Plus Tutorial",
  description: "Watch free physics lectures for Class 11, Class 12, JEE and NEET by Kishore Sir.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideosPage({ searchParams }: Props) {
  const { category = "class11" } = await searchParams;
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            📹 Video Library
          </div>
          <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}>
            Physics <span className="gradient-text-blue">Video Lectures</span>
          </h1>
          <p className="text-[#7a8dbe] max-w-2xl">
            Browse our complete library of physics video lectures. Select your class or exam category to find the right content.
          </p>
        </div>

        <VideoLibraryClient
          initialVideos={(videos as Video[]) ?? []}
          initialCategory={category}
        />
      </div>
    </div>
  );
}
