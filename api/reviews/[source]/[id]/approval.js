const { readFile } = require('fs/promises');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'api', '_data', 'reviews.mock.json');
    const raw = await readFile(filePath, 'utf8');
    const arr = JSON.parse(raw);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ status: 'success', result: Array.isArray(arr) ? arr : [] });
  } catch (e) {
    console.error('reviews error:', e);
    res.status(500).json({ status: 'fail', message: e.message });
  }
};
