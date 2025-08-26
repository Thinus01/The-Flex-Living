// api/approvals.js
import { getAll, setOne } from "./_lib/store.js";

async function readJSON(req) {
  let raw = ""; for await (const c of req) raw += c;
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method === "GET") {
    try {
      const all = await getAll();
      const { source, id } = req.query || {};
      if (source && id) {
        const key = `${source}:${id}`;
        const approved = Object.prototype.hasOwnProperty.call(all, key) ? all[key] : null;
        return res.status(200).json({ status: "success", result: { key, approved } });
      }
      return res.status(200).json({ status: "success", result: all });
    } catch (e) {
      return res.status(500).json({ status: "fail", message: e.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { source, id, approved } = await readJSON(req);
      if (!source || !id || typeof approved !== "boolean") {
        return res.status(400).json({ status: "fail", message: "Body must be { source, id, approved:boolean }" });
      }
      const key = `${source}:${id}`;
      const value = await setOne(key, approved);
      return res.status(200).json({ status: "success", result: { key, approved: value } });
    } catch (e) {
      return res.status(500).json({ status: "fail", message: e.message });
    }
  }

  res.setHeader("Allow", "GET, PATCH, OPTIONS");
  return res.status(405).json({ status: "fail", message: "Method not allowed" });
}
