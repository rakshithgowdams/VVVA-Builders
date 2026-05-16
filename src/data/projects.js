const DIMS = [
  "20×30","20×40","30×40","30×50","30×60","40×40","40×60","40×80","50×80","60×80","70×80","80×100","100×80","100×100"
];
const DIRS = ["North","North East","East","South East","South","South West","West","North West"];
const STATUSES = ["available","available","available","available","available","booked","booked","sold"];

function generateSlots(count, startBiteNo, basePrice) {
  return Array.from({ length: count }, (_, i) => {
    const dim = DIMS[i % DIMS.length];
    const [w, h] = dim.split("×").map(Number);
    const sqft = w * h;
    const priceVal = basePrice + Math.round((sqft / 1200) * 5) * 2;
    const status = STATUSES[i % STATUSES.length];
    const dir = DIRS[i % DIRS.length];
    return {
      id: i + 1,
      dimensions: dim,
      status,
      biteNo: startBiteNo + i,
      direction: dir,
      price: `₹${priceVal} Lakhs`,
      measurement: `${sqft} sqft`,
      details: `${dir}-facing plot, ${sqft} sqft`,
    };
  });
}

const GALLERY_IMAGES = [
  '/gallery-1.webp',
  '/gallery-2.webp',
  '/gallery-3.webp',
  '/gallery-4.webp',
  '/gallery-5.webp',
  '/gallery-6.webp',
  '/gallery-7.webp',
  '/gallery-8.webp',
  '/gallery-9.webp',
  '/gallery-1.webp',
  '/gallery-2.webp',
  '/gallery-3.webp',
  '/gallery-4.webp',
  '/gallery-5.webp',
  '/gallery-6.webp',
  '/gallery-7.webp',
  '/gallery-8.webp',
  '/gallery-9.webp',
];

export const projects = [
  {
    id: 1,
    name: "Bhoovanahalli Layout",
    location: "Bengaluru East",
    status: "open",
    cardImage: '/bhoovanahalli-project.jpeg',
    siteImage: '/site-layout.webp',
    images: GALLERY_IMAGES,
    plotSlots: generateSlots(50, 101, 18),
    mapCoordinates: { lat: 12.9716, lng: 77.6412 }
  },
  {
    id: 2,
    name: "Sarjapur Enclave",
    location: "Sarjapur Road",
    status: "future",
    cardImage: '/gallery-4.webp',
    siteImage: '/site-layout.webp',
    images: GALLERY_IMAGES,
    plotSlots: generateSlots(50, 201, 22),
    mapCoordinates: { lat: 12.9082, lng: 77.6855 }
  },
  {
    id: 3,
    name: "Whitefield Heights",
    location: "Whitefield, Bengaluru",
    status: "closed",
    cardImage: '/project-card-3.webp',
    siteImage: '/site-layout.webp',
    images: GALLERY_IMAGES,
    plotSlots: [],
    mapCoordinates: { lat: 12.9698, lng: 77.7500 }
  }
];
