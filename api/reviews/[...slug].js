// api/reviews/[...slug].js
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    method: req.method,
    slug: req.query.slug, // e.g. ["mock","1001","approval"]
  });
}
