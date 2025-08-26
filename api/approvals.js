// api/approvals.js
import { readFile } from "node:fs/promises";
import path from "node:path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }

  try {
    // Read from repo (read-only on Vercel)
    const filePath = path.join(process.cwd(), "api", "_data", "approvals.json");
    let raw = "{}";
    try {
      raw = await readFile(filePath, "utf8");
    } catch (e) {
      if (e.code !== "ENOENT") throw e; // surface real errors
    }
    const map = raw ? JSON.parse(raw) : {};

    const { source, id } = req.query || {};
    if (source && id) {
      const key = `${source}:${id}`;
      const approved = Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null;
      return res.status(200).json({ status: "success", result: { key, approved } });
    }

    // No filter → return whole map
    return res.status(200).json({ status: "success", result: map });
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.message });
  }
}
