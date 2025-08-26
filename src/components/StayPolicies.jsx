import CardShell from "./CardShell";

// stay policies component
export default function StayPolicies({ policies }) {
  // normalize input values
  const p = policies ?? {};

  const checkin   = p.checkin ?? null;
  const checkout  = p.checkout ?? null;
  const minNights = p.minNights ?? null;
  const maxGuests = p.maxGuests ?? null;
  const quietHours = p.quietHours ?? null;

  // to array helper
  const toArr = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);

  // normalize text arrays
  const houseRules  = toArr(p.houseRules).map(String);
  const cancellation = toArr(p.cancellation).map(String);

  // normalize fee entries
  const fees = toArr(p.fees).map(f =>
    typeof f === "string" ? { label: f, amount: null } : (f ?? { label: "", amount: null })
  );

  // empty content check
  const noContent =
    !checkin && !checkout &&
    !minNights && !maxGuests &&
    !quietHours &&
    houseRules.length === 0 &&
    cancellation.length === 0 &&
    fees.length === 0;

  return (
    <CardShell title="Stay Policies">
      <div className="space-y-4 text-sm text-gray-700">
        {/* checkin and checkout row */}
        {(checkin || checkout) && (
          <div className="flex gap-6">
            {checkin &&  <div><span className="font-medium">Check-in:</span> {checkin}</div>}
            {checkout && <div><span className="font-medium">Check-out:</span> {checkout}</div>}
          </div>
        )}

        {/* nights and guests row */}
        {(minNights != null || maxGuests != null) && (
          <div className="flex gap-6">
            {minNights != null && <div><span className="font-medium">Min nights:</span> {minNights}</div>}
            {maxGuests  != null && <div><span className="font-medium">Max guests:</span> {maxGuests}</div>}
          </div>
        )}

        {/* quiet hours row */}
        {quietHours && (
          <div>
            <span className="font-medium">Quiet hours:</span>{" "}
            {quietHours.from} – {quietHours.to}
          </div>
        )}

        {/* house rules list */}
        {houseRules.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-900">House rules</h4>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              {houseRules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* cancellation list */}
        {cancellation.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-900">Cancellation</h4>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              {cancellation.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* fees list */}
        {fees.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-900">Fees</h4>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              {fees.map((f, i) => (
                <li key={i}>{f.amount ? `${f.label}: ${f.amount}` : f.label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* empty state message */}
        {noContent && <p className="text-gray-500">No specific policies for this property.</p>}
      </div>
    </CardShell>
  );
}
