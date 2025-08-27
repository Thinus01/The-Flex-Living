import fs from "fs/promises";
import path from "path";
import { kv } from "@vercel/kv";

const FILE_REPO = path.join(process.cwd(), "api", "_data", "reviews.mock.json");

export default async function handler(req, res) {
  // load the reviews from the bundled JSON
  const reviews = JSON.parse(await fs.readFile(FILE_REPO, "utf8").catch(() => "[]"));

  if (req.method === "PATCH") {
    const { source, id, approved } = req.body;

    const review = reviews.find(r => r.channel === source && r.id === id);
    if (!review) return res.status(404).json({ status: "fail", message: "Not found" });

    // save approved value to KV
    const key = `${source}:${id}`;
    await kv.set(key, !!approved);

    return res.status(200).json({ status: "success", result: { ...review, approved: !!approved } });
  }

  if (req.method === "GET") {
    // get all approvals from KV
    const result = await Promise.all(
      reviews.map(async r => {
        const key = `${r.channel}:${r.id}`;
        const approved = await kv.get(key);
        return { ...r, approved: !!approved };
      })
    );

    return res.status(200).json({ status: "success", result });
  }

  res.status(405).json({ status: "fail", message: "Method not allowed" });
}
