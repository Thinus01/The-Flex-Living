// api/reviews/[source]/[id]/approval.js  (ESM to match your other functions)

export default async function handler(req, res) {
  // --- CORS / preflight (also useful even if same-origin) ---
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  // --- Only PATCH is allowed here ---
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH, OPTIONS');
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }

  try {
    // Parse JSON body (Vercel does NOT auto-parse for Node functions)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyStr = Buffer.concat(chunks).toString('utf8');
    const body = bodyStr ? JSON.parse(bodyStr) : {};

    const approved = !!body.approved;
    const { source, id } = req.query; // from [source]/[id]

    // No persistence in serverless FS; echo success for optimistic UI
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ ok: true, key: `${source}:${id}`, approved });
  } catch (e) {
    console.error('approval error:', e);
    res.status(500).json({ ok: false, message: e.message || String(e) });
  }
}
