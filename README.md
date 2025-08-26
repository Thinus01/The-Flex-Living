Flex Living Reviews Dashboard
=============================

A small full-stack project that lets managers curate guest reviews per property and surface only **approved** reviews on a public-style property page. Includes a modern dashboard (filters, sorting, per-property modals), a property detail layout inspired by Flex Living, Google Map, and a polished date-range picker.

Tech Stack
----------

*   **Frontend:** React (Vite), Tailwind CSS, React Router, react-day-picker, date-fns
    
*   **Backend:** Node.js, Express, Axios
    
*   **APIs & Integrations:**
    
    *   Hostaway Reviews API (OAuth client-credentials)
        
    *   Places API
        
*   **Tooling:** concurrently, dotenv
    
   ## Local Setup

- **1) Install dependencies:** `npm install`
- **2) Configure env:** `cp .env.example .env`  
  Then open `.env` and fill values (see table below).
- **3) Start web:** `npm run dev`  
  Web: `http://localhost:5173`

**Mocking strategy**

*   USE\_MOCK=always → serve only mock properties & reviews.
    
*   USE\_MOCK=fallback → try Hostaway; if empty, merge in mock.
    
*   USE\_MOCK=off → Hostaway only.
    

## Project Structure

- `src/`
  - `api/`
    - `reviews.js` — fetchReviews, fetchApprovals, setApproval (frontend)
  - `components/`
    - `DashboardPage.jsx`
    - `PropertyPage.jsx`
    - `BookingSidebar.jsx`
    - `ReviewsModal.jsx`
    - `ReviewItem.jsx`
    - `FiltersBar.jsx`
    - `DateRangeField.jsx` — single-field range picker (shared w/ dashboard)
    - `DateRangeInline.jsx` — kept for reuse; not required if using Field
    - `LocationMap.jsx` — Google Map
    - `Gallery.jsx` — property photo gallery
    - `Navbar.jsx`, `CardShell.jsx`, …
  - `utils/`
    - `ratings.js`, `slug.js`

- `server/`
  - `index.js` — Express API (Hostaway + mock merge)
  - `services/`
    - `approvalsStore.js` — tiny KV store for Public/Private approvals
  - `data/`
    - `properties.mock.json` — property list + photos (stable Unsplash IDs)
    - `reviews.mock.json` — realistic reviews with `propertyId` mapping
    - `approvals.json` — persisted visibility decisions (created at runtime)


Key Design & Logic Decisions
----------------------------

*   **Single source of truth for visibility:**Managers toggle a review **Public/Private**. This writes to approvalsStore as source:id → boolean. The server merges approvals into fetched reviews so both the dashboard and property page read the same truth.
    
*   **Per-property curation UX:**Dashboard lists **properties**. Each row has a **Reviews** button opening a modal filtered to that property’s reviews. Toggles are optimistic (instant UI) and then persisted via PATCH.
    
*   **Filtering model:**Dashboard supports **rating**, **category**, **channel**, and **date preset** (All time, Last 7, Last 30, This year, or **Custom**). The **single-field date range** uses a custom, Tailwind-styled popover (react-day-picker) for a consistent brand look.
    
*   **Property page parity:**Property detail page mirrors Flex Living’s feel: hero gallery, key stats, amenities, policies, sticky **Book your stay** card (also uses the same date-range popover), and a **Reviews** section that shows **approved-only** reviews.
    
*   **Google Maps integration:**Light custom loader; one marker at property.center. Works within a sticky layout.
    
*   **Mock + Hostaway fallback:**USE\_MOCK=fallback ensures the UI remains functional in sandbox environments with no live reviews.
    

API (Backend)
-------------

**Base URL:** http://localhost:4000

### GET /api/health

Health check.

### GET /api/reviews

Fetch reviews (Hostaway or mock per USE\_MOCK). Normalized shape:


- `status`: `"success"`
- `result`: array of review objects:
  - `id`: `7453`
  - `type`: `"host-to-guest"`
  - `status`: `"published"`
  - `rating`: `9.4`
  - `publicReview`: `"Shane and family are wonderful! ..."`
  - `reviewCategory`: array:
    - `category`: `"cleanliness"`
    - `rating`: `10`
  - `submittedAt`: `"2020-08-21T22:45:14Z"`
  - `guestName`: `"Shane Finkelstein"`
  - `listingName`: `"2B N1 A - 29 Shoreditch Heights"`
  - `propertyId`: `101`
  - `channel`: `"hostaway"`
  - `approved`: `true`


**Query params (optional):**limit, offset, type, statuses, reservationId, departureDateStart, departureDateEnd, sortBy, sortOrder, listingMapIds

### GET /api/approvals

Returns the raw approvals map, e.g. { "hostaway:7453": true }.

### PATCH /api/reviews/:source/:id/approval

Body: { "approved": true | false } — sets Public/Private for a single review.

Frontend Data Flow
------------------

*   **Dashboard**
    
    *   loads properties from properties.mock.json
        
    *   calls fetchReviews() → merges approvals → filters/sorts → per-property modal for toggling visibility
        
*   **Property Page**
    
    *   loads a property by slug/id → displays gallery, map, pricing
        
    *   ReviewsSection shows **approved** reviews for that property only
        

Google Reviews — Findings
-------------------------

*   A basic implementation of Google reviews was implemented for google maps usage on property detail page.
    

Running Notes
-------------

*   **Sticky UI:** Navbar and booking card use CSS sticky (non-overlapping).
    
*   **Popovers:** Rounded panels, brand hover colors, outside-click/Esc to close, minimal z-index fuss via local positioning.
    
*   **Accessibility:** Keyboardable menus/calendars, focus rings, real alt text from test data.
    

Future Enhancements
-------------------

*   Persist filters/sort to the URL (shareable views)
    
*   Paginate reviews in the modal
    
*   Google Reviews integration behind a feature flag
    
*   Basic auth for manager actions + audit log
    

Acknowledgements
----------------

*   Imagery uses stable **Unsplash** photo IDs in mocks (no randomness).
    
*   Flex Living look & feel replicated for demo purposes only.