"use client";

import { useState } from "react";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoModal } from "@/components/videos/VideoModal";
import type { Video } from "@/lib/types";
import { Play } from "lucide-react";

const TABS = [
  { value: "class9", label: "Class 9 Physics" },
  { value: "class10", label: "Class 10 Physics" },
  { value: "class11", label: "Class 11 Physics" },
  { value: "class12", label: "Class 12 Physics" },
  { value: "jee", label: "JEE Physics" },
  { value: "neet", label: "NEET Physics" },
];

interface Props {
  initialVideos: Video[];
  initialCategory: string;
}

export function VideoLibraryClient({ initialVideos, initialCategory }: Props) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  async function handleTabChange(cat: string) {
    setActiveCategory(cat);
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?category=${cat}`);
      const data = await res.json();
      setVideos(data);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeCategory === tab.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "glass-card text-[#7a8dbe] hover:text-white hover:bg-blue-600/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card aspect-video rounded-xl animate-pulse bg-blue-900/10" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-2xl">
          <Play className="w-16 h-16 text-blue-600/30 mx-auto mb-4" />
          <p className="font-semibold mb-2" style={{ color: "var(--kpt-text)" }}>No videos yet for this category</p>
          <p className="text-sm" style={{ color: "var(--kpt-muted)" }}>Check back soon — more lectures coming!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onPlay={() => setSelectedVideo(video)} />
          ))}
        </div>
      )}

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
