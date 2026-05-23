import BuyersGuidePage from './BuyersGuidePage';

const data = {
  slug: 'khata-explained',
  breadcrumbLabel: 'Khata A vs B Explained',
  title: 'Khata A vs Khata B in Karnataka — Complete Guide (2026)',
  seoTitle: 'Khata A vs Khata B Karnataka Explained — Which is Better for Buying?',
  seoDescription: 'Understand the difference between Khata A and Khata B in Karnataka. Why Khata A is better for buying, how to convert Khata B to A, and what it means for your plot.',
  publishedAt: '2026-02-10',
  lastUpdated: 'May 23, 2026',
  tldr: 'In Karnataka, Khata A refers to properties in approved layouts that pay property tax to the local authority and have legal construction permission. Khata B refers to properties that pay revenue tax but lack proper layout approval. Always buy Khata A properties. VVVA Developer\'s all plots are Khata A after purchase and registration.',
  sections: [
    { type: 'heading', content: 'What is a Khata?' },
    { type: 'paragraph', content: 'Khata is a legal document issued by the Karnataka municipal authority (BBMP, CMC, TMC, or Gram Panchayat) that identifies a property owner as the "person liable to pay tax." It is essentially a property tax account maintained by the local body and is required for construction permits, utility connections, and property transactions.' },
    { type: 'heading', content: 'Khata A vs Khata B — Key Differences' },
    { type: 'table', headers: ['Feature', 'Khata A', 'Khata B'], rows: [
      ['Layout Approval Status', 'DTCP/BDA/BBMP approved layout', 'Unapproved or partially approved layout'],
      ['Construction Permission', 'Yes — building plan can be approved', 'No — no building licence issued'],
      ['Bank Loan Eligibility', 'Yes — all major banks', 'No — most banks refuse'],
      ['Property Tax', 'Full property tax to local body', 'Revenue tax to Gram Panchayat only'],
      ['Legal Status', 'Fully legal, regularised', 'Quasi-legal, not fully regularised'],
      ['Resale Value', 'Higher — more buyers, easier finance', 'Lower — limited buyer pool'],
    ]},
    { type: 'callout', label: 'Key Rule', content: 'Never buy a property with Khata B if you intend to construct a house, take a bank loan, or resell easily. Khata B means the layout is not approved by the planning authority.' },
    { type: 'heading', content: 'Why Does Khata B Exist?' },
    { type: 'paragraph', content: 'Khata B was historically issued by Karnataka gram panchayats for properties in revenue villages that had not undergone formal layout approval. Landowners who converted agricultural land to sites without DTCP approval often ended up with Khata B properties. While they pay taxes and have basic records, they lack the planning authority\'s sanction.' },
    { type: 'heading', content: 'Can Khata B Be Converted to Khata A?' },
    { type: 'paragraph', content: 'Yes, Karnataka has periodically introduced Akrama-Sakrama (regularisation) schemes allowing Khata B properties that meet certain criteria to be regularised to Khata A status upon payment of a betterment fee. However, this process is not guaranteed and is subject to policy cycles.' },
    { type: 'steps', steps: [
      { title: 'Check Regularisation Eligibility', desc: 'The property must have been developed before a cut-off date specified by the state government. Check with the DTCP or local municipal office.' },
      { title: 'Apply under Akrama-Sakrama Scheme', desc: 'Submit an application with property documents, Khata B certificate, tax receipts, and site plan to the local body.' },
      { title: 'Pay Betterment Charges', desc: 'Pay the betterment/regularisation fee calculated on the layout area and location. This varies from ₹50 to ₹300 per sqft depending on the area.' },
      { title: 'Receive Regularisation Order', desc: 'Once approved, the property is issued a regularisation order and Khata is transferred to the A register.' },
    ]},
    { type: 'heading', content: 'How to Check if a Property is Khata A or Khata B' },
    { type: 'list', items: [
      'Ask the seller for the latest Khata extract (property tax extract) — it will say "A Khata" or "B Khata" explicitly.',
      'Visit the local Gram Panchayat or CMC/TMC office and request the Khata register extract for the survey number.',
      'Check if the property has DTCP layout approval — if yes, it should qualify for Khata A.',
      'Review the Encumbrance Certificate — if property tax is paid to the planning authority (CMC/TMC), it is Khata A.',
    ]},
    { type: 'callout', label: 'VVVA Developer Guarantee', content: 'All VVVA Developer plots are sold in DTCP-approved layouts. After registration, the Khata is transferred to your name in the A register of the relevant local body. We assist all buyers with Khata transfer documentation.' },
  ],
  relatedLinks: [
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/buyers-guide/stamp-duty-karnataka-2026', label: 'Stamp Duty Guide 2026' },
    { to: '/buyers-guide/plot-home-loan', label: 'Plot Loan Guide' },
    { to: '/locations/hassan', label: 'Plots in Hassan' },
    { to: '/faq', label: 'All FAQs' },
  ],
};

export default function KhataExplained() {
  return <BuyersGuidePage data={data} />;
}
