import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../utils/siteAnalytics'

/** Page views + engagement to Supabase on production only (not localhost / npm run dev). */
export default function SiteAnalytics() {
  const { pathname } = useLocation()

  useEffect(() => {
    void trackPageView(pathname)
  }, [pathname])

  return null
}
