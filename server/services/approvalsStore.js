import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// resolve __dirname esm
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// approvals file path
const FILE = path.join(__dirname, "..", "data", "approvals.json");

// build approval key
export function keyOf(obj) {
  return `${obj.channel}:${obj.id}`;
}

// ensure storage file
async function ensureFile() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try { await fs.access(FILE); }
  catch { await fs.writeFile(FILE, "{}", "utf8"); }
}

// read approvals map
export async function getApprovals() {
  await ensureFile();
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); }
  catch { return {}; }
}

// set approval flag
export async function setApproval(keyOrObj, approved) {
  await ensureFile();
  const key = typeof keyOrObj === "string" ? keyOrObj : keyOf(keyOrObj);
  const all = await getApprovals();
  all[key] = !!approved;
  await fs.writeFile(FILE, JSON.stringify(all, null, 2));
  return all[key];
}
