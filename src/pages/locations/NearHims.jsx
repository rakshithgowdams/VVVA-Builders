import LocationPage from './LocationPage';

const data = {
  slug: 'near-hims',
  name: 'Near HIMS Hospital Hassan',
  seoTitle: 'Residential Plots Near HIMS Hospital Hassan — DTCP Approved 2026',
  seoDescription: 'Buy DTCP-approved plots near HIMS (Hassan Institute of Medical Sciences) hospital. Ideal for doctors, nurses, and medical staff. VVVA Developer. +91-98456-59193.',
  h1: 'Residential Plots Near HIMS Hospital Hassan — 2026 Guide',
  heroSub: 'Prime residential locations close to Hassan\'s major government medical college and hospital.',
  quickAnswer: 'HIMS (Hassan Institute of Medical Sciences) is one of Karnataka\'s major government medical colleges located on the Mysuru Road in Hassan. VVVA Developer offers DTCP-approved residential plots within 3–7 km of HIMS, ideal for medical professionals, government staff, and investors. Starting from ₹18 Lakh.',
  mapLat: 12.9800,
  mapLng: 76.0800,
  lastUpdated: 'May 23, 2026',
  introParagraphs: [
    'Hassan Institute of Medical Sciences (HIMS) is one of Karnataka\'s major government medical colleges and hospital complexes, located in the southern part of Hassan city. HIMS employs hundreds of doctors, nurses, administrative staff, and support workers — all of whom require quality housing near the campus.',
    'Residential demand near HIMS has been consistently strong since its establishment, with medical professionals preferring to live within a 5-km radius for convenience and emergency response times. This institutional anchor makes nearby plots one of the most recession-proof investment options in Hassan.',
    'VVVA Developer has developed multiple DTCP-approved residential layouts in the HIMS corridor, offering plots with proximity to the hospital, good road access, and all infrastructure amenities including underground drainage and street lighting.',
  ],
  whyInvestParagraphs: [
    'Institutional anchors like government hospitals create permanent, stable residential demand that is independent of market cycles. HIMS Hassan employs over 1,500 people directly and supports thousands more through its student medical community. Plots near such anchors rarely see price corrections and appreciate steadily.',
  ],
  whyInvestPoints: [
    'HIMS employs 1,500+ medical professionals — sustained rental and purchase demand',
    'Medical PG students create strong rental income opportunities',
    'Government institution ensures long-term stability of demand',
    'Proximity to Mysuru Road — good connectivity to city centre',
    'Strong appreciation 2019–2024: 30–45% in HIMS corridor',
    'DTCP-approved layouts with full documentation',
  ],
  landmarks: [
    { name: 'HIMS Hassan (Government Medical College)', desc: 'Hassan Institute of Medical Sciences — major government medical college with 100+ specialist doctors, 500+ bed hospital, and PG medical program.' },
    { name: 'Mysuru Road (Hassan)', desc: 'The main arterial road connecting HIMS to Hassan city centre, well-served by KSRTC buses and auto-rickshaws.' },
    { name: 'Hassan District Hospital', desc: 'Adjacent to HIMS, the district general hospital serving Hassan population with casualty, general wards, and specialty clinics.' },
  ],
  distances: [
    { place: 'HIMS Hospital', distance: '1–5 km', time: '5–10 mins (varies by plot)' },
    { place: 'Hassan City Centre', distance: '5–7 km', time: '10–15 mins' },
    { place: 'MCE College', distance: '6 km', time: '12 mins' },
    { place: 'Hassan Railway Station', distance: '7 km', time: '15 mins' },
    { place: 'Bengaluru', distance: '187 km', time: '3.5 hrs' },
  ],
  faqs: [
    {
      question: 'Are there DTCP-approved plots near HIMS Hassan?',
      answer: 'Yes. VVVA Developer has DTCP-approved residential layouts within 3–7 km of HIMS Hospital. All layouts have clear titles, proper road access, and are eligible for bank loans.',
    },
    {
      question: 'What is the plot price near HIMS Hassan in 2026?',
      answer: 'Plot prices in the HIMS corridor range from ₹1,200 to ₹2,400/sqft. VVVA Developer plots near HIMS start from ₹18 Lakh for 600 sqft sites. Prices command a premium due to institutional demand.',
    },
    {
      question: 'Is buying a plot near HIMS a good investment?',
      answer: 'Yes. Institutional anchors like government hospitals create permanent residential demand. The HIMS corridor has seen 30–45% appreciation since 2019. Rental yields are also higher here due to medical student and staff demand.',
    },
  ],
  relatedLinks: [
    { to: '/locations/hassan', label: 'All Plots in Hassan' },
    { to: '/locations/near-hassan-bypass', label: 'Plots Near Hassan Bypass' },
    { to: '/locations/near-railway-station', label: 'Plots Near Railway Station' },
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/projects', label: 'View All Projects' },
  ],
};

export default function NearHims() {
  return <LocationPage data={data} />;
}
