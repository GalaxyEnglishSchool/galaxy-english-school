-- Galaxy English School — run once in Supabase SQL Editor
-- Dashboard → SQL → New query → paste → Run

-- Admission test results (office tool)
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  student_name text not null,
  parent_name text,
  parent_phone text,
  grade_id text not null,
  grade_label text,
  application_id text,
  score_percent int,
  earned_marks int,
  total_marks int,
  scholarship_label text,
  scholarship_percent int,
  first_year_total numeric,
  sibling_discount boolean default false,
  condition_label text
);

create index if not exists admissions_created_at_idx on public.admissions (created_at desc);
create index if not exists admissions_parent_phone_idx on public.admissions (parent_phone);

-- Teachers (for future office screens)
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text,
  email text,
  subjects text,
  classes text,
  notes text,
  active boolean not null default true
);

alter table public.admissions enable row level security;
alter table public.teachers enable row level security;

-- Only signed-in staff (Supabase Auth) can read/write
drop policy if exists "staff select admissions" on public.admissions;
drop policy if exists "staff insert admissions" on public.admissions;
create policy "staff select admissions"
  on public.admissions for select
  to authenticated
  using (true);

create policy "staff insert admissions"
  on public.admissions for insert
  to authenticated
  with check (true);

drop policy if exists "staff select teachers" on public.teachers;
drop policy if exists "staff insert teachers" on public.teachers;
drop policy if exists "staff update teachers" on public.teachers;
create policy "staff select teachers"
  on public.teachers for select
  to authenticated
  using (true);

create policy "staff insert teachers"
  on public.teachers for insert
  to authenticated
  with check (true);

create policy "staff update teachers"
  on public.teachers for update
  to authenticated
  using (true)
  with check (true);
