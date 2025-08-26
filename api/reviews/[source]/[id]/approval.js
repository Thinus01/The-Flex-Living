// api/reviews/[source]/[id]/approval.js
export const config = { runtime: 'nodejs' }; // or delete this line to use default

// ephemeral in-memory store (ok for demo; not persistent)
const mem = globalThis.__approvals ?? (globalThis.__approvals = {});

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  // Preflight for PATCH requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH, OPTIONS');
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }

  try {
    const { source, id } = req.query || {};
    const body = await readJson(req);

    if (typeof body.approved === 'undefined') {
      res.status(400).json({ ok: false, message: 'Missing "approved" boolean in body' });
      return;
    }

    const key = `${source}:${id}`;
    mem[key] = !!body.approved; // demo-only persistence

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ ok: true, key, approved: mem[key] });
  } catch (e) {
    console.error('approval error:', e);
    res.status(500).json({ ok: false, message: e.message || String(e) });
  }
}
