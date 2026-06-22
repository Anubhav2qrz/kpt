import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractYoutubeId, VIDEO_CATEGORIES } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, Video } from "lucide-react";

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  async function addVideo(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const youtube_url = formData.get("youtube_url") as string;
    const category = formData.get("category") as string;
    if (!title || !youtube_url || !category) return;
    const youtube_id = extractYoutubeId(youtube_url);
    const supabase = await createClient();
    const { error } = await supabase.from("videos").insert({ title, youtube_url, youtube_id, category });
    
    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(`Failed to save video: ${error.message}`);
    }
    
    revalidatePath("/admin/videos");
  }

  async function deleteVideo(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await supabase.from("videos").delete().eq("id", id);
    revalidatePath("/admin/videos");
  }

  const CATEGORY_LABELS: Record<string, string> = {
    class11: "Class 11", class12: "Class 12", jee: "JEE", neet: "NEET",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Outfit" }}>Videos</h1>
        <p className="text-[#7a8dbe] mt-1">Add and manage YouTube video lectures</p>
      </div>

      {/* Add Form */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <PlusCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-bold">Add New Video</h2>
        </div>
        <form action={addVideo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#7a8dbe] text-sm">Video Title</Label>
            <Input name="title" id="title" placeholder="e.g. Newton's Laws of Motion" required
              className="bg-[#080f2a] border-blue-900/40 text-white placeholder:text-[#7a8dbe]/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube_url" className="text-[#7a8dbe] text-sm">YouTube URL</Label>
            <Input name="youtube_url" id="youtube_url" placeholder="https://youtube.com/watch?v=..." required
              className="bg-[#080f2a] border-blue-900/40 text-white placeholder:text-[#7a8dbe]/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#7a8dbe] text-sm">Category</Label>
            <select name="category" id="category" required
              className="w-full px-3 py-2 rounded-md bg-[#080f2a] border border-blue-900/40 text-white text-sm">
              {VIDEO_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <Button type="submit" className="btn-glow text-white font-semibold px-8 py-2 rounded-xl">
              Add Video
            </Button>
          </div>
        </form>
      </div>

      {/* Video list */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-blue-900/20 flex items-center gap-2">
          <Video className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-bold">All Videos ({videos?.length ?? 0})</h2>
        </div>
        {!videos?.length ? (
          <div className="p-10 text-center text-[#7a8dbe]">No videos yet. Add one above.</div>
        ) : (
          <div className="divide-y divide-blue-900/10">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center gap-4 p-4 hover:bg-blue-600/5 transition-colors">
                <img
                  src={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`}
                  alt={video.title}
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0 bg-[#080f2a]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{video.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/15 text-blue-400">
                      {CATEGORY_LABELS[video.category] ?? video.category}
                    </span>
                    <span className="text-[#7a8dbe] text-xs">
                      {new Date(video.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
                <form action={deleteVideo}>
                  <input type="hidden" name="id" value={video.id} />
                  <Button type="submit" variant="ghost" size="icon"
                    className="text-[#7a8dbe] hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
