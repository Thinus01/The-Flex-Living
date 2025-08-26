let loadingPromise; // shared loading promise

export function loadGoogleMaps(apiKey) {
  // already loaded return
  if (typeof window !== "undefined" && window.google?.maps?.Map) {
    return Promise.resolve();
  }

  // create singleton promise
  if (!loadingPromise) {
    loadingPromise = new Promise((resolve, reject) => {
      // reuse existing script
      const existing = document.querySelector("script[data-google-maps]");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        return;
      }

      // inject new script
      const s = document.createElement("script");
      s.async = true;
      s.defer = true;
      s.dataset.googleMaps = "true";
      s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async&libraries=marker`;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(s);
    });
  }
  // return shared promise
  return loadingPromise;
}
