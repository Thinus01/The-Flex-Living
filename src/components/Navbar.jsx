import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// sticky navbar with scroll state
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false); // scroll style toggle

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10); // set scrolled flag
    onScroll(); // hydrate initial state
    window.addEventListener("scroll", onScroll, { passive: true }); // attach listener
    return () => window.removeEventListener("scroll", onScroll); // cleanup listener
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-teal-900 text-white shadow-md" : "bg-white text-slate-900 shadow-sm"
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* brand logo and name */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/theflexliving_logo.jpg"
            alt="The Flex"
            className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-sm"
            loading="eager"
            fetchpriority="high"
          />
          <span className="leading-none font-semibold tracking-tight text-xl sm:text-2xl">
            the flex.
          </span>
        </Link>

        {/* primary nav links */}
        <nav className="flex items-center gap-7 text-base sm:text-lg">
          <Link className="hover:opacity-80" to="/landlords">Landlords</Link>
          <Link className="hover:opacity-80" to="/about">About Us</Link>
          <Link className="hover:opacity-80" to="/careers">Careers</Link>
          <Link className="hover:opacity-80" to="/contact">Contact</Link>
          <span className="hidden sm:inline-block opacity-70">English</span>
          <span className="hidden sm:inline-block opacity-70">GBP</span>
        </nav>
      </div>
    </header>
  );
}
