// api/reviews.js
const fs = require('fs/promises');
const path = require('path');

async function handler(req, res) {
  try {
    // path is case-sensitive on Vercel
    const filePath = path.join(__dirname, '_data', 'reviews.mock.json');
    const raw = await fs.readFile(filePath, 'utf8');   // ENOENT if file missing
    const data = JSON.parse(raw);                      // throws if invalid JSON

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      status: 'success',
      result: Array.isArray(data) ? data : [],
    });
  } catch (e) {
    console.error('[/api/reviews] error:', e);
    res.status(500).json({ status: 'fail', message: e.message });
  }
}

module.exports = handler;
module.exports.config = { runtime: 'nodejs18.x' };
