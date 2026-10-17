-- Website analytics (public site only) — run in Supabase SQL Editor after schema.sql
-- Anonymous visitors can INSERT events; only signed-in staff can READ (dashboard / SQL).

create table if not exists public.site_analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor_id uuid not null,
  session_id uuid not null,
  event text not null check (event in ('page_view', 'engagement')),
  path text not null,
  engaged_seconds int not null default 0 check (engaged_seconds >= 0 and engaged_seconds <= 7200),
  referrer text,
  is_return_visit boolean not null default false
);

create index if not exists site_analytics_events_created_at_idx
  on public.site_analytics_events (created_at desc);

create index if not exists site_analytics_events_path_idx
  on public.site_analytics_events (path, created_at desc);

create index if not exists site_analytics_events_visitor_idx
  on public.site_analytics_events (visitor_id, created_at desc);

alter table public.site_analytics_events enable row level security;

drop policy if exists "anon insert site analytics" on public.site_analytics_events;
create policy "anon insert site analytics"
  on public.site_analytics_events
  for insert
  to anon, authenticated
  with check (
    char_length(path) <= 256
    and (referrer is null or char_length(referrer) <= 512)
  );

drop policy if exists "staff read site analytics" on public.site_analytics_events;
create policy "staff read site analytics"
  on public.site_analytics_events
  for select
  to authenticated
  using (true);

-- Next: run analytics_rollups.sql for daily / monthly / yearly views (office Analytics tab).
