// api/reviews.js
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "api", "_data", "reviews.mock.json");

export default async function handler(req, res) {
  try {
    const raw = await readFile(FILE, "utf8");
    const reviews = JSON.parse(raw);

    // PATCH: update approved
    if (req.method === "PATCH") {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body);

      const { source, id, approved } = body;
      const review = reviews.find(r => r.channel === source && r.id === Number(id));
      if (!review) return res.status(404).json({ status: "fail", message: "Review not found" });

      review.approved = !!approved;
      await writeFile(FILE, JSON.stringify(reviews, null, 2), "utf8");

      return res.status(200).json({ status: "success", result: review });
    }

    // GET: return all reviews
    if (req.method === "GET") {
      return res.status(200).json({ status: "success", result: reviews });
    }

    // fallback
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ status: "fail", message: "Method not allowed" });

  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.message });
  }
}


