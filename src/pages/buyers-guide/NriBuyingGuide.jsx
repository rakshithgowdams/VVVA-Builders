import BuyersGuidePage from './BuyersGuidePage';

const data = {
  slug: 'nri-buying-guide',
  breadcrumbLabel: 'NRI Buying Guide',
  title: 'NRI Guide to Buying Residential Plots in Hassan, Karnataka (2026)',
  seoTitle: 'NRI Guide: Buy Plots in Hassan Karnataka 2026 — FEMA, Documents, Process',
  seoDescription: 'Complete NRI guide to buying residential plots in Hassan, Karnataka. FEMA rules, POA, TDS, NRE/NRO account usage, repatriation, and VVVA Developer NRI services.',
  publishedAt: '2026-03-01',
  lastUpdated: 'May 23, 2026',
  tldr: 'NRIs (Non-Resident Indians) can freely purchase residential plots in India (including Hassan) without RBI permission under FEMA. Agricultural land, plantation land, and farmhouses require prior RBI approval. You need a valid Indian passport, PAN card, NRE/NRO bank account, and a Power of Attorney if buying remotely. VVVA Developer has dedicated NRI services for Hassan district plots.',
  sections: [
    { type: 'heading', content: 'Can NRIs Buy Plots in Hassan?' },
    { type: 'paragraph', content: 'Yes. Under FEMA (Foreign Exchange Management Act), Non-Resident Indians (NRIs) with Indian passports can purchase residential plots in India, including Hassan, Karnataka, without any prior permission from the Reserve Bank of India. This is a general permission that applies to all NRI residential property purchases.' },
    { type: 'callout', label: 'Important Restriction', content: 'NRIs cannot purchase agricultural land, plantation land, or farmhouses in India without prior RBI approval. All VVVA Developer plots are residential (non-agricultural) DTCP-approved sites — fully eligible for NRI purchase.' },
    { type: 'heading', content: 'FEMA Rules for NRI Property Purchase' },
    { type: 'list', items: [
      'NRIs can buy unlimited residential plots — no cap on number of properties',
      'Payment must be through NRE (Non-Resident External) or NRO (Non-Resident Ordinary) bank accounts, or by inward remittance through normal banking channels',
      'Cash payments are NOT allowed — all transactions must be through banking channels',
      'Foreign currency accounts can be used — FCNR accounts permitted',
      'The property must be for residential use (not agricultural)',
    ]},
    { type: 'heading', content: 'Can NRIs Buy Remotely Without Visiting Hassan?' },
    { type: 'paragraph', content: 'Yes. NRIs who cannot visit India can authorise a trusted person (family member, advocate, or VVVA Developer\'s authorised representative) to complete the purchase on their behalf through a Power of Attorney (POA). The POA must be executed, notarised, and apostilled (or attested by the Indian Embassy) in the country of residence before being used in India.' },
    { type: 'steps', steps: [
      { title: 'Execute Power of Attorney (POA)', desc: 'Prepare a specific POA authorising your representative to: purchase a specific plot, sign sale agreement, pay stamp duty, and complete registration. Have it notarised by a local notary in your country of residence.' },
      { title: 'Apostille or Embassy Attestation', desc: 'Get the POA apostilled (for Hague Convention countries like USA, UK, UAE, Canada) or attested by the Indian Embassy/Consulate in your country.' },
      { title: 'Send Original POA to India', desc: 'Send the original apostilled POA to your representative in Hassan (by courier). Adjudication (stamp duty payment on POA) is done in India by the representative.' },
      { title: 'Finalise Plot Selection Virtually', desc: 'VVVA Developer offers video calls, 3D site walkthroughs, and detailed documentation for remote buyers. Our NRI desk coordinates all communication in your time zone.' },
      { title: 'Payment via NRE/NRO Account', desc: 'Make the plot payment from your NRE or NRO account to the developer\'s account. Ensure you receive proper receipts for all payments for repatriation compliance.' },
      { title: 'Registration via POA Holder', desc: 'Your POA holder completes the registration at the Hassan Sub-Registrar\'s office. The registered sale deed is couriered to you internationally.' },
    ]},
    { type: 'heading', content: 'TDS on NRI Property Purchase in India (2026)' },
    { type: 'paragraph', content: 'Under Indian Income Tax law, when an NRI sells property in India, the buyer must deduct TDS (Tax Deducted at Source) from the sale consideration. However, when an NRI buys a new plot from a developer (first sale), TDS rules depend on the developer\'s residency status — typically developers are resident Indians so standard TDS rules apply (1% TDS if value > ₹50 Lakh for resident-to-resident transactions).' },
    { type: 'table', headers: ['Transaction Type', 'TDS Rate'], rows: [
      ['NRI buys from Resident Indian developer', '1% of sale consideration (if > ₹50L)'],
      ['NRI sells to Indian buyer (future resale)', '20% TDS on capital gains (LTCG)'],
      ['NRI sells to NRI buyer', '20% TDS on capital gains'],
    ]},
    { type: 'heading', content: 'Repatriation of Sale Proceeds' },
    { type: 'paragraph', content: 'NRIs can repatriate the sale proceeds from selling a residential plot in India, subject to FEMA limits. Up to 2 residential property sales can be fully repatriated per lifetime (1 million USD limit per year). The repatriation requires a CA certificate (Form 15CA/15CB) confirming tax compliance. VVVA Developer\'s partner CAs assist NRI buyers with this documentation.' },
    { type: 'heading', content: 'VVVA Developer NRI Services' },
    { type: 'list', items: [
      'Dedicated NRI relationship manager (English + Kannada + Hindi)',
      'Video call site tours at your convenience — any time zone',
      'Virtual documentation review and legal due diligence support',
      'POA drafting assistance and notarisation guidance',
      'Bank account opening guidance for NRE/NRO accounts',
      'Post-purchase services: Khata transfer, property tax, utility connections',
      'Rental management if you want rental income while abroad',
    ]},
  ],
  relatedLinks: [
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/buyers-guide/stamp-duty-karnataka-2026', label: 'Stamp Duty Guide' },
    { to: '/buyers-guide/plot-home-loan', label: 'Plot Loan Guide' },
    { to: '/locations/hassan', label: 'Plots in Hassan' },
    { to: '/contact', label: 'Contact NRI Desk' },
  ],
};

export default function NriBuyingGuide() {
  return <BuyersGuidePage data={data} />;
}
