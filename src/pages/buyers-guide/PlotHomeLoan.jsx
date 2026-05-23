import BuyersGuidePage from './BuyersGuidePage';

const data = {
  slug: 'plot-home-loan',
  breadcrumbLabel: 'Plot Loan Guide',
  title: 'Plot Loan in Hassan — Eligibility, Process & Best Banks (2026 Guide)',
  seoTitle: 'Plot Loan Eligibility & Process in Hassan Karnataka 2026 — VVVA Developer Guide',
  seoDescription: 'Complete guide to getting a plot loan in Hassan, Karnataka. Eligibility criteria, interest rates, EMI calculation, best banks, and documents required for DTCP-approved land.',
  publishedAt: '2026-02-20',
  lastUpdated: 'May 23, 2026',
  tldr: 'Plot loans (land purchase loans) are available in Hassan for DTCP-approved residential plots. SBI offers plot loans at 8.5–9.5% interest (2026 rates). Maximum loan: 70–80% of plot value. Tenure: up to 15 years. You need DTCP approval copy, EC, Khata, income proof, and bank statements to apply. VVVA Developer has tie-ups with SBI, HDFC, and Canara Bank for faster approvals.',
  sections: [
    { type: 'heading', content: 'What is a Plot Loan?' },
    { type: 'paragraph', content: 'A plot loan (also called a land purchase loan or site loan) is a loan specifically for purchasing residential plots or land. Unlike home loans, plot loans do not cover construction costs — they are purely for land acquisition. Most banks offer plot loans only for DTCP-approved or BDA-approved residential layouts.' },
    { type: 'heading', content: 'Plot Loan Interest Rates in Hassan — 2026' },
    { type: 'table', headers: ['Bank', 'Approx. Interest Rate (2026)', 'Max Tenure', 'Max LTV'], rows: [
      ['SBI (State Bank of India)', '8.50%–9.50% p.a.', '15 years', '80% of plot value'],
      ['HDFC Bank', '8.75%–9.75% p.a.', '15 years', '75% of plot value'],
      ['Canara Bank', '8.60%–9.60% p.a.', '10 years', '75% of plot value'],
      ['Axis Bank', '9.00%–10.00% p.a.', '15 years', '70% of plot value'],
      ['Bank of Baroda', '8.55%–9.55% p.a.', '15 years', '75% of plot value'],
    ]},
    { type: 'callout', label: 'Note', content: 'Interest rates change periodically based on RBI repo rate. The rates above are indicative for 2026. Contact your bank for the exact current rate before applying.' },
    { type: 'heading', content: 'Eligibility Criteria for Plot Loan' },
    { type: 'list', items: [
      'Age: 21 to 65 years (at loan maturity)',
      'Income: Minimum ₹25,000/month net income for salaried; ₹3 Lakh/year for self-employed',
      'Credit Score: CIBIL score of 700+ recommended (750+ for best rates)',
      'Employment: Minimum 2 years of salaried employment or 3 years of business',
      'Property: Must be DTCP/BDA-approved residential layout, clear title, no disputes',
      'Loan Amount: ₹5 Lakh to ₹2 Crore (varies by bank)',
    ]},
    { type: 'heading', content: 'EMI Calculator — Sample Hassan Plot Loan' },
    { type: 'table', headers: ['Plot Price', 'Loan Amount (80%)', 'Rate', 'Tenure', 'Monthly EMI'], rows: [
      ['₹20 Lakh', '₹16 Lakh', '9%', '10 yrs', '₹20,267/month'],
      ['₹30 Lakh', '₹24 Lakh', '9%', '15 yrs', '₹24,327/month'],
      ['₹50 Lakh', '₹40 Lakh', '9%', '15 yrs', '₹40,545/month'],
      ['₹80 Lakh', '₹60 Lakh', '9.5%', '15 yrs', '₹62,706/month'],
    ]},
    { type: 'heading', content: 'Documents Required for Plot Loan Application' },
    { type: 'list', items: [
      'KYC: Aadhaar card, PAN card, passport-size photos',
      'Income Proof: Last 3 months salary slips (salaried) OR ITR for 2 years (self-employed)',
      'Bank Statements: Last 6 months',
      'Property Documents: DTCP approval copy, EC, Khata extract, latest tax receipt',
      'Sale Agreement: Registered sale agreement between buyer and seller',
      'No Objection Certificate (NOC) from seller (if under mortgage)',
    ]},
    { type: 'heading', content: 'VVVA Developer Bank Tie-ups in Hassan' },
    { type: 'paragraph', content: 'VVVA Developer has formal tie-ups with SBI Hassan Branch, HDFC Bank Hassan, and Canara Bank Hassan for faster processing of plot loans on our projects. Our dedicated loan desk can arrange pre-approved sanction letters, document collection, and bank liaison for eligible buyers — reducing the typical 15–20 day process to 7–10 days.' },
    { type: 'callout', label: 'Free Loan Assistance', content: 'VVVA Developer offers complimentary loan documentation assistance for all plot buyers. Call +91-98456-59193 to connect with our bank liaison team.' },
  ],
  relatedLinks: [
    { to: '/buyers-guide/dtcp-approval', label: 'DTCP Approval Guide' },
    { to: '/buyers-guide/stamp-duty-karnataka-2026', label: 'Stamp Duty Guide 2026' },
    { to: '/buyers-guide/nri-buying-guide', label: 'NRI Buying Guide' },
    { to: '/locations/hassan', label: 'Plots in Hassan' },
    { to: '/price-list', label: 'Live Price List' },
  ],
};

export default function PlotHomeLoan() {
  return <BuyersGuidePage data={data} />;
}
