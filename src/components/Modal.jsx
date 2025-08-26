import { useEffect } from "react";

// accessible modal component
export default function Modal({ title, onClose, children, maxWidth = "max-w-3xl" }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.() // close on Escape
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" /> {/* backdrop */}
      <div
        className="absolute inset-0 flex items-start justify-center p-4 sm:p-6"
        onMouseDown={onClose} /* click outside to close */
      >
        <div
          className={`w-full ${maxWidth} rounded-2xl bg-white shadow-xl ring-1 ring-black/5`}
          onMouseDown={(e) => e.stopPropagation()} /* prevent inner close */
        >
          <div className="flex items-center justify-between gap-4 border-b px-4 sm:px-6 py-3">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
          <div className="p-4 sm:p-6">{children}</div> {/* modal content */}
        </div>
      </div>
    </div>
  )
}
