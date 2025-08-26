import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import "react-day-picker/dist/style.css";

// ISO date string helper
const iso = (d) =>
  d ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10) : "";
// parse ISO or undefined
const pISO = (s) => (s ? parseISO(s) : undefined);
// short date label
const fmtShort = (s) => (s ? format(pISO(s), "dd MMM") : "");

// add months utility
const addMonths = (d, n) => {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
};

export default function DateRangeField({
  start,
  end,
  onChange,
  className = "",
  buttonClass = "",
}) {
  // popover open state
  const [open, setOpen] = useState(false);
  // selected range state
  const [range, setRange] = useState({ from: pISO(start), to: pISO(end) });
  // current calendar month
  const [month, setMonth] = useState(range.from || new Date());
  // refs for outside click
  const wrapRef = useRef(null);
  const popRef = useRef(null);

  // sync range from props
  useEffect(() => setRange({ from: pISO(start), to: pISO(end) }), [start, end]);
  // jump to selected month
  useEffect(() => { if (range.from) setMonth(range.from); }, [range.from]);

  // close on outside or escape
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  // handle range selection
  function handleSelect(sel) {
    setRange(sel || { from: undefined, to: undefined });
    onChange({
      startDate: sel?.from ? iso(sel.from) : "",
      endDate: sel?.to ? iso(sel.to) : "",
    });
  }

  // button label text
  const label = useMemo(() => {
    if (start && end) return `${fmtShort(start)} – ${fmtShort(end)}`;
    if (start) return `From ${fmtShort(start)}`;
    if (end) return `Until ${fmtShort(end)}`;
    return "Select dates";
  }, [start, end]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-900
                    hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600
                    flex items-center justify-between ${buttonClass}`}
      >
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3A1 1 0 006 2zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z"/>
          </svg>
          {label}
        </span>
        <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* calendar popover */}
      {open && (
        <div
          ref={popRef}
          className="absolute z-50 mt-2 w-[min(360px,92vw)] overflow-hidden rounded-lg border border-slate-200
                     bg-white shadow-md ring-1 ring-black/5 p-2"
        >
          {/* date range picker */}
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            weekStartsOn={1}
            month={month}
            onMonthChange={setMonth}
            hideNavigation
            classNames={{
              caption: "px-1 pt-1 pb-2 text-[13px] font-semibold text-center",
              months: "flex justify-center",
              month: "p-1",
              head_row: "grid grid-cols-7 gap-[2px] px-1",
              head_cell: "text-[11px] text-slate-500 text-center",
              row: "grid grid-cols-7 gap-[2px] px-1",
              cell: "text-center",
              day: "h-8 w-8 rounded-md text-[13px] hover:bg-teal-50 hover:text-teal-900 focus:outline-none",
              day_selected: "bg-teal-900 text-white hover:bg-teal-900 hover:text-white",
              day_today: "ring-1 ring-teal-900",
              day_range_start: "rounded-l-md",
              day_range_end: "rounded-r-md",
              day_range_middle: "bg-teal-100 text-teal-900",
            }}
          />

          {/* footer controls */}
          <div className="mt-2 flex items-center px-1">
            <button
              type="button"
              onClick={() => { setRange({ from: undefined, to: undefined }); onChange({ startDate: "", endDate: "" }); }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
            >
              Clear
            </button>

            {/* month nav */}
            <div className="mx-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMonth((m) => addMonths(m, -1))}
                className="h-8 w-8 rounded-md border border-slate-300 bg-white hover:bg-teal-50 hover:text-teal-900"
                aria-label="Previous month"
              >‹</button>
              <button
                type="button"
                onClick={() => setMonth((m) => addMonths(m, 1))}
                className="h-8 w-8 rounded-md border border-slate-300 bg-white hover:bg-teal-50 hover:text-teal-900"
                aria-label="Next month"
              >›</button>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-teal-900 px-3 py-1.5 text-sm text-white hover:opacity-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
