import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Gallery from "../components/Gallery";
import StatPills from "../components/StatPills";
import AboutProperty from "../components/AboutProperty";
import Amenities from "../components/Amenities";
import StayPolicies from "../components/StayPolicies";
import BookingSidebar from "../components/BookingSidebar";
import LocationMap from "../components/LocationMap";
import ReviewsSection from "../components/ReviewsSection";
import { fetchProperties } from "../api/properties";

export default function PropertyPage() {
  const { slug } = useParams(); // Route slug
  const [propsData, setPropsData] = useState({ result: [] }); // Props state

  useEffect(() => { fetchProperties().then(setPropsData).catch(console.error); }, []); // Load once
  const property = useMemo(
    () => (propsData.result || []).find(p => p.slug === slug),
    [propsData, slug]
  ); // Find by slug

  if (!property) return (
    <div className="min-h-screen bg-[#f9f7f1]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <p className="text-sm text-gray-600">Property not found.</p>
      </main>
    </div>
  ); // Missing state

  return (
    <div className="min-h-screen bg-[#f9f7f1]"> {/* Page shell */}
      <Navbar /> {/* Top nav */}

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <Gallery photos={property.photos} /> {/* Photo gallery */}

        <header className="mt-6"> {/* Title block */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {property.title} {/* Property name */}
          </h1>
          <StatPills
            className="mt-3"
            stats={{
              guests: property.capacity?.guests, // Guests count
              bedrooms: property.capacity?.bedrooms, // Bedrooms count
              bathrooms: property.capacity?.bathrooms, // Bathrooms count
              beds: property.capacity?.beds, // Beds count
            }}
          />
        </header>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12"> {/* Main grid */}
          <div className="lg:col-span-8 space-y-6"> {/* Left column */}
            <AboutProperty text={property.about} /> {/* About text */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <Amenities items={property.amenities} /> // Amenities list.
            )}
            {property.policies && <StayPolicies policies={property.policies} />} {/* Policies */}
            <LocationMap center={property.center} /> {/* Map embed */}
            <ReviewsSection propertyId={property.id} /> {/* Reviews block */}
          </div>
          <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:h-fit"> {/* Sidebar */}
            <BookingSidebar pricing={property.pricing} /> {/* Booking card */}
          </aside>
        </section>
      </main>
    </div>
  );
}
