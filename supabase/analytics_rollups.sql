-- Daily / monthly / yearly rollups — run after analytics.sql
-- Times are grouped in Asia/Kolkata (school local time).

create or replace view public.analytics_daily
with (security_invoker = true)
as
select
  (created_at at time zone 'Asia/Kolkata')::date as period_start,
  count(*) filter (where event = 'page_view')::bigint as page_views,
  count(distinct visitor_id) filter (where event = 'page_view')::bigint as unique_visitors,
  count(distinct session_id) filter (where event = 'page_view')::bigint as sessions,
  coalesce(sum(engaged_seconds) filter (where event = 'engagement'), 0)::bigint as engaged_seconds
from public.site_analytics_events
group by 1;

create or replace view public.analytics_monthly
with (security_invoker = true)
as
select
  (date_trunc('month', created_at at time zone 'Asia/Kolkata'))::date as period_start,
  count(*) filter (where event = 'page_view')::bigint as page_views,
  count(distinct visitor_id) filter (where event = 'page_view')::bigint as unique_visitors,
  count(distinct session_id) filter (where event = 'page_view')::bigint as sessions,
  coalesce(sum(engaged_seconds) filter (where event = 'engagement'), 0)::bigint as engaged_seconds
from public.site_analytics_events
group by 1;

create or replace view public.analytics_yearly
with (security_invoker = true)
as
select
  (date_trunc('year', created_at at time zone 'Asia/Kolkata'))::date as period_start,
  count(*) filter (where event = 'page_view')::bigint as page_views,
  count(distinct visitor_id) filter (where event = 'page_view')::bigint as unique_visitors,
  count(distinct session_id) filter (where event = 'page_view')::bigint as sessions,
  coalesce(sum(engaged_seconds) filter (where event = 'engagement'), 0)::bigint as engaged_seconds
from public.site_analytics_events
group by 1;

grant select on public.analytics_daily to authenticated;
grant select on public.analytics_monthly to authenticated;
grant select on public.analytics_yearly to authenticated;
