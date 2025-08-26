// list skeleton loader
export default function SkeletonList({ count = 6 }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="rounded-xl bg-white ring-1 ring-black/5 p-4">
          <div className="flex items-center gap-4">
            {/* image placeholder */}
            <div className="h-12 w-20 rounded-xl bg-slate-200 animate-pulse" />
            {/* text placeholders */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-slate-200 rounded animate-pulse" />
            </div>
            {/* stats and action placeholders */}
            <div className="flex items-center gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-4 w-10 bg-slate-200 rounded animate-pulse" />
              ))}
              <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
