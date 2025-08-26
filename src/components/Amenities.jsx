import CardShell from "./CardShell";

// amenities section component
export default function Amenities({ items = [] }) {
  // right slot button
  const Right = (
    <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
      View all amenities →
    </button>
  );

  return (
    <CardShell title="Amenities" rightSlot={Right}>
      {/* amenities list grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-slate-700">
        {items.map((a) => (
          <li key={a} className="flex items-center gap-3">
            {/* bullet dot */}
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-300" />
            {a}
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
