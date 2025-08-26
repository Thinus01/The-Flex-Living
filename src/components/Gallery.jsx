// gallery layout component
export default function Gallery({ photos = [] }) {
  const hero = photos[0]; // hero image
  const thumbs = photos.slice(1, 5); // first four thumbs

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* hero image area */}
      <div className="lg:col-span-2 h-[420px] rounded-xl overflow-hidden bg-slate-100">
        {hero && (
          <img
            src={hero.src}
            alt={hero.alt || "Property photo"}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* thumbnails column */}
      <div className="grid grid-rows-2 gap-3">
        {/* top thumbs row */}
        <div className="grid grid-cols-2 gap-3">
          {thumbs[0] && <ImgBox src={thumbs[0].src} alt={thumbs[0].alt} />}
          {thumbs[1] && <ImgBox src={thumbs[1].src} alt={thumbs[1].alt} />}
        </div>

        {/* bottom thumbs row */}
        <div className="grid grid-cols-2 gap-3">
          {thumbs[2] && <ImgBox src={thumbs[2].src} alt={thumbs[2].alt} />}
          {thumbs[3] && (
            <div className="relative">
              <ImgBox src={thumbs[3].src} alt={thumbs[3].alt} />
              {/* view all button */}
              <button
                className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-2 text-sm font-medium shadow"
                type="button"
              >
                <span className="mr-2 inline-block align-[-2px]">⤢</span> View all photos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// thumbnail image box
function ImgBox({ src, alt }) {
  return (
    <div className="h-[204px] rounded-xl overflow-hidden bg-slate-100">
      <img
        src={src}
        alt={alt || "Property photo"}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
