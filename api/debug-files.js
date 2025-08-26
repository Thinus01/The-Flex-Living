// api/debug-files.js
const fs = require('fs/promises');
const path = require('path');

async function handler(_req, res) {
  try {
    const dir = path.join(__dirname, '_data');
    const files = await fs.readdir(dir);
    res.status(200).json({ dir, files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = handler;
module.exports.config = { runtime: 'nodejs18.x' };
