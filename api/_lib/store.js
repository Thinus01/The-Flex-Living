// api/_lib/store.js
import fs from "fs/promises";
import path from "path";

let kv = null;
try {
  // Optional: only works if @vercel/kv is installed and env vars are set
  const mod = await import("@vercel/kv");
  kv = mod.kv;
} catch (_) { /* no KV -> fallback */ }

const FILE_REPO = path.join(process.cwd(), "api", "_data", "approvals.json"); // local dev
const FILE_TMP  = "/tmp/approvals.json";                                      // Vercel runtime

async function readFileJSON(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); }
  catch (e) { if (e.code === "ENOENT") return {}; throw e; }
}
async function writeFileJSON(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function getAll() {
  if (kv) {
    const map = await kv.hgetall("approvals"); // { "mock:1001": "true", ... } or null
    if (!map) return {};
    const out = {};
    for (const [k, v] of Object.entries(map)) out[k] = v === "true" || v === true || v === 1 || v === "1";
    return out;
  }
  const file = process.env.VERCEL ? FILE_TMP : FILE_REPO;
  return readFileJSON(file);
}

export async function setOne(key, approved) {
  if (kv) {
    await kv.hset("approvals", { [key]: approved ? "true" : "false" });
    return !!approved;
  }
  const file = process.env.VERCEL ? FILE_TMP : FILE_REPO;
  const all = await getAll();
  all[key] = !!approved;
  await writeFileJSON(file, all);
  return all[key];
}
