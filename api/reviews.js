// api/reviews.js  (Vercel Serverless Function)
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'api', '_data', 'reviews.mock.json');
    const raw = await readFile(filePath, 'utf8');
    const arr = JSON.parse(raw);
    res.status(200).json({ status: 'success', result: Array.isArray(arr) ? arr : [] });
  } catch (e) {
    res.status(500).json({ status: 'fail', message: e.message });
  }
}
