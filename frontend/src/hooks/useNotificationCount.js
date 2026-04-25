import { useState, useEffect, useCallback } from 'react'
import { getUnreadCount } from '../api/notificationApi'
import { isLoggedIn } from '../api/authApi'

export const useNotificationCount = () => {
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    if (!isLoggedIn()) return
    try {
      const res = await getUnreadCount()

      // FIX: backend may return either a plain number  →  res.data = 5
      //      or a wrapped object                       →  res.data = { count: 5 }
      // Handle both safely so the badge never stays at 0.
      const raw = res.data
      if (typeof raw === 'number') {
        setCount(raw)
      } else if (raw && typeof raw.count === 'number') {
        setCount(raw.count)
      } else {
        setCount(0)
      }
    } catch { /* silent — don't crash the sidebar */ }
  }, [])

  useEffect(() => {
    fetchCount()
    const id = setInterval(fetchCount, 30000)
    return () => clearInterval(id)
  }, [fetchCount])

  return { count, refresh: fetchCount }
}