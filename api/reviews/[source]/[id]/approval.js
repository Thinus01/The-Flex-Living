// api/reviews/[source]/[id]/approval.js
export const config = { runtime: 'nodejs18.x' };

function send(res, status, json) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(json);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  // Preflight for PATCH
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH, OPTIONS');
    return send(res, 405, { ok: false, message: 'Method Not Allowed' });
  }

  try {
    const { source, id } = req.query || {};
    const body = await readJson(req);

    if (typeof body.approved === 'undefined') {
      return send(res, 400, { ok: false, message: 'Missing "approved" boolean in body' });
    }

    const approved = !!body.approved;

    // No persistence here (Vercel FS is read-only). Echo success for optimistic UI.
    return send(res, 200, { ok: true, key: `${source}:${id}`, approved });
  } catch (e) {
    console.error('approval error:', e);
    return send(res, 500, { ok: false, message: e.message || String(e) });
  }
}
