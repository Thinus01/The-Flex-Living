import { Link } from "react-router-dom";

// property card component
export default function PropertyCard({ property, stats, onOpenReviews, dateRangeLabel }) {
  const img = property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop"; // fallback image url

  return (
    <article className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-4 ring-1 ring-black/5">
      {/* left link section */}
      <Link to={`/property/${property.slug}`} className="flex items-center gap-4 flex-1 min-w-0 group">
        <img
          src={img}
          alt={property.title}
          className="h-12 w-20 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate group-hover:opacity-90">
            {property.title}
          </h3>
          {dateRangeLabel && (
            <p className="text-xs text-gray-500 mt-0.5">{dateRangeLabel}</p>
          )}
        </div>
      </Link>

      {/* stats summary */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right">
          <div className="text-sm text-gray-500">Reviews</div>
          <div className="font-semibold text-slate-900">{stats.total}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Public</div>
          <div className="font-semibold text-emerald-700">{stats.publicCount}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Avg</div>
          <div className="font-semibold text-slate-900">
            {stats.avg != null ? `${stats.avg}/10` : "—"}
          </div>
        </div>

        {/* open reviews modal */}
        <button
          onClick={() => onOpenReviews?.(property)}
          className="rounded-lg bg-teal-900 px-3 py-1.5 text-white text-sm hover:opacity-90"
        >
          Reviews
        </button>
      </div>
    </article>
  );
}
