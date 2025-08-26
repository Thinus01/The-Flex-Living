// api/reviews/[source]/[id]/approval.js
export const config = { runtime: 'nodejs18.x' };

// simple in-memory cache (ephemeral across cold starts)
const mem = globalThis.__approvals ?? (globalThis.__approvals = {});

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  // Allow preflight (if browser sends it)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH, OPTIONS');
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  try {
    const { source, id } = req.query || {};
    const body = await readJson(req);
    if (typeof body.approved === 'undefined') {
      return res.status(400).json({ ok: false, message: 'Missing "approved" boolean in body' });
    }

    const key = `${source}:${id}`;
    mem[key] = !!body.approved; // ephemeral

    return res.status(200).json({ ok: true, key, approved: mem[key] });
  } catch (e) {
    console.error('approval error:', e);
    return res.status(500).json({ ok: false, message: e.message || String(e) });
  }
}
