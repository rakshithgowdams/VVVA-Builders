import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../seo/Seo';
import { makeFAQSchema, makeBreadcrumbSchema } from '../seo/schema';

const FAQS = [
  {
    category: 'About VVVA Developer',
    questions: [
      { q: 'How long has VVVA Developer been operating?', a: 'VVVA Developer was founded in 2015 and has been operating for over 10 years. We have completed 50+ residential layout projects across Hassan district, Karnataka.' },
      { q: 'Are VVVA Developer plots RERA-registered?', a: 'Yes. All VVVA Developer projects are RERA-registered under the Karnataka RERA authority. We provide RERA registration numbers for every project on request.' },
      { q: 'Where is the VVVA Developer office?', a: 'Our office is at Opp Canara Bank, Near MCE College, Salagame Road, Hassan – 573201, Karnataka. We are open Monday to Saturday, 9 AM to 7 PM.' },
      { q: 'How many families have bought plots from VVVA Developer?', a: 'Over 500 families have purchased plots from VVVA Developer since 2015. Many have built homes on our plots and continue to refer friends and family.' },
    ],
  },
  {
    category: 'Plots & Projects',
    questions: [
      { q: 'What types of plots does VVVA Developer offer?', a: 'We offer DTCP-approved residential plots ranging from 600 sqft to 2400 sqft in gated and open layouts. All plots come with proper roads, drainage, street lighting, and complete documentation.' },
      { q: 'What are the available plot sizes?', a: 'Common sizes available: 600 sqft (20×30), 720 sqft (24×30), 900 sqft (30×30), 1200 sqft (30×40), 1500 sqft (30×50), 1800 sqft (30×60), 2400 sqft (40×60). Specific sizes vary by project.' },
      { q: 'What is the price range for VVVA Developer plots?', a: 'Prices range from ₹10 Lakh (Holenarasipura) to ₹50+ Lakh (Hassan city prime) depending on location, size, and road facing. Call +91-98456-59193 for exact current pricing.' },
      { q: 'Are the plots North/East facing?', a: 'Each project has a mix of North, East, South, and West-facing plots. East and North-facing plots are typically priced 5–10% higher. You can select your preferred facing during site visit.' },
      { q: 'Are all plots corner plots?', a: 'Not all plots are corner plots. Corner plots command a 5–15% premium. We clearly mark corner plots in the layout plan and provide this information during your site visit.' },
    ],
  },
  {
    category: 'Legal & Documentation',
    questions: [
      { q: 'What documents do I receive after purchasing a VVVA Developer plot?', a: 'You receive: Sale Deed, Mother Deed chain, Encumbrance Certificate (EC), DTCP layout approval copy, Khata extract, Betterment charges receipt, and property tax receipts. A complete, bank-eligible documentation package.' },
      { q: 'What is DTCP approval and why is it important?', a: 'DTCP (Directorate of Town and Country Planning) approval is the Karnataka government\'s official sanction of a residential layout. It ensures legal compliance, bank loan eligibility, and protection against municipal action. All VVVA Developer plots are DTCP-approved.' },
      { q: 'What is Khata and will I get Khata A after purchase?', a: 'Khata is a property tax account with the local municipal authority. Khata A indicates an approved layout. After purchasing a VVVA Developer plot and completing registration, Khata is transferred to your name in the A register. We assist with this process.' },
      { q: 'Is there any litigation on VVVA Developer plots?', a: 'No. We verify all plots for litigation, dispute, and encumbrance before selling. VVVA Developer maintains a zero legal dispute record across all 500+ plot registrations.' },
    ],
  },
  {
    category: 'Buying Process',
    questions: [
      { q: 'How do I book a site visit?', a: 'Call +91-98456-59193 or +91-72044-01456, or fill the form on our website. We arrange free site visits Monday through Saturday, typically within 24–48 hours of your call.' },
      { q: 'What is the booking process?', a: 'Step 1: Site visit and plot selection. Step 2: Pay booking advance (typically ₹50,000–₹1,00,000). Step 3: Sale Agreement is executed. Step 4: Full payment (or loan disbursement). Step 5: Registration at Sub-Registrar\'s office. Total process: 30–45 days typically.' },
      { q: 'Is there a reservation for women buyers or senior citizens?', a: 'There is no reservation on specific plots, but women buyers in Karnataka get a 1% reduction in stamp duty. Senior citizens may qualify for certain bank loan concessions. VVVA Developer offers equal service to all buyers.' },
    ],
  },
  {
    category: 'Finance & Loans',
    questions: [
      { q: 'Can I get a bank loan for a VVVA Developer plot?', a: 'Yes. All VVVA Developer plots are DTCP-approved and eligible for plot loans. We have tie-ups with SBI, HDFC, and Canara Bank for faster approvals. Maximum loan: 80% of plot value. Tenure: up to 15 years.' },
      { q: 'What is the interest rate for plot loans in 2026?', a: 'Plot loan interest rates in 2026 range from 8.5% to 10% per annum depending on the bank and your credit profile. SBI typically offers the lowest rates. Contact us for current rates from our partner banks.' },
      { q: 'Can I buy a plot in instalments?', a: 'Yes. VVVA Developer offers flexible payment plans: 20% at booking, 30% at layout approval, and balance at registration. EMI-based construction-linked plans are also available for select projects.' },
    ],
  },
  {
    category: 'NRI Buyers',
    questions: [
      { q: 'Can NRIs buy plots from VVVA Developer?', a: 'Yes. NRIs with Indian passports can freely purchase residential plots in Hassan under FEMA without RBI permission. VVVA Developer has a dedicated NRI desk with video call site tours, POA assistance, and international payment guidance.' },
      { q: 'Do NRIs need to visit Hassan for registration?', a: 'No. NRIs can authorise a trusted representative via a notarised and apostilled Power of Attorney to complete the registration on their behalf. VVVA Developer\'s team coordinates the entire remote buying process.' },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-vvva-sand rounded-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 bg-white hover:bg-amber-50/30 transition-colors"
      >
        <span className="text-sm font-semibold text-vvva-black leading-snug">{q}</span>
        <span className={`text-vvva-orange shrink-0 text-lg transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-vvva-sand">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const allFaqs = FAQS.flatMap(cat => cat.questions.map(q => ({ question: q.q, answer: q.a })));
  const faqSchema = makeFAQSchema(allFaqs);
  const breadcrumbs = makeBreadcrumbSchema([
    { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
    { name: 'FAQ', url: 'https://vvva-builders.vercel.app/faq' },
  ]);

  return (
    <>
      <Seo
        title="FAQ — Residential Plots in Hassan Karnataka | VVVA Developer"
        description="Frequently asked questions about buying residential plots in Hassan, Karnataka from VVVA Developer. DTCP, loans, NRI purchase, documentation, prices."
        canonical="/faq"
        schema={[faqSchema, breadcrumbs]}
      />
      <main className="pt-16 page-transition">
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="FAQ VVVA Developer"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Help Centre</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4.5vw, 46px)' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 text-base">Everything you need to know about buying plots from VVVA Developer.</p>
          </div>
        </section>

        <section className="py-14 px-4 bg-vvva-warm-white">
          <div className="max-w-3xl mx-auto space-y-10">
            {FAQS.map((cat) => (
              <div key={cat.category}>
                <h2 className="font-playfair font-bold text-xl text-vvva-black mb-4">{cat.category}</h2>
                <div className="space-y-3">
                  {cat.questions.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-card border border-vvva-sand p-6 text-center">
              <p className="font-playfair font-semibold text-vvva-black text-lg mb-2">Still have questions?</p>
              <p className="text-sm text-gray-500 mb-5">Our property advisors are available Monday–Saturday, 9 AM to 7 PM.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+919845659193"
                  className="bg-vvva-orange text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-vvva-orange-dark transition-colors text-sm">
                  Call +91 98456 59193
                </a>
                <Link to="/contact"
                  className="border border-vvva-sand text-vvva-black font-semibold px-6 py-2.5 rounded-btn hover:border-vvva-orange/40 transition-colors text-sm">
                  Send a Message
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
