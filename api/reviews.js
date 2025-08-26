// api/reviews.js
const fs = require('fs/promises');
const path = require('path');

// ensure Node runtime (not Edge) since we use fs
exports.config = { runtime: 'nodejs18.x' };

module.exports = async (req, res) => {
  try {
    // file must exist at: <repo-root>/api/_data/reviews.mock.json
    const filePath = path.join(process.cwd(), 'api', '_data', 'reviews.mock.json');
    const raw = await fs.readFile(filePath, 'utf8'); // throws if missing
    const data = JSON.parse(raw);                    // throws if invalid JSON

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      status: 'success',
      result: Array.isArray(data) ? data : []
    });
  } catch (e) {
    console.error('reviews error:', e);
    res.status(500).json({
      status: 'fail',
      message: e.message,
      stack: e.stack
    });
  }
};
