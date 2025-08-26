import UiSelect from "./UiSelect";
import DateRangeInline from "../components/DateRangeInline";

// filters toolbar component
export default function FiltersBar({ value, onChange, onClear, helperLabel }) {
  const v = value;

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"; // shared select styles

  // date preset pill
  const pill = (key, label) => (
    <button
      type="button"
      onClick={() => onChange({ datePreset: key, startDate: "", endDate: "" })}
      className={[
        "rounded-full px-3 py-1.5 text-sm ring-1 transition-colors",
        v.datePreset === key
          ? "bg-teal-900 text-white ring-teal-900"
          : "bg-white text-slate-800 ring-slate-300 hover:bg-slate-50"
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4 sm:p-5 space-y-3">
      {/* top row container */}
      <div className="flex flex-wrap items-start gap-3">
        {/* date controls */}
        <div className={`flex flex-col gap-2 ${v.datePreset === "custom" ? "w-full" : ""}`}>
          <label className="block text-xs font-medium text-slate-500">Date</label>
          <div className="flex flex-wrap items-center gap-2">
            {pill("all", "All time")}
            {pill("last7", "Last 7 days")}
            {pill("last30", "Last 30 days")}
            {pill("thisYear", "This year")}
            {pill("custom", "Custom")}

            {/* custom date picker */}
            {v.datePreset === "custom" && (
              <DateRangeInline
                start={v.startDate}
                end={v.endDate}
                onChange={(patch) => onChange({ datePreset: "custom", ...patch })}
                className="ml-1"
              />
            )}
          </div>
        </div>

        {/* right filter group */}
        <div
          className={[
            "flex flex-wrap items-end gap-3",
            v.datePreset === "custom" ? "mt-1" : "ml-auto"
          ].join(" ")}
        >
          {/* rating filter */}
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Rating</label>
            <UiSelect
              value={v.ratingBucket}
              onChange={(val) => onChange({ ratingBucket: val })}
              options={[
                { value: "all", label: "All ratings" },
                { value: "gte9", label: "9–10" },
                { value: "7to8_9", label: "7–8.9" },
                { value: "lte6", label: "≤ 6" },
              ]}
            />
          </div>

          {/* category filter */}
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <UiSelect
              value={v.category}
              onChange={(val) => onChange({ category: val })}
              options={[
                { value: "all", label: "All categories" },
                { value: "cleanliness", label: "Cleanliness" },
                { value: "communication", label: "Communication" },
                { value: "respect_house_rules", label: "House rules" },
              ]}
            />
          </div>

          {/* channel filter */}
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Channel</label>
            <UiSelect
              value={v.channel}
              onChange={(val) => onChange({ channel: val })}
              options={[
                { value: "all", label: "All channels" },
                { value: "hostaway", label: "Hostaway" },
                { value: "mock", label: "Mock" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* footer actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
          >
            Clear
          </button>
          {helperLabel && (
            <span className="text-xs text-slate-500">
              Showing: <span className="font-medium text-slate-900">{helperLabel}</span>
            </span>
          )}
        </div>

        {/* sort dropdown */}
        <div className="ml-auto min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Sort</label>
          <UiSelect
            value={v.sort}
            onChange={(val) => onChange({ sort: val })}
            options={[
              { value: "date_desc", label: "Newest first" },
              { value: "date_asc", label: "Oldest first" },
              { value: "rating_desc", label: "Highest rating" },
              { value: "rating_asc", label: "Lowest rating" },
            ]}
            align="right"
          />
        </div>
      </div>
    </section>
  );
}
