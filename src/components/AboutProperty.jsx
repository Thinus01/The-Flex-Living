import CardShell from "./CardShell";

// about section component
export default function AboutProperty({ text }) {
  return (
    // reusable card container
    <CardShell title="About this property" rightSlot={null /* no right actions */}>
      {/* property description text */}
      <p className="text-slate-700 leading-relaxed">{text}</p>
    </CardShell>
  );
}
