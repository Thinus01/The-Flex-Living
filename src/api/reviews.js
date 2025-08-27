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
  // PATCH approval flag using the new API route
  const res = await fetch(`/api/approvals`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, id, approved }),
  });

  // Read body as text
  const text = await res.text().catch(() => "");

  // Throw on error status
  if (!res.ok) throw new Error(`PATCH ${res.status}: ${text || "no body"}`);

  // Parse or return empty
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

