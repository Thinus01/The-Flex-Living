import { useMemo, useRef, useState, useEffect } from "react";
import { parseISO, differenceInCalendarDays, format } from "date-fns";
import DateRangeField from "./DateRangeField";

// booking sidebar component
export default function BookingSidebar({ pricing }) {
  const [dates, setDates] = useState({ startDate: "", endDate: "" }); // selected date range
  const nights = useMemo(() => {
    if (!dates.startDate || !dates.endDate) return 0; // incomplete dates
    return Math.max(
      0,
      differenceInCalendarDays(parseISO(dates.endDate), parseISO(dates.startDate))
    );
  }, [dates]); // computed nights count

  const [guests, setGuests] = useState(1); // guests count
  const [openGuests, setOpenGuests] = useState(false); // popover open state
  const guestsRef = useRef(null); // popover anchor ref
  const toggleGuests = () => setOpenGuests((o) => !o);
  useEffect(() => {
    const onDoc = (e) => {
      if (!guestsRef.current?.contains(e.target)) setOpenGuests(false); // close on outside click
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []); // mount listeners

  const [coupon, setCoupon] = useState(""); // coupon code input

  const nightly = Number(pricing?.nightly ?? 0); // nightly rate
  const cleaningFee = Number(pricing?.cleaningFee ?? 0); // cleaning fee
  const losPercent = Number(pricing?.discounts?.lengthOfStayPercent ?? 0); // LOS percent

  const base = nights * nightly; // base price
  const losDiscount = nights > 0 ? Math.round(base * (losPercent / 100)) : 0; // discount value
  const total = nights > 0 ? base - losDiscount + cleaningFee : 0; // total price

  const price = (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
      Number.isFinite(n) ? n : 0
    ); // currency formatter GBP

  const fmt = (iso) => (iso ? format(parseISO(iso), "MMM d") : "—"); // short date label

  return (
    <div className="rounded-xl overflow-visible ring-1 ring-black/10 bg-white">
      {/* header bar */}
      <div className="bg-teal-900 text-white px-4 py-3 rounded-t-xl">
        <div className="text-sm font-semibold">Book your stay</div>
        <div className="text-xs opacity-80">Select dates to see the total price</div>
      </div>

      <div className="p-4 space-y-4">
        {/* inputs row */}
        <div className="grid grid-cols-2 gap-2">
          <DateRangeField
            start={dates.startDate}
            end={dates.endDate}
            onChange={(patch) => setDates((d) => ({ ...d, ...patch }))}
            buttonClass="h-10"
          />

          <div className="relative" ref={guestsRef}>
            {/* guests button */}
            <button
              type="button"
              onClick={toggleGuests}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm
                         flex items-center justify-between hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 10a3 3 0 100-6 3 3 0 000 6zM3 16a7 7 0 1114 0H3z" />
                </svg>
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
              <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* guests popover */}
            {openGuests && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white shadow-md p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Guests</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded-md border hover:bg-slate-50"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm">{guests}</span>
                    <button
                      className="h-7 w-7 rounded-md border hover:bg-slate-50"
                      onClick={() => setGuests((g) => Math.min(12, g + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* trip summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Check-in</span>
            <span className="font-medium">{fmt(dates.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-out</span>
            <span className="font-medium">{fmt(dates.endDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Guests</span>
            <span className="font-medium">
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        {/* price breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              Base price ({nights} night{nights !== 1 ? "s" : ""})
            </span>
            <span>{price(base)}</span>
          </div>

          {/* LOS discount */}
          {losPercent > 0 && nights > 0 && (
            <div className="flex justify-between text-emerald-700 bg-emerald-50/60 rounded-lg px-3 py-2">
              <span>{losPercent}% length of stay discount</span>
              <span>-{price(losDiscount)}</span>
            </div>
          )}

          {nights > 0 && (
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>{price(cleaningFee)}</span>
            </div>
          )}
        </div>

        {/* coupon input */}
        <div className="space-y-2">
          <div className="text-sm text-slate-700 flex items-center gap-2">
            <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2h2a2 2 0 110 4H3v2a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
            </svg>
            Have a coupon code?
          </div>
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter code"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              disabled={!coupon}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>

        {/* total section */}
        <div className="pt-2 border-t">
          <div className="flex items-baseline justify-between">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-xl font-bold">{price(total)}</div>
          </div>
          <div className="text-xs text-slate-500">
            You saved {price(losDiscount)}
          </div>
        </div>

        {/* actions */}
        <button
          className="w-full rounded-lg bg-teal-900 text-white py-3 font-semibold disabled:opacity-50"
          disabled={nights === 0}
        >
          Book Now
        </button>
        <button className="w-full rounded-lg border py-3 text-sm">Send Inquiry</button>

        <div className="text-xs text-slate-500 text-center">○ Instant confirmation</div>
      </div>
    </div>
  );
}
