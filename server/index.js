import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { keyOf, getApprovals, setApproval } from "./services/approvalsStore.js";

// env paths and config
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const HOSTAWAY_BASE = "https://api.hostaway.com/v1";
const USE_MOCK = process.env.USE_MOCK ?? "fallback";

// mock data paths
const MOCK_REVIEWS = path.join(__dirname, "data", "reviews.mock.json");
const PROPS_PATH   = path.join(__dirname, "data", "properties.mock.json");

// express app setup
const app = express();
app.use(cors());
app.use(express.json());

// safe JSON file read
async function readJson(file) {
  try { const raw = await fs.readFile(file, "utf8"); const j = JSON.parse(raw); return Array.isArray(j) ? j : []; }
  catch { return []; }
}
async function readMock()  { return readJson(MOCK_REVIEWS); }
async function readProps() { return readJson(PROPS_PATH); }
function toSlug(s="") { return s.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-"); }

// health check route
app.get("/api/health", (_req,res)=>res.json({ ok:true, USE_MOCK }));

// token cache with refresh
let token, tokenExpiresAt;
async function getToken() {
  const now = Date.now();
  if (token && tokenExpiresAt && now < tokenExpiresAt - 60_000) return token;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.HOSTAWAY_ACCOUNT_ID,
    client_secret: process.env.HOSTAWAY_CLIENT_SECRET,
    scope: "general",
  });
  const { data } = await axios.post(`${HOSTAWAY_BASE}/accessTokens`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
  });
  token = data?.access_token;
  tokenExpiresAt = Date.now() + (data?.expires_in ?? 60*60*1000);
  return token;
}

// normalize review shape
function normalizeReview(r) {
  const submittedAt = r.updatedOn || r.scheduledDateTime || r.departureDate || r.arrivalDate || null;
  return {
    id: r.id,
    propertyId: r.propertyId ?? null,
    type: r.type,
    status: r.status,
    rating: typeof r.rating === "number" ? r.rating : null,
    publicReview: r.publicReview || null,
    reviewCategory: Array.isArray(r.reviewCategory) ? r.reviewCategory.map(c => ({ category: c.category, rating: c.rating })) : [],
    submittedAt,
    guestName: r.guestName || null,
    listingName: r.listingName || null,
  };
}

// properties list route
app.get("/api/properties", async (_req, res) => {
  const props = await readProps();
  res.json({ status: "success", result: props });
});

// reviews fetch route
app.get("/api/reviews", async (req, res) => {
  try {
    let result = [];
    let origin = "hostaway";

    // choose hostaway or mock
    if (USE_MOCK === "always") {
      origin = "mock";
      result = await readMock();
    } else {
      try {
        const access = await getToken(); // get access token
        const params = {
          limit: Number(req.query.limit) || 100,
          offset: Number(req.query.offset) || 0,
          type: req.query.type || "host-to-guest",
          statuses: req.query.statuses || "published",
          reservationId: req.query.reservationId,
          departureDateStart: req.query.departureDateStart,
          departureDateEnd: req.query.departureDateEnd,
          sortBy: req.query.sortBy,
          sortOrder: req.query.sortOrder,
          listingMapIds: req.query.listingMapIds,
        };
        const { data } = await axios.get(`${HOSTAWAY_BASE}/reviews`, {
          headers: { Authorization: `Bearer ${access}`, "Cache-Control": "no-cache" },
          params,
        });
        result = Array.isArray(data?.result) ? data.result.map(normalizeReview) : [];
      } catch (e) {
        // fallback to mock
        if (USE_MOCK !== "off") { origin = "mock"; result = await readMock(); }
        else throw e;
      }
      // empty fallback behavior
      if (USE_MOCK === "fallback" && result.length === 0) {
        origin = "mock";
        result = await readMock();
      }
    }

    // attach property ids by slug
    const props = await readProps();
    const slugToId = new Map(props.map(p => [p.slug || toSlug(p.title), p.id]));
    result = result.map(r => {
      const withChannel = { channel: r.channel || origin, ...r };
      if (!withChannel.propertyId) {
        withChannel.propertyId = slugToId.get(toSlug(withChannel.listingName || "")) || null;
      }
      return withChannel;
    });

    // apply saved approvals
    const approvals = await getApprovals();
    result = result.map(r => {
      const key = keyOf(r);
      return { ...r, approved: approvals[key] === true };
    });

    res.json({ status: "success", result });
  } catch (err) {
    console.error("Reviews error:", err?.response?.data || err?.message);
    res.status(500).json({ status: "fail", message: "Unable to fetch reviews" });
  }
});

// approvals read route
app.get("/api/approvals", async (_req, res) => res.json(await getApprovals()));

// approval toggle route
app.patch("/api/reviews/:source/:id/approval", async (req, res) => {
  try {
    const { source, id } = req.params;
    const { approved } = req.body || {};
    const saved = await setApproval({ channel: source, id }, !!approved);

    const approvals = await getApprovals();
    console.log("[PATCH] approval", { source, id, approved: !!approved });

    res.json({ ok: true, key: `${source}:${id}`, approved: saved, approvals });
  } catch (e) {
    console.error("Approval error:", e?.message || e);
    res.status(500).send("Approval write failed");
  }
});

// start server listener
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT} (USE_MOCK=${USE_MOCK})`));
