// fetch reviews API
export async function fetchReviews(params = {}) {
  // build query params
  const search = new URLSearchParams({
    type: "host-to-guest",
    statuses: "published",
    ...params,
  });
  // GET reviews JSON
  const res = await fetch(`/api/reviews?${search.toString()}`, {
    headers: { accept: "application/json", "cache-control": "no-store" },
  });
  // throw on non-200
  if (!res.ok) throw new Error(`GET /api/reviews failed (${res.status})`);
  return res.json();
}

// update review approval
export async function setApproval({ source = "hostaway", id, approved }) {
  const res = await fetch(
    `/api/reviews?source=${encodeURIComponent(source)}&id=${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    }
  );

  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`PATCH ${res.status}: ${text || "no body"}`);

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// fetch approvals list
export async function fetchApprovals() {
  const res = await fetch("/api/approvals", { headers: { accept: "application/json" } });
  // throw on non-200
  if (!res.ok) throw new Error(`GET /api/approvals failed (${res.status})`);
  return res.json();
}


