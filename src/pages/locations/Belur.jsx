import LocationPage from './LocationPage';

const data = {
  slug: 'belur',
  name: 'Belur',
  seoTitle: 'Plots in Belur Hassan District — Near Hoysala Temple Town 2026',
  seoDescription: 'Buy residential plots near Belur, Hassan district. Hoysala heritage temple town. DTCP-approved sites by VVVA Developer. Call +91-98456-59193.',
  h1: 'Residential Plots in Belur — Hoysala Heritage Town in Hassan District',
  heroSub: 'Historic temple town on the Yagachi River — ideal for retirement plots and tourism-economy investments.',
  quickAnswer: 'Belur is famous for the Chennakeshava Temple (1117 AD Hoysala architecture), located 38 km from Hassan city. VVVA Developer offers DTCP-approved residential plots near Belur starting from ₹13 Lakh. Popular among retirees and heritage tourism investors.',
  mapLat: 13.1656,
  mapLng: 75.8688,
  lastUpdated: 'May 23, 2026',
  introParagraphs: [
    'Belur is a small but historically significant town in Hassan district, globally renowned for the Chennakeshava Temple — a masterpiece of Hoysala architecture built in 1117 AD. The temple is a UNESCO World Heritage nominee and one of Karnataka\'s most visited tourist sites, drawing over 3 lakh visitors annually.',
    'Belur is located on the Yagachi River, approximately 38 km from Hassan city. Despite its small town character, it has growing residential demand driven by tourism sector employment, temple administration staff, and retirees seeking peaceful, heritage-rich surroundings.',
    'VVVA Developer\'s plots near Belur offer exceptional value for retirees and long-term investors. The clean environment, proximity to heritage sites, and the growing tourism economy create an attractive lifestyle and investment proposition.',
  ],
  whyInvestParagraphs: [
    'Belur\'s listing as a potential UNESCO World Heritage site for Hoysala temples (which includes Belur, Halebidu, and Somnathapura) has increased its global visibility and tourism appeal. This international recognition is expected to drive hospitality and residential investment in the 2025–2030 period.',
  ],
  whyInvestPoints: [
    'UNESCO World Heritage Site (Hoysala Temples) — international tourism driver',
    'Peaceful riverside town — ideal for retirement and second homes',
    'Tourism economy creating employment and service demand',
    'Yagachi Reservoir nearby — scenic and water-secure location',
    'Government tourism investment expected to improve local infrastructure',
    'Lower land prices compared to Hassan city',
  ],
  landmarks: [
    { name: 'Chennakeshava Temple (1117 AD)', desc: 'One of the finest Hoysala temples in the world. A UNESCO World Heritage nominee. The intricate stone carvings are unparalleled in Indian temple architecture.' },
    { name: 'Yagachi Dam & Reservoir', desc: 'A major reservoir near Belur providing water to Hassan district. The backwaters create scenic surroundings for residential plots.' },
    { name: 'Belur Town Market', desc: 'The main commercial area with shops, banks (SBI, Canara), KSRTC bus connectivity to Hassan and Chikkamagaluru.' },
    { name: 'Halebidu (11 km)', desc: 'Another Hoysala temple complex, 11 km from Belur. Halebidu\'s Hoysaleshwara Temple is equally magnificent, often visited together with Belur.' },
  ],
  distances: [
    { place: 'Hassan City', distance: '38 km', time: '50 mins' },
    { place: 'Halebidu', distance: '11 km', time: '15 mins' },
    { place: 'Chikkamagaluru', distance: '50 km', time: '1 hr' },
    { place: 'Bengaluru', distance: '225 km', time: '4 hrs' },
    { place: 'Sakleshpur', distance: '55 km', time: '1.25 hrs' },
  ],
  faqs: [
    {
      question: 'Is Belur a good place for a retirement home?',
      answer: 'Yes. Belur\'s peaceful atmosphere, heritage surroundings, clean environment, and proximity to Hassan city (38 km) make it popular among retirees. VVVA Developer has plots suited for retirement homes with good road connectivity.',
    },
    {
      question: 'What is the plot price near Belur in 2026?',
      answer: 'Residential plot prices near Belur range from ₹750 to ₹1,400/sqft. VVVA Developer plots start from ₹13 Lakh for 600 sqft DTCP-approved sites.',
    },
  ],
  relatedLinks: [
    { to: '/locations/hassan', label: 'Plots in Hassan City' },
    { to: '/locations/sakleshpur', label: 'Plots in Sakleshpur' },
    { to: '/locations/holenarasipura', label: 'Plots in Holenarasipura' },
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/projects', label: 'View All Projects' },
  ],
};

export default function Belur() {
  return <LocationPage data={data} />;
}
