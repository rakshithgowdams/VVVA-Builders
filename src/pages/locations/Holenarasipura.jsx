import LocationPage from './LocationPage';

const data = {
  slug: 'holenarasipura',
  name: 'Holenarasipura',
  seoTitle: 'Plots in Holenarasipura Hassan District — DTCP Approved 2026',
  seoDescription: 'Buy residential plots in Holenarasipura, Hassan district. DTCP-approved sites near Bengaluru highway. VVVA Developer — trusted since 2015. +91-98456-59193.',
  h1: 'Residential Plots in Holenarasipura, Hassan District',
  heroSub: 'Quiet, growing taluk town with excellent plot investment potential in southern Hassan district.',
  quickAnswer: 'Holenarasipura is a taluk town in Hassan district, Karnataka, approximately 30 km south of Hassan city. VVVA Developer offers DTCP-approved residential plots here starting from ₹10 Lakh. The town is known for the Gorur Dam and reservoir. Plot prices range from ₹600–₹1,200/sqft.',
  mapLat: 12.7866,
  mapLng: 76.2499,
  lastUpdated: 'May 23, 2026',
  introParagraphs: [
    'Holenarasipura is a taluk headquarters in southern Hassan district, located approximately 30 km from Hassan city. The town sits near the Gorur Reservoir (Hemavathi Dam backwaters), one of the primary water sources for Bengaluru and surrounding districts.',
    'The town has a steady residential demand driven by government employees, teachers, and agricultural community members seeking clear-titled plots with proper documentation. DTCP-approved layouts here offer exceptional affordability compared to Hassan city.',
    'VVVA Developer has been developing residential layouts in Holenarasipura taluk since 2018, with all projects receiving DTCP approval from the Hassan DC office. The clean land prices, minimal encumbrances, and growing infrastructure make this a solid long-term investment.',
  ],
  whyInvestParagraphs: [
    'Holenarasipura offers some of the most affordable DTCP-approved residential land in Hassan district. As Hassan city plots appreciate, demand naturally spills over to the nearest taluk towns, making Holenarasipura a well-positioned second-wave investment.',
  ],
  whyInvestPoints: [
    'Lowest entry-point plots in Hassan district',
    'Gorur Reservoir nearby — positive environmental and livability factor',
    'Government staff housing demand drives rental market',
    'Clean title land, no litigation history',
    'Growing connectivity via SH-57 to Hassan',
    'DTCP approval ensures bank loan eligibility',
  ],
  landmarks: [
    { name: 'Gorur Dam (Hemavathi Reservoir)', desc: 'One of Karnataka\'s major reservoirs providing water to Bengaluru. The reservoir backwaters create scenic surroundings for residential developments.' },
    { name: 'Holenarasipura Town Hall', desc: 'The administrative centre of the taluk, with courts, DC sub-office, and banking facilities.' },
    { name: 'Javagal (Cricket village)', desc: 'Birthplace of Karnataka cricket legend Javagal Srinath, approximately 15 km away — a locally celebrated landmark.' },
  ],
  distances: [
    { place: 'Hassan City', distance: '30 km', time: '40 mins' },
    { place: 'Channarayapatna', distance: '22 km', time: '30 mins' },
    { place: 'Bengaluru', distance: '168 km', time: '3 hrs' },
    { place: 'Mysuru', distance: '100 km', time: '2 hrs' },
    { place: 'Sakleshpur', distance: '55 km', time: '1.25 hrs' },
  ],
  faqs: [
    {
      question: 'What is the plot price in Holenarasipura in 2026?',
      answer: 'Residential plot prices in Holenarasipura range from ₹600 to ₹1,200/sqft. VVVA Developer plots start from ₹10 Lakh for a 600 sqft site in DTCP-approved layouts.',
    },
    {
      question: 'Are there DTCP-approved layouts in Holenarasipura?',
      answer: 'Yes. VVVA Developer\'s Holenarasipura layouts have received DTCP approval from the Hassan DC office. All documentation including layout plan, endorsement, and Khata is in order.',
    },
    {
      question: 'Is Holenarasipura suitable for retirement living?',
      answer: 'Yes. Many retirees choose Holenarasipura for its clean environment, proximity to Gorur Reservoir, lower cost of living, and proximity to Hassan city amenities (30 km). VVVA Developer has specific layouts suited for retirement homes.',
    },
  ],
  relatedLinks: [
    { to: '/locations/hassan', label: 'Plots in Hassan City' },
    { to: '/locations/channarayapatna', label: 'Plots in Channarayapatna' },
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/projects', label: 'View All Projects' },
    { to: '/buyers-guide/plot-home-loan', label: 'Plot Loan Guide' },
  ],
};

export default function Holenarasipura() {
  return <LocationPage data={data} />;
}
