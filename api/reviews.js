import fs from "fs/promises";

const FILE = "/tmp/reviews.mock.json";

export default async function handler(req, res) {
  const reviews = JSON.parse(await fs.readFile(FILE, "utf8").catch(() => "[]"));

  if (req.method === "PATCH") {
    const { source, id, approved } = req.body;
    const review = reviews.find(r => r.channel === source && r.id === id);
    if (!review) return res.status(404).json({ status: "fail", message: "Not found" });

    review.approved = !!approved;
    await fs.writeFile(FILE, JSON.stringify(reviews, null, 2), "utf8");

    return res.status(200).json({ status: "success", result: review });
  }

  return res.status(200).json({ status: "success", result: reviews });
}
