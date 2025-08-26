const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

// approvals file path
const FILE = path.join(__dirname, '..', 'data', 'approvals.json');

// ensure file exists
function ensureFile() {
  // create parent dir
  if (!fs.existsSync(path.dirname(FILE))) fs.mkdirSync(path.dirname(FILE), { recursive: true });
  // create empty json
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}', 'utf8');
}

// approval key builder
function keyOf(review) {
  // id namespace
  const source = review.channel || 'hostaway';
  return `${source}:${review.id}`;
}

// read approvals map
async function readMap() {
  ensureFile();
  const raw = await fsp.readFile(FILE, 'utf8');
  try { return JSON.parse(raw) || {}; } catch { return {}; }
}

// write approvals map
async function writeMap(map) {
  ensureFile();
  // atomic write via tmp
  const tmp = `${FILE}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(map, null, 2), 'utf8');
  await fsp.rename(tmp, FILE);
}

// get all approvals
async function getApprovals() {
  return await readMap();
}

// set approval flag
async function setApproval(key, approved) {
  const map = await readMap();
  map[key] = !!approved; // coerce boolean
  await writeMap(map);
  return map[key];
}

module.exports = { keyOf, getApprovals, setApproval };
