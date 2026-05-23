import BuyersGuidePage from './BuyersGuidePage';

const data = {
  slug: 'dtcp-approval',
  breadcrumbLabel: 'DTCP Approval Guide',
  title: 'DTCP Approved Plots in Hassan — How to Verify (2026 Guide)',
  seoTitle: 'DTCP Approved Plots Hassan — How to Verify Before Buying 2026',
  seoDescription: 'Complete guide to DTCP-approved plots in Hassan, Karnataka. Learn what DTCP approval means, how to verify it, documents to check, and why it matters for bank loans.',
  publishedAt: '2026-01-15',
  lastUpdated: 'May 23, 2026',
  tldr: 'DTCP (Directorate of Town and Country Planning) approval means a residential layout has been officially sanctioned by Karnataka\'s town planning authority. All DTCP-approved plots in Hassan are eligible for home loans from SBI, HDFC, and other banks. To verify: check the layout plan approval order from the Hassan DC office or DTCP Karnataka website. VVVA Developer provides DTCP approval copies for all projects.',
  sections: [
    { type: 'heading', content: 'What is DTCP Approval?' },
    { type: 'paragraph', content: 'DTCP stands for Directorate of Town and Country Planning — the Karnataka government authority responsible for approving residential and commercial layouts in areas falling outside BBMP/BDA jurisdiction. For Hassan district, layout approvals are processed by the Hassan District Collector\'s office under DTCP guidelines.' },
    { type: 'paragraph', content: 'When a developer seeks DTCP approval, they submit the layout plan showing plot dimensions, road widths, common amenities, drainage, and open spaces. The DTCP officer inspects the land, verifies title documents, checks zoning compliance, and issues an approval order (called a "layout sanction letter"). Only after this approval can the developer legally sell individual plots.' },
    { type: 'heading', content: 'Why DTCP Approval Matters' },
    { type: 'list', items: [
      'Bank Loan Eligibility: SBI, HDFC, Axis and all major banks require DTCP approval before sanctioning a plot loan or home construction loan.',
      'Legal Protection: Buying in an approved layout protects you from demolition, encroachment, or municipal action against unapproved constructions.',
      'Khata Transfer: After purchasing a DTCP-approved plot, you can get Khata transferred in your name from the local Gram Panchayat or Municipality — essential for property tax payments.',
      'Resale Value: DTCP-approved plots command 20–40% higher prices than unapproved layouts in the same area.',
      'Construction Permission: You can obtain a building construction licence only on DTCP-approved or BDA-approved plots.',
    ]},
    { type: 'heading', content: 'How to Verify DTCP Approval Before Buying' },
    { type: 'steps', steps: [
      { title: 'Ask for the Layout Approval Order', desc: 'Request the original DTCP layout sanction letter from the developer. It should have the approval order number, date, layout name, total extent, and number of plots.' },
      { title: 'Cross-check on the DTCP Karnataka Website', desc: 'Visit the official DTCP Karnataka portal (dtcp.karnataka.gov.in) and search for the layout using the approval number. All approved layouts are listed in the public database.' },
      { title: 'Verify at the Hassan DC Office', desc: 'Visit the Hassan District Collector\'s office, Town Planning section, and request a physical verification of the layout approval. This is the most authoritative check.' },
      { title: 'Check the Approved Layout Plan', desc: 'The developer should provide you with a copy of the approved layout plan. Verify that your specific plot number, dimensions, and road-facing direction match the approved plan.' },
      { title: 'Review the Encumbrance Certificate (EC)', desc: 'Obtain an EC from the sub-registrar for the survey number of the land. An EC shows all transactions (mortgages, sale deeds) registered on the land — ensuring it is free of encumbrances.' },
      { title: 'Consult a Property Lawyer', desc: 'For purchases above ₹25 Lakh, engage a property lawyer (advocate) to verify all documents including Mother Deed, Sale Deed chain, Khata, and DTCP approval.' },
    ]},
    { type: 'heading', content: 'DTCP vs. BMRDA vs. BDA — What\'s the Difference?' },
    { type: 'table', headers: ['Authority', 'Jurisdiction', 'Applicable for'], rows: [
      ['BDA (Bangalore Development Authority)', 'Bengaluru city and close suburbs', 'Bengaluru metropolitan area layouts'],
      ['BMRDA (Bangalore Metropolitan Region Development Authority)', 'Greater Bengaluru Region (within 60 km)', 'Peri-urban Bengaluru ring areas'],
      ['DTCP (Directorate of Town and Country Planning)', 'All other Karnataka districts', 'Hassan, Mysuru, Shivamogga, Tumakuru and all other districts'],
    ]},
    { type: 'callout', label: 'Hassan Specific', content: 'All residential layouts in Hassan city and Hassan district (outside BBMP limits) require DTCP approval from the Hassan District Collector\'s office. VVVA Developer has obtained DTCP approval for all its Hassan projects and can provide certified copies on request.' },
    { type: 'heading', content: 'Red Flags to Watch Out For' },
    { type: 'list', items: [
      'Developer cannot produce the original layout approval order',
      'Approval is "pending" or "in process" — never buy in a layout that lacks approval',
      'Layout was approved for agricultural use, not residential',
      'Plots are in a revenue survey number that is in litigation or dispute',
      'Developer pressures you to register quickly "before prices go up" without providing documents',
      'The layout plan does not show minimum 9-metre road widths as required by DTCP norms',
    ]},
    { type: 'heading', content: 'DTCP Requirements for Residential Layouts in Karnataka' },
    { type: 'table', headers: ['Requirement', 'Minimum Standard'], rows: [
      ['Internal road width', '9 metres (for layouts above 2 acres)'],
      ['Open space / parks', '15% of total layout area'],
      ['Civic amenity sites', '5% of total layout area'],
      ['Plot size minimum', '600 sqft (DTCP standard for affordable housing)'],
      ['Drainage system', 'Underground drainage or storm water drain required'],
    ]},
  ],
  relatedLinks: [
    { to: '/buyers-guide/khata-explained', label: 'Khata A vs B Explained' },
    { to: '/buyers-guide/stamp-duty-karnataka-2026', label: 'Stamp Duty Guide 2026' },
    { to: '/buyers-guide/plot-home-loan', label: 'Plot Loan Guide' },
    { to: '/locations/hassan', label: 'Plots in Hassan' },
    { to: '/faq', label: 'All Frequently Asked Questions' },
    { to: '/projects', label: 'View VVVA Developer Projects' },
  ],
};

export default function DtcpApproval() {
  return <BuyersGuidePage data={data} />;
}
