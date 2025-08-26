// generic card shell
export default function CardShell({ title, rightSlot, children }) {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <header className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold">{title}</h2>
        {rightSlot /* right actions slot */}
      </header>
      <div className="px-5 py-4">{children /* content body */}</div>
    </section>
  );
}
