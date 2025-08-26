// api/reviews/[source]/[id]/approval.js
export const config = { runtime: 'nodejs' };

// NOTE: demo-only, not persistent across cold starts
const mem = globalThis.__approvals ?? (globalThis.__approvals = {});

function setCommonHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  // Preflight for PATCH
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'PATCH') {
    setCommonHeaders(res);
    res.setHeader('Allow', 'PATCH, OPTIONS');
    res
      .status(405)
      .json({ ok: false, message: 'Method Not Allowed (use PATCH with JSON body)' });
    return;
  }

  try {
    const { source, id } = req.query || {};
    const body = await readJsonBody(req);

    if (typeof body.approved === 'undefined') {
      setCommonHeaders(res);
      res
        .status(400)
        .json({ ok: false, message: 'Missing "approved" boolean in body' });
      return;
    }

    const key = `${source}:${id}`;
    mem[key] = !!body.approved;

    setCommonHeaders(res);
    res.status(200).json({ ok: true, key, approved: mem[key] });
  } catch (e) {
    console.error('approval error:', e);
    setCommonHeaders(res);
    res.status(500).json({ ok: false, message: e.message || String(e) });
  }
}
