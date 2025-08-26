import { useEffect, useState } from "react";
import CardShell from "./CardShell";
import ReviewItem from "./ReviewItem";
import { fetchReviews } from "../api/reviews";
import { computeOverallRating } from "../utils/ratings";

// public reviews section
export default function ReviewsSection({ propertyId }) {
  const [state, setState] = useState({ loading: true, error: null, items: [] }); // local state

  useEffect(() => {
    let alive = true; // cleanup flag
    (async () => {
      try {
        const res = await fetchReviews(); // fetch all reviews
        const rows = (res?.result ?? [])
          .filter(r => r.propertyId === propertyId) // match property
          .map(r => ({ ...r, overall: r.overall ?? r.rating ?? computeOverallRating(r) })) // normalize rating
          .filter(r => r.approved === true); // only public
        if (alive) setState({ loading: false, error: null, items: rows }); // set results
      } catch (e) {
        if (alive) setState({ loading: false, error: e?.message ?? "Failed to fetch", items: [] }); // set error
      }
    })();
    return () => (alive = false); // cleanup
  }, [propertyId]);

  const { loading, error, items } = state; // destructure state

  return (
    <CardShell title={`Reviews · ${items.length}`}>
      {loading && (
        // loading skeletons
        <ul className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="h-20 rounded-xl bg-gray-100/80 animate-pulse" />
          ))}
        </ul>
      )}

      {!loading && error && (
        // error message
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        // empty state
        <p className="text-sm text-gray-600">No public reviews yet.</p>
      )}

      {/* reviews list */}
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id}>
            <ReviewItem review={r} />
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
