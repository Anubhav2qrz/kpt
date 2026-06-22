"use client";

import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import type { Video } from "@/lib/types";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoModal } from "@/components/videos/VideoModal";
import { useState } from "react";

interface Props {
  videos: Video[];
}

export function LatestVideos({ videos }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              📹 Latest Uploads
            </div>
            <h2 className="text-4xl font-black text-white" style={{ fontFamily: "Outfit" }}>
              Latest <span className="gradient-text-blue">Video Lectures</span>
            </h2>
          </div>
          <Link
            href="/videos"
            className="hidden sm:inline-flex items-center gap-2 text-blue-400 hover:text-white font-semibold text-sm transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <Play className="w-16 h-16 text-blue-600/30 mx-auto mb-4" />
            <p className="text-[#7a8dbe]">No videos yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 btn-glow text-white font-semibold px-6 py-3 rounded-xl text-sm"
          >
            View All Videos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </section>
  );
}
