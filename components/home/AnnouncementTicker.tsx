import type { Announcement } from "@/lib/types";
import { Megaphone } from "lucide-react";

interface Props {
  announcements: Announcement[];
}

const TYPE_COLORS: Record<string, string> = {
  exam_update: "text-orange-400",
  new_video: "text-green-400",
  general: "text-blue-400",
};

export function AnnouncementTicker({ announcements }: Props) {
  if (!announcements.length) return null;

  const tickerText = announcements
    .map((a) => `📢 ${a.title}`)
    .join("   ·   ");

  return (
    <div className="bg-[#0e1a42] border-y border-blue-900/30 py-3 overflow-hidden">
      <div className="flex items-center gap-4 max-w-7xl mx-auto px-4">
        <div className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          <Megaphone className="w-3 h-3" />
          LIVE
        </div>
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0e1a42] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0e1a42] to-transparent z-10 pointer-events-none" />
          <div className="ticker-content text-sm text-[#7a8dbe]">
            {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
          </div>
        </div>
      </div>
    </div>
  );
}
