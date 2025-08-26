// api/reviews/[source]/[id]/approval.js
export default async function handler(req, res) {
  // read raw body so we can see what arrives
  let raw = "";
  for await (const chunk of req) raw += chunk;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    ok: true,
    method: req.method,
    routeParams: req.query,     // { source: "...", id: "..." }
    contentType: req.headers["content-type"] || null,
    rawBody: raw || null
  });
}
