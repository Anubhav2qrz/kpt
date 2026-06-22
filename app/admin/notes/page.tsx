import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NOTE_CATEGORIES } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, FileText, Upload } from "lucide-react";

export default async function AdminNotesPage() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  async function addNote(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;
    if (!title || !category || !file || file.size === 0) return;

    const supabase = await createClient();
    const filePath = `notes/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("kpt-files")
      .upload(filePath, file, { contentType: "application/pdf" });
    if (uploadError) return;

    const { data: { publicUrl } } = supabase.storage
      .from("kpt-files")
      .getPublicUrl(filePath);

    await supabase.from("notes").insert({ title, category, file_url: publicUrl, file_path: filePath });
    revalidatePath("/admin/notes");
  }

  async function deleteNote(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const filePath = formData.get("file_path") as string;
    const supabase = await createClient();
    if (filePath) await supabase.storage.from("kpt-files").remove([filePath]);
    await supabase.from("notes").delete().eq("id", id);
    revalidatePath("/admin/notes");
  }

  const CATEGORY_LABELS: Record<string, string> = {
    pdf: "PDF Notes", formula: "Formula Sheet", question_bank: "Question Bank",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Outfit" }}>Notes</h1>
        <p className="text-[#7a8dbe] mt-1">Upload and manage PDF study materials</p>
      </div>

      {/* Add Form */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <PlusCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-bold">Upload New Note</h2>
        </div>
        <form action={addNote} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#7a8dbe] text-sm">Note Title</Label>
            <Input name="title" id="title" placeholder="e.g. JEE Formula Sheet 2025" required
              className="bg-[#080f2a] border-blue-900/40 text-white placeholder:text-[#7a8dbe]/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#7a8dbe] text-sm">Category</Label>
            <select name="category" id="category" required
              className="w-full px-3 py-2 rounded-md bg-[#080f2a] border border-blue-900/40 text-white text-sm">
              {NOTE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-[#7a8dbe] text-sm">PDF File</Label>
            <Input name="file" id="file" type="file" accept=".pdf" required
              className="bg-[#080f2a] border-blue-900/40 text-white file:text-blue-400 file:bg-transparent" />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" className="btn-glow text-white font-semibold px-8 py-2 rounded-xl flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
          </div>
        </form>
      </div>

      {/* Notes list */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-blue-900/20 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-bold">All Notes ({notes?.length ?? 0})</h2>
        </div>
        {!notes?.length ? (
          <div className="p-10 text-center text-[#7a8dbe]">No notes yet. Upload one above.</div>
        ) : (
          <div className="divide-y divide-blue-900/10">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center gap-4 p-4 hover:bg-blue-600/5 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-600/15 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{note.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/15 text-indigo-400">
                      {CATEGORY_LABELS[note.category] ?? note.category}
                    </span>
                    <span className="text-[#7a8dbe] text-xs">
                      {new Date(note.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
                <a href={note.file_url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:text-white transition-colors px-3 py-1 rounded-lg bg-blue-600/10">
                  View
                </a>
                <form action={deleteNote}>
                  <input type="hidden" name="id" value={note.id} />
                  <input type="hidden" name="file_path" value={note.file_path} />
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
