import LocationPage from './LocationPage';

const data = {
  slug: 'channarayapatna',
  name: 'Channarayapatna',
  seoTitle: 'Plots in Channarayapatna Near Hassan — DTCP Approved Sites 2026',
  seoDescription: 'DTCP approved residential plots in Channarayapatna, Hassan district. VVVA Developer offers affordable sites near Bengaluru-Mangaluru highway. Call +91-98456-59193.',
  h1: 'Residential Plots in Channarayapatna Near Hassan — 2026 Guide',
  heroSub: 'Affordable DTCP-approved plots in Channarayapatna with excellent NH-75 highway connectivity.',
  quickAnswer: 'Channarayapatna (C.N. Patna) is a taluk town in Hassan district, Karnataka, located on NH-75 between Hassan and Bengaluru. VVVA Developer offers DTCP-approved residential plots here starting from ₹12 Lakh. The town is known for Shettihalli Church and Javagal Sri Rama Temple. Plot prices range from ₹700–₹1,400/sqft.',
  mapLat: 12.9002,
  mapLng: 76.2002,
  lastUpdated: 'May 23, 2026',
  introParagraphs: [
    'Channarayapatna (locally known as C.N. Patna) is a taluk headquarters in Hassan district, located approximately 40 km from Hassan city on NH-75. The town sits at the intersection of the Bengaluru–Mangaluru highway and the Mysuru–Hassan road, giving it exceptional connectivity to major urban centres.',
    'C.N. Patna is historically significant as the site of Javagal Sri Rama Temple and is the nearest town to the famous Shettihalli Rosary Church — one of Karnataka\'s most photographed heritage monuments. This heritage appeal drives tourism and sustains local commercial activity.',
    'The town has a growing residential demand driven by workers commuting to Hassan city (40 km, ~50 mins) and Bengaluru-bound traffic taking a stopover. Plot prices here are 20–30% lower than Hassan city, making C.N. Patna an attractive investment for budget-conscious buyers seeking Hassan district exposure.',
  ],
  whyInvestParagraphs: [
    'Channarayapatna benefits directly from the NH-75 four-laning project, which has reduced travel time to Hassan to under 50 minutes and to Bengaluru to under 3 hours. This improved connectivity is driving real estate demand from Bengaluru-based investors and NRIs looking at affordable land in Karnataka\'s growth corridors.',
  ],
  whyInvestPoints: [
    'NH-75 highway frontage — one of Karnataka\'s busiest national highways',
    'Plot prices 20–30% lower than Hassan city',
    'Proximity to Shettihalli Church — tourism economic driver',
    'KSRTC bus connectivity to Bengaluru (3 hrs), Hassan (50 mins), Mysuru (2 hrs)',
    'Industrial growth in Hassan district spilling over to nearby taluks',
    'DTCP-approved layouts with clear title and bank loan eligibility',
  ],
  landmarks: [
    { name: 'Shettihalli Rosary Church', desc: 'The iconic partially-submerged colonial church in Hemavathi Reservoir, visible only during summer. One of Karnataka\'s most photographed heritage monuments.' },
    { name: 'Javagal Sri Rama Temple', desc: 'An ancient temple dedicated to Lord Rama, located near Javagal village, attracting pilgrims from across Karnataka.' },
    { name: 'C.N. Patna Town Centre', desc: 'The commercial hub with banks, KSRTC bus stand, schools, and daily markets serving the taluk population.' },
    { name: 'NH-75 (Bengaluru–Mangaluru Highway)', desc: 'Four-lane national highway passing through Channarayapatna, providing seamless connectivity to Bengaluru (147 km) and Hassan (40 km).' },
  ],
  distances: [
    { place: 'Hassan City', distance: '40 km', time: '50 mins' },
    { place: 'Bengaluru', distance: '147 km', time: '2.5 hrs (NH-75)' },
    { place: 'Mysuru', distance: '90 km', time: '2 hrs' },
    { place: 'Shravanabelagola', distance: '33 km', time: '40 mins' },
    { place: 'Mangaluru', distance: '215 km', time: '4 hrs' },
    { place: 'Bengaluru Airport (KIA)', distance: '175 km', time: '3.5 hrs' },
  ],
  faqs: [
    {
      question: 'Is Channarayapatna a good place to buy a residential plot?',
      answer: 'Yes. C.N. Patna offers affordable DTCP-approved plots on NH-75 with excellent connectivity to Hassan and Bengaluru. Plot prices are 20–30% lower than Hassan city, offering good appreciation potential.',
    },
    {
      question: 'What is the plot price in Channarayapatna in 2026?',
      answer: 'Residential plot prices in Channarayapatna range from ₹700 to ₹1,400/sqft depending on road frontage and layout. VVVA Developer plots start from ₹12 Lakh for 600 sqft sites.',
    },
    {
      question: 'How far is Channarayapatna from Hassan?',
      answer: 'Channarayapatna is approximately 40 km from Hassan city via NH-75, roughly a 50-minute drive.',
    },
    {
      question: 'Are VVVA Developer plots in Channarayapatna DTCP-approved?',
      answer: 'Yes. All VVVA Developer plots in Channarayapatna are DTCP-approved by the Hassan DC office and RERA-registered, making them eligible for bank loans and legally clear for registration.',
    },
    {
      question: 'Is Channarayapatna close to the famous Shettihalli Church?',
      answer: 'Yes. The Shettihalli Rosary Church is approximately 15 km from Channarayapatna town, making the area popular among tourism-oriented investors.',
    },
  ],
  relatedLinks: [
    { to: '/locations/hassan', label: 'Plots in Hassan City' },
    { to: '/locations/holenarasipura', label: 'Plots in Holenarasipura' },
    { to: '/locations/arsikere', label: 'Plots in Arsikere' },
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Explained' },
    { to: '/buyers-guide/stamp-duty-karnataka-2026', label: 'Stamp Duty Guide 2026' },
    { to: '/projects', label: 'View All Projects' },
  ],
};

export default function Channarayapatna() {
  return <LocationPage data={data} />;
}
