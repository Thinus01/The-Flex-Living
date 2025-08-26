// api/reviews/[source]/[id]/approval.js
export const config = { runtime: "nodejs" }; // or omit

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH, OPTIONS");
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }
  let body = "";
  for await (const chunk of req) body += chunk;
  const { approved } = body ? JSON.parse(body) : {};
  if (typeof approved !== "boolean") {
    return res.status(400).json({ status: "fail", message: "Missing boolean 'approved'" });
  }
  return res.status(200).json({ status: "success", result: { approved } });
}
