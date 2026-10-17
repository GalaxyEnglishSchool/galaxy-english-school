import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../utils/siteAnalytics'

/** Sends page views + engagement to Supabase when VITE_SUPABASE_* is set. */
export default function SiteAnalytics() {
  const { pathname } = useLocation()

  useEffect(() => {
    void trackPageView(pathname)
  }, [pathname])

  return null
}
