import BuyersGuidePage from './BuyersGuidePage';

const data = {
  slug: 'stamp-duty-karnataka-2026',
  breadcrumbLabel: 'Stamp Duty Karnataka 2026',
  title: 'Stamp Duty & Registration Charges in Karnataka 2026 — Complete Guide',
  seoTitle: 'Stamp Duty & Registration Charges Karnataka 2026 — Plot Buyers Guide',
  seoDescription: 'Stamp duty and registration charges for plots in Karnataka 2026. Latest rates, slab-wise calculation, rural vs urban differences, and Hassan-specific examples.',
  publishedAt: '2026-01-01',
  lastUpdated: 'May 23, 2026',
  tldr: 'In Karnataka, stamp duty for residential plots is 5% of the property value (for properties above ₹45 Lakh). Registration charges are 1% of property value. For a ₹30 Lakh plot in Hassan, total stamp duty + registration = approx. ₹1.8 Lakh. Women buyers get a 1% stamp duty concession in some categories.',
  sections: [
    { type: 'heading', content: 'Stamp Duty Rates in Karnataka 2026' },
    { type: 'table', headers: ['Property Value', 'Stamp Duty Rate', 'Registration Charge'], rows: [
      ['Up to ₹20 Lakh', '2%', '1%'],
      ['₹20 Lakh to ₹45 Lakh', '3%', '1%'],
      ['Above ₹45 Lakh', '5%', '1%'],
      ['Agricultural Land (revenue)', '3%', '1%'],
    ]},
    { type: 'callout', label: 'Women Buyers Discount', content: 'In Karnataka, when the property is registered in a woman\'s name or jointly with a woman as first-named buyer, the stamp duty is reduced by 1% (i.e., 4% instead of 5% for properties above ₹45 Lakh). This can save ₹20,000–₹50,000 on a typical Hassan plot.' },
    { type: 'heading', content: 'How Stamp Duty is Calculated' },
    { type: 'paragraph', content: 'Stamp duty is calculated on the higher of: (1) the actual sale consideration (the price you agreed with the seller), or (2) the Guidance Value set by the Karnataka government for that specific survey number and locality. If you pay ₹30 Lakh for a plot but the Guidance Value is ₹35 Lakh, stamp duty is calculated on ₹35 Lakh.' },
    { type: 'heading', content: 'Guidance Value in Hassan — 2026' },
    { type: 'paragraph', content: 'The Karnataka government publishes area-wise guidance values (kaveri.karnataka.gov.in) that serve as floor prices for stamp duty calculation. Guidance values in Hassan city range from ₹800 to ₹2,500 per sqft depending on the locality and road category.' },
    { type: 'table', headers: ['Hassan Area', 'Approx. Guidance Value (2026)', 'Actual Market Price'], rows: [
      ['Salagame Road (Prime)', '₹1,800–₹2,500/sqft', '₹2,200–₹3,500/sqft'],
      ['Near Hassan Bypass', '₹1,200–₹1,800/sqft', '₹1,600–₹2,800/sqft'],
      ['HIMS Corridor', '₹1,000–₹1,500/sqft', '₹1,400–₹2,400/sqft'],
      ['Outskirts / New Layouts', '₹600–₹1,000/sqft', '₹900–₹1,600/sqft'],
    ]},
    { type: 'heading', content: 'Registration Process — Step by Step' },
    { type: 'steps', steps: [
      { title: 'Obtain Encumbrance Certificate (EC)', desc: 'Get an EC from the sub-registrar\'s office for the past 13 years (minimum) for the survey number. This confirms the land is free of encumbrances.' },
      { title: 'Get Guidance Value from Kaveri Portal', desc: 'Visit kaveri.karnataka.gov.in and look up the guidance value for the specific survey number and area. This determines your minimum stamp duty base.' },
      { title: 'Draft the Sale Deed', desc: 'Engage a document writer (doc writer) registered with the sub-registrar\'s office to draft the sale deed. The deed should include seller details, buyer details, property description, survey number, and consideration amount.' },
      { title: 'Pay Stamp Duty and Registration Fee', desc: 'Pay stamp duty and registration fees online at payment.igr.karnataka.gov.in or at the sub-registrar\'s office cashier. Keep the challan for the appointment booking.' },
      { title: 'Book an Appointment at Sub-Registrar', desc: 'Book a slot at the Hassan Sub-Registrar\'s office online (kaveri.karnataka.gov.in). Both buyer and seller must be present with Aadhaar and PAN cards.' },
      { title: 'Registration and Thumb Impression', desc: 'On the appointment date, submit all documents, give thumb impressions, sign the deed, and complete biometric verification. The registration is completed on the spot.' },
      { title: 'Collect Registered Deed', desc: 'The registered sale deed is available for collection within 3–7 working days. You can also download it from the Kaveri portal.' },
    ]},
    { type: 'heading', content: 'Documents Required for Plot Registration in Hassan' },
    { type: 'list', items: [
      'Sale Deed (prepared by document writer)',
      'Seller\'s original title documents (Mother Deed chain)',
      'Encumbrance Certificate (EC) for 13 years',
      'Latest property tax receipt and Khata extract',
      'DTCP layout approval copy',
      'Betterment charges paid receipt (if applicable)',
      'Aadhaar card (buyer and seller)',
      'PAN card (buyer and seller)',
      'Passport-size photographs (2 each)',
      'Two witnesses with Aadhaar (optional but recommended)',
    ]},
  ],
  relatedLinks: [
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/buyers-guide/khata-explained', label: 'Khata A vs B Guide' },
    { to: '/buyers-guide/plot-home-loan', label: 'Plot Loan Guide' },
    { to: '/locations/hassan', label: 'Plots in Hassan' },
    { to: '/price-list', label: 'Live Price List' },
  ],
};

export default function StampDuty() {
  return <BuyersGuidePage data={data} />;
}
