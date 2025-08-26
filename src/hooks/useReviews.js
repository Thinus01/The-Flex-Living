import { useEffect, useState } from "react";
import { fetchReviews } from "../api/reviews";

// fetch reviews hook
export function useReviews() {
  const [data, setData] = useState(null); // review data state
  const [loading, setLoading] = useState(true); // loading flag
  const [error, setError] = useState(null); // error message

  // reload reviews async
  const refresh = async () => {
    try {
      setLoading(true);
      const res = await fetchReviews();
      setData(res);
      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load reviews"); // store error message
    } finally {
      setLoading(false); // reset loading flag
    }
  };

  useEffect(() => { refresh(); }, []); // fetch on mount
  return { data, loading, error, refresh }; // expose hook state
}
