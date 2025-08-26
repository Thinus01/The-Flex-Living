// stat pills component
export default function StatPills({ stats, className = "" }) {
  // assemble display items
  const items = [
    { label: "guests", value: stats.guests, icon: "👥" },
    { label: "bedrooms", value: stats.bedrooms, icon: "🛏️" },
    { label: "bathrooms", value: stats.bathrooms, icon: "🛁" },
    { label: "beds", value: stats.beds, icon: "🏠" },
  ];

  return (
    // container row
    <div className={`flex flex-wrap items-center gap-6 text-slate-700 ${className}`}>
      {items.map(i => (
        // single stat pill
        <div key={i.label} className="inline-flex items-center gap-2 text-sm">
          <span aria-hidden>{i.icon}</span>
          <div className="text-center">
            <div className="text-base font-semibold">{i.value}</div>
            <div className="text-xs text-gray-500">{i.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
