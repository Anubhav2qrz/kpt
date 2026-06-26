export interface Video {
  id: string;
  title: string;
  youtube_url: string;
  youtube_id: string;
  category: "class9" | "class10" | "class11" | "class12" | "jee" | "neet";
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  category: "pdf" | "formula" | "question_bank";
  file_url: string;
  file_path: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "exam_update" | "new_video";
  created_at: string;
}

export const VIDEO_CATEGORIES = [
  { value: "class9", label: "Class 9 Physics" },
  { value: "class10", label: "Class 10 Physics" },
  { value: "class11", label: "Class 11 Physics" },
  { value: "class12", label: "Class 12 Physics" },
  { value: "jee", label: "JEE Physics" },
  { value: "neet", label: "NEET Physics" },
] as const;

export const NOTE_CATEGORIES = [
  { value: "pdf", label: "PDF Notes" },
  { value: "formula", label: "Formula Sheets" },
  { value: "question_bank", label: "Question Banks" },
] as const;

export const ANNOUNCEMENT_TYPES = [
  { value: "general", label: "General" },
  { value: "exam_update", label: "Exam Update" },
  { value: "new_video", label: "New Video" },
] as const;

export function extractYoutubeId(url: string): string {
  const patterns = [
    /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/,
    /([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
}
