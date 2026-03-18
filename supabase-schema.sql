-- Run this in your Supabase project: Dashboard > SQL Editor > New Query

create table if not exists applications (
  id           uuid default gen_random_uuid() primary key,
  company      text not null,
  role         text not null,
  status       text not null default 'Applied'
                 check (status in ('Applied', 'Interview', 'Offer', 'Rejected')),
  applied_date date not null,
  url          text,
  notes        text,
  created_at   timestamptz default now()
);

-- Optional: enable Row Level Security (recommended when you add auth later)
-- alter table applications enable row level security;
