// api/reviews/[source]/[id]/approval.js
import fs from "fs/promises";
import path from "path";

// IMPORTANT: Vercel only understands "nodejs" or "edge"
export const config = { runtime: "nodejs" };

// On Vercel, the filesystem is read-only except for /tmp (ephemeral).
const FILE = process.env.VERCEL ? "/tmp/approvals.json"
                                : path.join(process.cwd(), "api", "_data", "approvals.json");

async function readJSONBody(req) {
  const chunks = [];
  for await (const ch of req) chunks.push(ch);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function readAll() {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); }
  catch { return {}; } // file missing first time
}

async function writeAll(obj) {
  await fs.writeFile(FILE, JSON.stringify(obj, null, 2), "utf8");
}

export default async function handler(req, res) {
  const { source, id } = req.query || {}; // e.g. /api/reviews/hostaway/7453/approval

  if (req.method === "OPTIONS") {
    // If you’re calling from a different origin, preflight won’t 405
    res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH, OPTIONS");
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }

  try {
    const body = await readJSONBody(req); // expects { approved: true|false }
    if (typeof body.approved !== "boolean") {
      return res.status(400).json({ status: "fail", message: "Missing boolean 'approved' in JSON body" });
    }

    const key = `${source}:${id}`;
    const all = await readAll();
    all[key] = body.approved;
    await writeAll(all);

    return res.status(200).json({ status: "success", result: { key, approved: all[key] } });
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.message });
  }
}
