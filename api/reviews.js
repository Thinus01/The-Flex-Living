// api/reviews.js
const fs = require('fs/promises');
const path = require('path');

// Make sure we're on the Node runtime (fs isn't available on Edge)
exports.config = { runtime: 'nodejs18.x' };

module.exports = async (req, res) => {
  try {
    // Bullet-proof path: use __dirname so the function's folder is the anchor
    const filePath = path.join(__dirname, '_data', 'reviews.mock.json');

    const raw = await fs.readFile(filePath, 'utf8');   // ENOENT if not found
    const data = JSON.parse(raw);                      // throws on invalid JSON

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      status: 'success',
      result: Array.isArray(data) ? data : []
    });
  } catch (e) {
    console.error('[/api/reviews] error:', e);
    // Return JSON so Vercel doesn't show a crash page
    res.status(500).json({
      status: 'fail',
      message: e.message,
    });
  }
};
