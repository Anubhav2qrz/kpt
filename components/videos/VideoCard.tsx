import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Video } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  class11: "Class 11",
  class12: "Class 12",
  jee: "JEE",
  neet: "NEET",
};

const CATEGORY_COLORS: Record<string, string> = {
  class11: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  class12: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30",
  jee: "bg-orange-600/20 text-orange-400 border-orange-600/30",
  neet: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
};

interface Props {
  video: Video;
  onPlay: () => void;
}

export function VideoCard({ video, onPlay }: Props) {
  const thumbnail = `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;

  return (
    <div
      className="video-card glass-card overflow-hidden cursor-pointer group"
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPlay()}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#080f2a]">
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Play button */}
        <div className="play-overlay absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${CATEGORY_COLORS[video.category] ?? "bg-blue-600/20 text-blue-400 border-blue-600/30"}`}>
            {CATEGORY_LABELS[video.category] ?? video.category}
          </span>
        </div>
      </div>
      {/* Title */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-[#7a8dbe] text-xs mt-2">
          {new Date(video.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
