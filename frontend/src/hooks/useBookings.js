import { useState, useEffect, useCallback } from "react";
import { bookingApi } from "../api/bookingApi";

export function useBookings(mode = "my") {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res =
        mode === "admin"
          ? await bookingApi.getAllBookings()
          : await bookingApi.getMyBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { bookings, loading, error, refetch: fetch };
}
