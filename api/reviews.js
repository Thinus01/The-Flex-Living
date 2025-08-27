import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { source, id, approved } = req.body;
    await kv.hset("reviews", `${source}:${id}`, approved ? "true" : "false");
    return res.status(200).json({ status: "success", result: { source, id, approved } });
  }
  if (req.method === "GET") {
    const all = await kv.hgetall("reviews");
    return res.status(200).json({ status: "success", result: all });
  }
}