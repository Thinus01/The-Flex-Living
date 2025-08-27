// api/reviews.js
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getAll, setOne } from "./_lib/store.js";

export default async function handler(req, res) {
  const { method } = req;

  // PATCH: update approval status
  if (method === "PATCH") {
    try {
      const { source, id } = req.query;
      const { approved } = JSON.parse(req.body);

      if (!source || !id) {
        return res.status(400).json({ status: "fail", message: "Missing source or id" });
      }

      const key = `${source}:${id}`;
      await setOne(key, approved);

      return res.status(200).json({ status: "success", result: { key, approved } });
    } catch (e) {
      return res.status(500).json({ status: "fail", message: e.message });
    }
  }

  // GET: fetch reviews with approvals merged
  if (method === "GET") {
    try {
      const filePath = path.join(process.cwd(), "api", "_data", "reviews.mock.json");
      const raw = await readFile(filePath, "utf8");
      const reviews = JSON.parse(raw);
      const approvals = await getAll(); // { "mock:1001": true, ... }

      const result = Array.isArray(reviews)
        ? reviews.map(r => ({
            ...r,
            approved: !!approvals[`${r.channel}:${r.id}`], // inject approved flag
          }))
        : [];

      return res.status(200).json({ status: "success", result });
    } catch (e) {
      return res.status(500).json({ status: "fail", message: e.message });
    }
  }

  // fallback for unsupported methods
  return res.status(405).json({ status: "fail", message: "Method not allowed" });
}
