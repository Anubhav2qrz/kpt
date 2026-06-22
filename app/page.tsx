import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/home/Hero";
import { AnnouncementTicker } from "@/components/home/AnnouncementTicker";
import { LatestVideos } from "@/components/home/LatestVideos";
import { CategoryCards } from "@/components/home/CategoryCards";
import { StatsBar } from "@/components/home/StatsBar";
import type { Video, Announcement } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: videos }, { data: announcements }] = await Promise.all([
    supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <div className="physics-bg">
      <Hero />
      <AnnouncementTicker announcements={(announcements as Announcement[]) ?? []} />
      <StatsBar />
      <LatestVideos videos={(videos as Video[]) ?? []} />
      <CategoryCards />
    </div>
  );
}
