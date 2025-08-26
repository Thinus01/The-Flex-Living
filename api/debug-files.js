// api/debug-files.js
const fs = require('fs/promises');
const path = require('path');
module.exports = async (_req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, '_data'));
    res.status(200).json({ dataDir: path.join(__dirname, '_data'), files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
