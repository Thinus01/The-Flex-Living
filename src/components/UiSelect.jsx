import { useEffect, useRef, useState } from "react";

// simple select dropdown
export default function UiSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Select…",
  align = "left"
}) {
  const [open, setOpen] = useState(false); // popover open state
  const btnRef = useRef(null); // trigger button ref
  const popRef = useRef(null); // popover panel ref

  const selected = options.find(o => o.value === value); // selected option

  // outside click and Escape
  useEffect(() => {
    const onDoc = (e) => {
      if (!btnRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* trigger button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => (e.key === "ArrowDown" || e.key === "Enter") && setOpen(true)} // open on Arrow or Enter
        className="min-w-[160px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
                   focus:outline-none focus:ring-2 focus:ring-teal-600 flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.label ?? placeholder}</span>
        <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {/* options popover */}
      {open && (
        <div
          ref={popRef}
          className={`absolute z-50 mt-1 w-full ${align === "right" ? "right-0" : "left-0"}
                      overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5`}
          role="listbox"
        >
          <ul className="max-h-60 overflow-auto py-1">
            {options.map(opt => {
              const active = opt.value === value;
              return (
                <li key={opt.value}>
                  {/* choose option and close */}
                  <button
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm
                                ${active ? "bg-teal-50 text-teal-900 font-medium" : "hover:bg-teal-50 hover:text-teal-900"}
                                focus:outline-none`}
                    role="option"
                    aria-selected={active}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
