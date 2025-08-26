export async function fetchProperties() {
  const res = await fetch("/api/properties", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`GET /api/properties failed (${res.status})`);
  return res.json();
}
