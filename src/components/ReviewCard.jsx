import { Link } from "react-router-dom";

// review card component
export default function ReviewCard({ review, to, onOpenReviews }) {
  // derive rating value
  const rating = review.overall ?? review.rating ?? "—";
  // rating color flags
  const up = typeof rating === "number" && rating >= 8;
  const down = typeof rating === "number" && rating <= 6;

  return (
    // card container
    <article className="flex items-center justify-between gap-4 rounded-xl bg-gray-100 px-4 py-4">
      {/* left content section */}
      <Link to={to} className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-95">
        <div className="h-12 w-20 rounded-xl bg-green-300 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {review.listingName || "—"}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {review.guestName ? `Guest: ${review.guestName}` : "—"}
            {review.submittedAt ? ` · ${new Date(review.submittedAt).toLocaleDateString()}` : ""}
          </p>
          {review.publicReview && (
            <p className="mt-1 text-sm text-gray-700 line-clamp-2">{review.publicReview}</p>
          )}
        </div>
      </Link>

      {/* rating and actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className={`font-semibold ${up ? "text-green-700" : down ? "text-red-600" : "text-gray-800"}`}>
            {typeof rating === "number" ? `${rating}/10` : rating}
          </div>
          <div className="text-xs text-gray-500">{review.type?.replace(/-/g, " ") || ""}</div>
        </div>
        {/* open reviews action */}
        <button
          onClick={() => onOpenReviews?.(review.listingName)}
          className="rounded-lg bg-teal-900 px-3 py-1.5 text-white text-sm hover:opacity-90"
        >
          Reviews
        </button>
      </div>
    </article>
  );
}
