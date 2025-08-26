// api/reviews.js
const fs = require('fs/promises');
const path = require('path');

// Force Node runtime (not Edge), just in case
exports.config = { runtime: 'nodejs18.x' };

module.exports = async (req, res) => {
  try {
    // Ensure the mock file is at: <repo-root>/api/_data/reviews.mock.json
    const filePath = path.join(process.cwd(), 'api', '_data', 'reviews.mock.json');

    const raw = await fs.readFile(filePath, 'utf8'); // will throw if ENOENT
    const data = JSON.parse(raw); // will throw if invalid JSON

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      status: 'success',
      result: Array.isArray(data) ? data : []
    });
  } catch (e) {
    // Return a JSON error instead of crashing the function
    console.error('reviews error:', e);
    res.status(500).json({
      status: 'fail',
      message: e.message,
      // Optional: include stack while debugging; remove later
      stack: e.stack
    });
  }
};
