// review item component
export default function ReviewItem({ review, showToggle, onToggle, hideType = false }) {
  // derive rating
  const rating = typeof review.overall === "number" ? review.overall : review.rating;
  // color flags
  const up = typeof rating === "number" && rating >= 8;
  const down = typeof rating === "number" && rating <= 6;
  // public flag
  const isPublic = !!review.approved;

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-gray-100 px-4 py-3">
      {/* left text column */}
      <div className="min-w-0">
        <h4 className="font-semibold text-slate-900 truncate">{review.listingName}</h4>
        <p className="text-sm text-gray-600">
          {review.guestName ? `Guest: ${review.guestName}` : "—"}
          {review.submittedAt ? ` · ${new Date(review.submittedAt).toLocaleDateString()}` : ""}
        </p>
        {review.publicReview && (
          <p className="mt-1 text-sm text-gray-700">{review.publicReview}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        {/* rating text */}
        <div className={`font-semibold ${rating >= 8 ? "text-green-700" : rating <= 6 ? "text-red-600" : "text-gray-800"}`}>
          {typeof rating === "number" ? `${rating}/10` : "—"}
        </div>
        {/* type label */}
        {!hideType && (
          <div className="text-xs text-gray-500">{(review.type || "").replace(/-/g, " ")}</div>
        )}
        {/* visibility toggle */}
        {showToggle && (
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs ${review.approved ? "text-emerald-700" : "text-gray-500"}`}>
              {review.approved ? "Public" : "Private"}
            </span>
            <button
              onClick={() => onToggle?.(!review.approved)}
              className={`h-6 w-10 rounded-full transition-colors ${review.approved ? "bg-emerald-500" : "bg-gray-300"}`}
              aria-label="Toggle visibility"
            >
              <span className={`block h-5 w-5 rounded-full bg-white mt-0.5 transition-transform ${review.approved ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// icons
function TriangleUp(props){ return (<svg viewBox="0 0 24 24" {...props}><path d="M12 5l9 14H3z"/></svg>); }
function TriangleDown(props){ return (<svg viewBox="0 0 24 24" {...props}><path d="M12 19L3 5h18z"/></svg>); }
function Minus(props){ return (<svg viewBox="0 0 24 24" {...props}><path d="M4 11h16v2H4z"/></svg>); }
