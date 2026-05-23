import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../seo/Seo';
import { makeBreadcrumbSchema } from '../../seo/schema';

const GUIDES = [
  {
    slug: 'dtcp-approval',
    title: 'DTCP Approved Plots — How to Verify',
    excerpt: 'What DTCP approval means, how to verify it, and why it matters for loans and legal safety.',
    icon: '📋',
    tag: 'Legal',
  },
  {
    slug: 'khata-explained',
    title: 'Khata A vs Khata B in Karnataka',
    excerpt: 'The critical difference between Khata A and B — and why you should always buy Khata A property.',
    icon: '📄',
    tag: 'Legal',
  },
  {
    slug: 'stamp-duty-karnataka-2026',
    title: 'Stamp Duty & Registration Charges 2026',
    excerpt: 'Complete guide to stamp duty rates, calculation examples, and the registration process in Hassan.',
    icon: '🏛️',
    tag: 'Taxes',
  },
  {
    slug: 'plot-home-loan',
    title: 'Plot Loan Eligibility & Process',
    excerpt: 'How to get a plot loan in Hassan — banks, rates, EMI calculator, and documents required.',
    icon: '🏦',
    tag: 'Finance',
  },
  {
    slug: 'nri-buying-guide',
    title: 'NRI Guide to Buying Plots in Hassan',
    excerpt: 'Complete FEMA guide, POA process, TDS rules, and VVVA Developer NRI services.',
    icon: '✈️',
    tag: 'NRI',
  },
];

export default function BuyersGuideIndex() {
  const breadcrumbs = makeBreadcrumbSchema([
    { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
    { name: "Buyer's Guide", url: 'https://vvva-builders.vercel.app/buyers-guide' },
  ]);

  return (
    <>
      <Seo
        title="Buyer's Guide — DTCP, Khata, Stamp Duty, Loans, NRI — VVVA Developer"
        description="Complete real estate buyer's guides for Hassan, Karnataka. DTCP approval, Khata explained, stamp duty 2026, plot loans, and NRI purchase guide."
        canonical="/buyers-guide"
        schema={breadcrumbs}
      />
      <main className="pt-16 page-transition">
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="VVVA Developer Buyers Guide"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Educational Resources</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4vw, 46px)' }}>
              Hassan Plot Buyer's Guide
            </h1>
            <p className="text-white/70 text-base">Expert guides on DTCP, Khata, stamp duty, loans, and NRI purchase — everything you need to buy confidently.</p>
          </div>
        </section>

        <section className="py-14 px-4 bg-vvva-warm-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDES.map((guide, i) => (
                <motion.div
                  key={guide.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/buyers-guide/${guide.slug}`}
                    className="block bg-white rounded-card border border-vvva-sand hover:border-vvva-orange/40 hover:shadow-md transition-all duration-200 p-6 h-full"
                  >
                    <span className="inline-block text-xs font-semibold text-vvva-orange bg-vvva-orange/10 px-2.5 py-1 rounded-pill mb-3">{guide.tag}</span>
                    <h2 className="font-playfair font-bold text-lg text-vvva-black mb-2">{guide.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{guide.excerpt}</p>
                    <span className="text-vvva-orange text-sm font-semibold">Read Guide →</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
