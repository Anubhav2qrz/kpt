# Kishore Plus Tutorial — Supabase Setup Guide

## 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) → New Project

## 2. Run This SQL in the Supabase SQL Editor

```sql
-- Table 1: videos
create table videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  youtube_id text not null,
  category text not null check (category in ('class11','class12','jee','neet')),
  created_at timestamptz default now()
);

-- Table 2: notes
create table notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('pdf','formula','question_bank')),
  file_url text not null,
  file_path text not null,
  created_at timestamptz default now()
);

-- Table 3: announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text default 'general' check (type in ('general','exam_update','new_video')),
  created_at timestamptz default now()
);

-- RLS Policies
alter table videos enable row level security;
alter table notes enable row level security;
alter table announcements enable row level security;

-- Public read
create policy "Public read videos" on videos for select using (true);
create policy "Public read notes" on notes for select using (true);
create policy "Public read announcements" on announcements for select using (true);

-- Authenticated write (admin)
create policy "Auth insert videos" on videos for insert with check (auth.role() = 'authenticated');
create policy "Auth delete videos" on videos for delete using (auth.role() = 'authenticated');
create policy "Auth insert notes" on notes for insert with check (auth.role() = 'authenticated');
create policy "Auth delete notes" on notes for delete using (auth.role() = 'authenticated');
create policy "Auth insert announcements" on announcements for insert with check (auth.role() = 'authenticated');
create policy "Auth delete announcements" on announcements for delete using (auth.role() = 'authenticated');
```

## 3. Create Storage Bucket
- Go to Storage → New Bucket → Name: `kpt-files` → Public: **YES**
- Add policy: Allow authenticated users to upload/delete

```sql
-- Storage policies (run in SQL editor)
create policy "Public read kpt-files"
on storage.objects for select using (bucket_id = 'kpt-files');

create policy "Auth upload kpt-files"
on storage.objects for insert
with check (bucket_id = 'kpt-files' and auth.role() = 'authenticated');

create policy "Auth delete kpt-files"
on storage.objects for delete
using (bucket_id = 'kpt-files' and auth.role() = 'authenticated');
```

## 4. Create Admin User
- Go to **Authentication → Users → Invite User**
- Enter your admin email. You'll receive a password setup email.

## 5. Add Environment Variables
Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these in: Supabase Dashboard → Project Settings → API

## 6. Netlify Deployment
1. Push to GitHub
2. Connect repo to Netlify
3. Add same env vars in Netlify → Site Settings → Environment Variables
4. Deploy!
