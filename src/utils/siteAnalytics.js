import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient'

const VISITOR_KEY = 'ges_analytics_visitor'
const VISITOR_SEEN_KEY = 'ges_analytics_seen'
const SESSION_KEY = 'ges_analytics_session'

/** Paths not sent to analytics (office tools stay private). */
const EXCLUDED_PREFIXES = ['/office']

const HEARTBEAT_MS = 15_000
/** Send engagement to Supabase after this many active seconds (also flushed on tab close). */
const ENGAGEMENT_FLUSH_SECONDS = 8
/** Ignore duplicate page_view for same path within this window (React Strict Mode / double mount). */
const PAGE_VIEW_DEDUPE_MS = 8_000
const PAGE_VIEW_DEDUPE_KEY = 'ges_analytics_last_pv'

let currentPath = ''
let pageActiveSince = 0
let accumulatedSeconds = 0
let heartbeatTimer = null
let listenersBound = false

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    const seenBefore = localStorage.getItem(VISITOR_SEEN_KEY) === '1'
    if (!id) {
      id = randomId()
      localStorage.setItem(VISITOR_KEY, id)
    } else if (!seenBefore) {
      localStorage.setItem(VISITOR_SEEN_KEY, '1')
    }
    return { visitorId: id, isReturnVisit: seenBefore }
  } catch {
    return { visitorId: randomId(), isReturnVisit: false }
  }
}

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = randomId()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

function shouldTrackPath(path) {
  return !EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

/** @param {{ finalize?: boolean }} opts — finalize counts time when tab is hidden / closing */
function tickEngagement({ finalize = false } = {}) {
  if (pageActiveSince <= 0) return
  if (!finalize && document.hidden) return
  accumulatedSeconds += Math.floor((Date.now() - pageActiveSince) / 1000)
  pageActiveSince = finalize ? 0 : Date.now()
}

async function insertEvent(row) {
  const supabase = getSupabase()
  if (!supabase) return
  const { error } = await supabase.from('site_analytics_events').insert(row)
  if (error && import.meta.env.DEV) {
    console.warn('[analytics]', error.message)
  }
}

/** Survives tab close (normal fetch is often cancelled on unload). */
function insertEventKeepalive(row) {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !key) return
  try {
    fetch(`${baseUrl.replace(/\/$/, '')}/rest/v1/site_analytics_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* ignore */
  }
}

function buildEngagementRow(path, seconds) {
  const { visitorId, isReturnVisit } = getVisitorId()
  return {
    visitor_id: visitorId,
    session_id: getSessionId(),
    event: 'engagement',
    path,
    engaged_seconds: Math.min(seconds, 7200),
    referrer: document.referrer || null,
    is_return_visit: isReturnVisit,
  }
}

async function flushEngagement(path, { finalizeTick = false, useKeepalive = false } = {}) {
  if (!path || !shouldTrackPath(path)) return
  if (finalizeTick) tickEngagement({ finalize: true })
  else tickEngagement()

  const seconds = accumulatedSeconds
  accumulatedSeconds = 0
  if (seconds < 1) return

  const row = buildEngagementRow(path, seconds)
  if (useKeepalive) insertEventKeepalive(row)
  else await insertEvent(row)
}

function onVisibilityChange() {
  if (document.hidden) {
    void flushEngagement(currentPath, { finalizeTick: true, useKeepalive: true })
  } else if (currentPath) {
    pageActiveSince = Date.now()
  }
}

function onPageHide() {
  void flushEngagement(currentPath, { finalizeTick: true, useKeepalive: true })
}

function bindLifecycle() {
  if (listenersBound || typeof document === 'undefined') return
  listenersBound = true
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pagehide', onPageHide)
}

function startHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  heartbeatTimer = window.setInterval(() => {
    if (!document.hidden && currentPath) {
      tickEngagement()
      if (accumulatedSeconds >= ENGAGEMENT_FLUSH_SECONDS) void flushEngagement(currentPath)
    }
  }, HEARTBEAT_MS)
}

export function isSiteAnalyticsEnabled() {
  return isSupabaseConfigured()
}

function isDuplicatePageView(path) {
  try {
    const raw = sessionStorage.getItem(PAGE_VIEW_DEDUPE_KEY)
    if (!raw) return false
    const { path: lastPath, at } = JSON.parse(raw)
    return lastPath === path && Date.now() - at < PAGE_VIEW_DEDUPE_MS
  } catch {
    return false
  }
}

function rememberPageView(path) {
  try {
    sessionStorage.setItem(PAGE_VIEW_DEDUPE_KEY, JSON.stringify({ path, at: Date.now() }))
  } catch {
    /* ignore */
  }
}

/**
 * Call on each SPA navigation. Sends page_view and rolls engagement for the previous page.
 */
export async function trackPageView(path) {
  if (!isSupabaseConfigured() || !shouldTrackPath(path)) return

  bindLifecycle()

  const duplicateView = isDuplicatePageView(path)

  if (currentPath && currentPath !== path) {
    await flushEngagement(currentPath)
  }

  currentPath = path
  pageActiveSince = Date.now()
  accumulatedSeconds = 0
  startHeartbeat()

  const { visitorId, isReturnVisit } = getVisitorId()
  if (!isReturnVisit) {
    try {
      localStorage.setItem(VISITOR_SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!duplicateView) {
    rememberPageView(path)
    await insertEvent({
      visitor_id: visitorId,
      session_id: getSessionId(),
      event: 'page_view',
      path,
      engaged_seconds: 0,
      referrer: document.referrer || null,
      is_return_visit: isReturnVisit,
    })
  }
}
