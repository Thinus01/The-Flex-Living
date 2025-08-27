import { getAll, setOne } from "../_lib/store";
import fetchReviewsFromSource from "../_lib/fetchReviews"; // your existing logic

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch reviews from external source
    const reviews = await fetchReviewsFromSource(req.query);

    // Fetch approvals from our store
    const approvals = await getAll();

    // Merge approvals into reviews
    const merged = reviews.map((r) => ({
      ...r,
      approved: approvals[`${r.channel}:${r.id}`] ?? false,
    }));

    return res.status(200).json({ status: "success", result: merged });
  }

  if (req.method === "PATCH") {
    const { source = "mock", id } = req.query;
    const { approved } = req.body;

    if (!id) {
      return res.status(400).json({ status: "error", message: "Missing review id" });
    }

    // Save approval in our store
    const key = `${source}:${id}`;
    const updated = await setOne(key, approved);

    return res.status(200).json({
      status: "success",
      result: { key, approved: updated },
    });
  }

  return res.status(405).json({ status: "error", message: "Method not allowed" });
}
