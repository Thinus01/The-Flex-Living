export const property = {
  title: "Stylish 2 Bed Apartment in Lewisham",
  photos: [
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584622822202-9b31037a5b61?q=80&w=1200&auto=format&fit=crop",
  ],
  stats: { guests: 5, bedrooms: 2, bathrooms: 2, beds: 3 },
  about:
    "Welcome to my bright and spacious apartment in Lewisham! As your host, I’ve put a lot of care into making sure everything is just right for you. The location is perfect — you’re close to everything, from excellent transport links to local shops and cafes. Inside, you’ll find a roomy layout and high-quality finishes throughout.",
  amenities: [
    "Cable TV","Internet","Wireless","Kitchen","Washing Machine","Elevator",
    "Hair Dryer","Heating","Smoke Detector"
  ],
  policies: {
    checkin: "3:00 PM",
    checkout: "10:00 AM",
    rules: ["No smoking","No pets","No parties or events","Security deposit required"],
    cancellation: [
      {
        title: "For stays less than 28 days",
        points: [
          "Full refund up to 14 days before check-in",
          "No refund for bookings less than 14 days before check-in",
        ],
      },
      {
        title: "For stays of 28 days or more",
        points: [
          "Full refund up to 30 days before check-in",
          "No refund for bookings less than 30 days before check-in",
        ],
      },
    ],
  },
  pricing: { base: 3187, discount: 478, cleaning: 100, total: 2809 },
  map: { center: { lat: 51.464, lng: -0.013 } },
};
