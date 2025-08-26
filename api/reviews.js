// api/reviews.js (CommonJS)
const mock = require('./_data/reviews.mock.json'); // <-- no fs

function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    status: 'success',
    result: Array.isArray(mock) ? mock : [],
  });
}

module.exports = handler;
// optional, but keeps you safely on Node (not Edge)
module.exports.config = { runtime: 'nodejs18.x' };
