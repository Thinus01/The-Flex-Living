import { useEffect, useState } from "react";
import Modal from "./Modal";
import ReviewItem from "./ReviewItem";
import { fetchReviews, setApproval } from "../api/reviews";
import { computeOverallRating } from "../utils/ratings";
import { toSlug } from "../utils/slug";

// reviews modal component
export default function ReviewsModal({ propertyId, listingName, onClose, onAfterChange }) {
  const [state, setState] = useState({ loading: true, error: null, items: [] }); // local state

  useEffect(() => {
    let alive = true; // cleanup flag
    (async () => {
      try {
        const res = await fetchReviews(); // fetch reviews
        const rows = (res?.result ?? [])
          .filter(r =>
            propertyId
              ? r.propertyId === propertyId
              : toSlug(r?.listingName || "") === toSlug(listingName || "")
          ) // match property or slug
          .map(r => ({ ...r, overall: r.overall ?? r.rating ?? computeOverallRating(r) })); // compute overall rating

        if (alive) setState({ loading: false, error: null, items: rows }); // set results
        console.debug("[ReviewsModal] initial items:", rows.length);
      } catch (e) {
        if (alive) setState({ loading: false, error: e?.message ?? "Failed to fetch", items: [] }); // set error
        console.error("[ReviewsModal] load error:", e);
      }
    })();
    return () => { alive = false }; // cleanup
  }, [propertyId, listingName]);

  // toggle visibility
  async function handleToggle(review, approved) {
    setState(s => ({
      ...s,
      items: s.items.map(i => i.id === review.id ? { ...i, approved } : i),
    })); // optimistic update

    try {
      const resp = await setApproval({
        source: review.channel || "hostaway",
        id: review.id,
        approved,
      }); // persist change
      console.debug("[ReviewsModal] toggled", { id: review.id, approved, resp });

      if (onAfterChange) {
        await onAfterChange(); // refresh parent dashboard
        console.debug("[ReviewsModal] dashboard refresh complete");
      }
    } catch (e) {
      console.error("[ReviewsModal] toggle failed:", e);
      setState(s => ({
        ...s,
        items: s.items.map(i => i.id === review.id ? { ...i, approved: !approved } : i),
      })); // revert on failure
      alert(`Failed to update visibility: ${e.message}`); // error alert
    }
  }

  const { loading, error, items } = state; // destructure state

  return (
    <Modal title={`Reviews · ${listingName}`} onClose={onClose} maxWidth="max-w-3xl">
      {loading && (
        // skeleton list
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <p className="text-sm text-gray-600">No reviews for this property yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        // render results list
        <ul className="space-y-3">
          {items.map(r => (
            <li key={r.id}>
              <ReviewItem
                review={r}
                showToggle
                hideType
                onToggle={(val) => handleToggle(r, val)}
              />
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
