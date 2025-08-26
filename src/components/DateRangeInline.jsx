import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

// ISO yyyy-mm-dd helper
const iso = (d) =>
  d ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10) : "";
// parse ISO string
const parseISO = (str) => (str ? new Date(str + "T00:00:00Z") : undefined);
// display date label
const fmt = (str) => (str ? format(parseISO(str), "dd/MM/yyyy") : "dd/mm/yyyy");

// add months helper
const addMonths = (d, n) => {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
};

// inline date range picker
export default function DateRangeInline({ start, end, onChange, className = "" }) {
  // popover open state
  const [open, setOpen] = useState(false);
  // selected range state
  const [range, setRange] = useState({ from: parseISO(start), to: parseISO(end) });

  // current calendar month
  const [month, setMonth] = useState(range.from || new Date());

  // outside click refs
  const wrapRef = useRef(null);
  const popRef = useRef(null);

  // sync range from props
  useEffect(() => {
    setRange({ from: parseISO(start), to: parseISO(end) });
  }, [start, end]);

  // jump to selected month
  useEffect(() => {
    if (range.from) setMonth(range.from);
  }, [range.from]);

  // close on outside or escape
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // update parent on select
  function handleSelect(sel) {
    setRange(sel || { from: undefined, to: undefined });
    onChange({
      startDate: sel?.from ? iso(sel.from) : "",
      endDate: sel?.to ? iso(sel.to) : "",
    });
  }

  // shared field button styles
  const fieldBtn =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* trigger and fields */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">From</label>
        <button type="button" className={fieldBtn} onClick={() => setOpen(true)}>
          {fmt(start)}
        </button>
        <label className="text-sm text-slate-600">To</label>
        <button type="button" className={fieldBtn} onClick={() => setOpen(true)}>
          {fmt(end)}
        </button>
      </div>

      {/* calendar popover */}
      {open && (
        <div
          ref={popRef}
          className="
            absolute z-50 mt-2
            w-[min(360px,92vw)]
            overflow-hidden rounded-lg border border-slate-200 bg-white
            shadow-md ring-1 ring-black/5 p-2
          "
        >
          {/* picker instance */}
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

          {/* footer actions */}
          <div className="mt-2 flex items-center px-1">
            <button
              type="button"
              onClick={() => {
                setRange({ from: undefined, to: undefined });
                onChange({ startDate: "", endDate: "" });
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
            >
              Clear
            </button>

            {/* month navigation */}
            <div className="mx-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                className="h-8 w-8 rounded-md border border-slate-300 bg-white hover:bg-teal-50 hover:text-teal-900"
                aria-label="Previous month"
                title="Previous month"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                className="h-8 w-8 rounded-md border border-slate-300 bg-white hover:bg-teal-50 hover:text-teal-900"
                aria-label="Next month"
                title="Next month"
              >
                ›
              </button>
            </div>

            {/* close popover */}
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
