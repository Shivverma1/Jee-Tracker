-- JEE Study Tracker — Supabase schema.
-- Run this in the Supabase SQL editor to create the required tables.
-- The app works without these (it falls back to an in-memory store), but use
-- them for persistent storage.

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  title text not null,
  channel text,
  thumbnail text,
  published_at text,
  description text,
  view_count text,
  subject text not null,
  topic text default '',
  watched boolean default false,
  rating int default 0,
  created_at timestamptz default now()
);

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  chapter text not null,
  status text not null default 'not_started',
  created_at timestamptz default now(),
  unique (subject, chapter)
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  chapter text default '',
  title text not null,
  content text default '',
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  minutes int not null,
  topic text default '',
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Helpful indexes
create index if not exists idx_videos_subject on videos (subject);
create index if not exists idx_notes_subject on notes (subject);
create index if not exists idx_sessions_date on sessions (date);
