export const toSlug = (s = "") =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

export const fromSlug = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
