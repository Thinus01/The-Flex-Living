import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import FiltersBar from "../components/FiltersBar";
import PropertyCard from "../components/PropertyCard";
import ReviewsModal from "../components/ReviewsModal";
import { useReviews } from "../hooks/useReviews";
import { fetchProperties } from "../api/properties";
import { computeOverallRating } from "../utils/ratings";
import SkeletonList from "../components/SkeletonList";

// Preset to date range
function rangeForPreset(preset) {
  const today = new Date();
  // Normalize to midnight
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfYear = new Date(end.getFullYear(), 0, 1);

  switch (preset) {
    case "last7":   return { start: new Date(end.getTime() - 6*24*3600*1000), end };
    case "last30":  return { start: new Date(end.getTime() - 29*24*3600*1000), end };
    case "thisYear":return { start: startOfYear, end };
    case "custom":  return { start: null, end: null };
    case "all":
    default:        return { start: null, end: null };
  }
}

// Locale date string
function fmt(d) {
  return d ? new Date(d).toLocaleDateString() : "";
}

export default function DashboardPage() {
  // Fetch reviews hook
  const { data: reviewsData, loading, error, refresh } = useReviews();
  // Properties API response
  const [propsData, setPropsData] = useState({ result: [] });
  // Selected property modal
  const [modalProp, setModalProp] = useState(null);

  // Load properties once
  useEffect(() => { fetchProperties().then(setPropsData).catch(console.error); }, []);

  // UI filter state.
  const [filters, setFilters] = useState({
    channel: "all",
    ratingBucket: "all",
    category: "all",
    datePreset: "all",
    startDate: "",    
    endDate: "",
    sort: "date_desc" 
  });

  // Normalize overall rating
  const reviews = (reviewsData?.result ?? []).map(r => ({
    ...r,
    overall: r.overall ?? r.rating ?? computeOverallRating(r),
  }));
  // List of properties
  const properties = propsData.result ?? [];

  // Resolve preset range
  const presetRange = rangeForPreset(filters.datePreset);
  // Custom start override
  const effectiveStart = filters.datePreset === "custom"
    ? (filters.startDate ? new Date(filters.startDate) : null)
    : presetRange.start;
  // Custom end override
  const effectiveEnd = filters.datePreset === "custom"
    ? (filters.endDate ? new Date(filters.endDate) : null)
    : presetRange.end;

  // Human label string
  const dateRangeLabel = (() => {
    if (!effectiveStart && !effectiveEnd) return "All time";
    if (effectiveStart && effectiveEnd) return `${fmt(effectiveStart)} – ${fmt(effectiveEnd)}`;
    if (effectiveStart) return `From ${fmt(effectiveStart)}`;
    return `Until ${fmt(effectiveEnd)}`;
  })();

  // Apply filters here
  const filteredReviews = useFilteredReviews(reviews, { ...filters, effectiveStart, effectiveEnd });

  // Any filters enabled???
  const hasActiveFilters = useMemo(() => {
    const f = filters;
    const dateActive =
      f.datePreset !== "all" ||
      (f.datePreset === "custom" && (f.startDate || f.endDate));

    return (
      f.ratingBucket !== "all" ||
      f.category !== "all" ||
      f.channel !== "all" ||
      dateActive
    );
  }, [filters]);

  // Aggregate by property
  const perProperty = useMemo(() => {
    // Stats map
    const map = new Map();
    for (const r of filteredReviews) {
      // Skip missing propertyId
      if (!r.propertyId) continue;
      // Init or get stats
      const m = map.get(r.propertyId) || { total: 0, publicCount: 0, sum: 0, countRated: 0, last: null };
      // Count totals
      m.total += 1;
      // Count approved public
      if (r.approved) m.publicCount += 1;
      // Accumulate numeric rating
      if (typeof r.overall === "number") { m.sum += r.overall; m.countRated += 1; }
      // Track latest date
      const d = r.submittedAt ? new Date(r.submittedAt) : null;
      if (!m.last || (d && d > m.last)) m.last = d;
      map.set(r.propertyId, m);
    }
    return map;
  }, [filteredReviews]);

  // Derive rows list
  const rows = useMemo(() => {
    let list = properties.map((p) => {
      // Default stats fallback
      const st =
        perProperty.get(p.id) || {
          total: 0,
          publicCount: 0,
          sum: 0,
          countRated: 0,
          last: null,
        };
      // Compute average rating
      const avg = st.countRated
        ? Math.round((st.sum / st.countRated) * 10) / 10
        : null;
      return {
        property: p,
        stats: { total: st.total, publicCount: st.publicCount, avg, last: st.last },
      };
    });

    // Hide zero-review properties
    if (hasActiveFilters) {
      list = list.filter((row) => row.stats.total > 0);
    }

    // Sort by selected option
    return list.sort((a, b) => {
      const aD = a.stats.last ? a.stats.last.getTime() : 0;
      const bD = b.stats.last ? b.stats.last.getTime() : 0;
      const aR = a.stats.avg ?? -Infinity;
      const bR = b.stats.avg ?? -Infinity;
      switch (filters.sort) {
        case "date_desc":   return bD - aD;
        case "date_asc":    return aD - bD;
        case "rating_desc": return bR - aR;
        case "rating_asc":  return aR - bR;
        default:            return 0;
      }
    });
  }, [properties, perProperty, filters.sort, hasActiveFilters]);

  // Reset filters
  const handleClear = () => setFilters({
    channel: "all",
    ratingBucket: "all",
    category: "all",
    datePreset: "all",
    startDate: "",
    endDate: "",
    sort: "date_desc",
  });

  return (
    // Page shell
    <div className="min-h-screen bg-[#f9f7f1]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-4">
        <FiltersBar
          value={filters}
          onChange={(p) => setFilters(f => ({ ...f, ...p }))}
          onClear={handleClear}
          helperLabel={dateRangeLabel}
        />

        {/* Loading skeleton */}
        {loading && <SkeletonList />}
        {/* Error message box */}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        {!loading && !error && (
          <>
            {/* Render property cards */}
            <ul className="space-y-3">
              {rows.map(({ property, stats }) => (
                <li key={property.id}>
                  <PropertyCard
                    property={property}
                    stats={stats}
                    dateRangeLabel={dateRangeLabel}
                    onOpenReviews={() => setModalProp(property)}
                  />
                </li>
              ))}
            </ul>

            {/* Show count footer */}
            <div className="text-sm text-gray-600 mt-3">
              Showing <span className="font-medium text-slate-900">{rows.length}</span> properties
            </div>
          </>
        )}
      </main>

      {/* Review modal mount */}
      {modalProp && (
        <ReviewsModal
          propertyId={modalProp.id}
          listingName={modalProp.title}
          onClose={() => setModalProp(null)}
          onAfterChange={refresh}
        />
      )}
    </div>
  );
}

// Filter reviews here
function useFilteredReviews(reviews, filters) {
  const { effectiveStart, effectiveEnd } = filters;
  return useMemo(() => {
    const start = effectiveStart;
    // Inclusive end-of-day
    const end = effectiveEnd ? new Date(effectiveEnd.getTime() + 24*60*60*1000 - 1) : null;

    // Rating bucket helper
    const inBucket = (overall) => {
      if (overall == null) return filters.ratingBucket === "all";
      switch (filters.ratingBucket) {
        case "gte9": return overall >= 9;
        case "7to8_9": return overall >= 7 && overall < 9;
        case "lte6": return overall <= 6;
        default: return true;
      }
    };

    // Category match helper
    const hasCategory = (r, cat) =>
      cat === "all" || (r.reviewCategory || []).some(c => c.category === cat);

    return reviews.filter(r => {
      // Channel filter
      if (filters.channel !== "all" && (r.channel || "hostaway") !== filters.channel) return false;

      // Date window filter
      if (start || end) {
        const d = r.submittedAt ? new Date(r.submittedAt) : null;
        if (!d) return false;
        if (start && d < start) return false;
        if (end && d > end) return false;
      }

      // Rating bucket filter
      if (!inBucket(r.overall)) return false;
      // Category filter.
      if (!hasCategory(r, filters.category)) return false;

      return true;
    });
  }, [reviews, filters.channel, filters.ratingBucket, filters.category, effectiveStart?.getTime?.(), effectiveEnd?.getTime?.()]);
}
