import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ANNOUNCEMENT_TYPES } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, Megaphone } from "lucide-react";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  async function addAnnouncement(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string;
    if (!title || !content) return;
    const supabase = await createClient();
    await supabase.from("announcements").insert({ title, content, type });
    revalidatePath("/admin/announcements");
  }

  async function deleteAnnouncement(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await supabase.from("announcements").delete().eq("id", id);
    revalidatePath("/admin/announcements");
  }

  const TYPE_COLORS: Record<string, string> = {
    general: "bg-blue-600/15 text-blue-400",
    exam_update: "bg-orange-600/15 text-orange-400",
    new_video: "bg-green-600/15 text-green-400",
  };
  const TYPE_LABELS: Record<string, string> = {
    general: "General", exam_update: "Exam Update", new_video: "New Video",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Outfit" }}>Announcements</h1>
        <p className="text-[#7a8dbe] mt-1">Post exam updates, new video notifications & general news</p>
      </div>

      {/* Add Form */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <PlusCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-bold">Post New Announcement</h2>
        </div>
        <form action={addAnnouncement} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#7a8dbe] text-sm">Title</Label>
              <Input name="title" id="title" placeholder="e.g. JEE Mains 2025 — Batch Starting!" required
                className="bg-[#080f2a] border-blue-900/40 text-white placeholder:text-[#7a8dbe]/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[#7a8dbe] text-sm">Type</Label>
              <select name="type" id="type"
                className="w-full px-3 py-2 rounded-md bg-[#080f2a] border border-blue-900/40 text-white text-sm">
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-[#7a8dbe] text-sm">Content</Label>
            <Textarea name="content" id="content" placeholder="Write your announcement here..." required rows={3}
              className="bg-[#080f2a] border-blue-900/40 text-white placeholder:text-[#7a8dbe]/50 resize-none" />
          </div>
          <Button type="submit" className="btn-glow text-white font-semibold px-8 py-2 rounded-xl">
            Post Announcement
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-blue-900/20 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-orange-400" />
          <h2 className="text-white font-bold">All Announcements ({announcements?.length ?? 0})</h2>
        </div>
        {!announcements?.length ? (
          <div className="p-10 text-center text-[#7a8dbe]">No announcements yet. Post one above.</div>
        ) : (
          <div className="divide-y divide-blue-900/10">
            {announcements.map((ann) => (
              <div key={ann.id} className="flex items-start gap-4 p-4 hover:bg-blue-600/5 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-600/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Megaphone className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-medium">{ann.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[ann.type] ?? TYPE_COLORS.general}`}>
                      {TYPE_LABELS[ann.type] ?? ann.type}
                    </span>
                  </div>
                  <p className="text-[#7a8dbe] text-xs leading-relaxed line-clamp-2">{ann.content}</p>
                  <p className="text-[#7a8dbe] text-xs mt-1">{new Date(ann.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={ann.id} />
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
