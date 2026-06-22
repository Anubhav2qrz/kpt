import { createClient } from "@/lib/supabase/server";
import { Video, FileText, Megaphone, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: videoCount },
    { count: notesCount },
    { count: annCount },
    { data: recentVideos },
    { data: recentAnn },
  ] = await Promise.all([
    supabase.from("videos").select("*", { count: "exact", head: true }),
    supabase.from("notes").select("*", { count: "exact", head: true }),
    supabase.from("announcements").select("*", { count: "exact", head: true }),
    supabase.from("videos").select("id,title,category,created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("announcements").select("id,title,type,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Videos", value: videoCount ?? 0, icon: Video, color: "from-blue-600 to-blue-800", href: "/admin/videos" },
    { label: "Total Notes", value: notesCount ?? 0, icon: FileText, color: "from-indigo-600 to-indigo-800", href: "/admin/notes" },
    { label: "Announcements", value: annCount ?? 0, icon: Megaphone, color: "from-orange-600 to-orange-800", href: "/admin/announcements" },
    { label: "Active Content", value: (videoCount ?? 0) + (notesCount ?? 0), icon: TrendingUp, color: "from-emerald-600 to-emerald-800", href: "/admin" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Outfit" }}>Dashboard</h1>
        <p className="text-[#7a8dbe] mt-1">Welcome back, Kishore Sir 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="glass-card p-6 hover:border-blue-600/40 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "Outfit" }}>{stat.value}</div>
              <div className="text-[#7a8dbe] text-sm">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold">Recent Videos</h2>
            <Link href="/admin/videos" className="text-blue-400 text-xs hover:text-white">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentVideos?.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#080f2a]/50">
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{v.title}</p>
                  <p className="text-[#7a8dbe] text-xs">{v.category}</p>
                </div>
              </div>
            ))}
            {!recentVideos?.length && <p className="text-[#7a8dbe] text-sm text-center py-4">No videos yet</p>}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold">Recent Announcements</h2>
            <Link href="/admin/announcements" className="text-blue-400 text-xs hover:text-white">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentAnn?.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#080f2a]/50">
                <div className="w-8 h-8 rounded-lg bg-orange-600/15 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{a.title}</p>
                  <p className="text-[#7a8dbe] text-xs">{a.type}</p>
                </div>
              </div>
            ))}
            {!recentAnn?.length && <p className="text-[#7a8dbe] text-sm text-center py-4">No announcements yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
