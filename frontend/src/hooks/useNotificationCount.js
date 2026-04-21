import { useState, useEffect, useCallback } from 'react';
import { getUnreadCount } from '../api/notificationApi';
import { isLoggedIn } from '../api/authApi';

export const useNotificationCount = () => {
    const [count, setCount] = useState(0);

    const fetchCount = useCallback(async () => {
        if (!isLoggedIn()) return;
        try {
            const res = await getUnreadCount();
            setCount(res.data.count || 0);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [fetchCount]);

    return { count, refresh: fetchCount };
};