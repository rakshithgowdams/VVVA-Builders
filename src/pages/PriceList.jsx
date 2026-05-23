import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { makeBreadcrumbSchema } from '../seo/schema';
import LeadForm from '../components/LeadForm';

const breadcrumbs = makeBreadcrumbSchema([
  { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
  { name: 'Price List', url: 'https://vvva-builders.vercel.app/price-list' },
]);

const PRICE_ZONES = [
  {
    area: 'Hassan City Centre / Salagame Road',
    sizes: ['600 sqft', '720 sqft', '1200 sqft', '1800 sqft', '2400 sqft'],
    priceRange: '₹1,800–₹3,500/sqft',
    startingFrom: '₹32 Lakh',
    availability: 'Limited',
  },
  {
    area: 'Near HIMS Hospital Corridor',
    sizes: ['600 sqft', '720 sqft', '900 sqft', '1200 sqft', '1500 sqft'],
    priceRange: '₹1,400–₹2,400/sqft',
    startingFrom: '₹18 Lakh',
    availability: 'Available',
  },
  {
    area: 'Near Hassan Bypass (NH-75)',
    sizes: ['600 sqft', '800 sqft', '1200 sqft', '1500 sqft', '2400 sqft'],
    priceRange: '₹1,200–₹2,800/sqft',
    startingFrom: '₹20 Lakh',
    availability: 'Available',
  },
  {
    area: 'Channarayapatna',
    sizes: ['600 sqft', '720 sqft', '1200 sqft', '2400 sqft'],
    priceRange: '₹700–₹1,400/sqft',
    startingFrom: '₹12 Lakh',
    availability: 'Available',
  },
  {
    area: 'Holenarasipura',
    sizes: ['600 sqft', '720 sqft', '1200 sqft'],
    priceRange: '₹600–₹1,200/sqft',
    startingFrom: '₹10 Lakh',
    availability: 'Available',
  },
  {
    area: 'Belur',
    sizes: ['600 sqft', '720 sqft', '1200 sqft', '1800 sqft'],
    priceRange: '₹750–₹1,400/sqft',
    startingFrom: '₹13 Lakh',
    availability: 'Available',
  },
  {
    area: 'Sakleshpur',
    sizes: ['600 sqft', '900 sqft', '1200 sqft', '2400 sqft'],
    priceRange: '₹900–₹1,800/sqft',
    startingFrom: '₹14 Lakh',
    availability: 'Available',
  },
];

const NOTES = [
  'All prices are indicative as of May 2026 and subject to revision without notice.',
  'Actual price depends on specific plot number, road facing direction (East/North preferred), corner vs. interior plot.',
  'Prices above are for DTCP-approved residential plots only — not agricultural or unapproved land.',
  'Stamp duty and registration charges (approx. 6%) are additional and payable by the buyer.',
  'VVVA Developer offers transparent pricing — no hidden costs or brokerage.',
  'Bank loans available on all plots through our tie-up banks.',
];

export default function PriceList() {
  return (
    <>
      <Seo
        title="Plot Prices in Hassan 2026 — Live Price List | VVVA Developer"
        description="Current residential plot prices in Hassan, Karnataka 2026. Area-wise price ranges, plot sizes, and starting prices from VVVA Developer. Updated monthly."
        canonical="/price-list"
        schema={breadcrumbs}
      />
      <main className="pt-16 page-transition">
        {/* Hero */}
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="Plot prices in Hassan"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Transparent Pricing</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4.5vw, 46px)' }}>
              Plot Prices in Hassan — 2026 Price List
            </h1>
            <p className="text-white/70 text-base">Area-wise residential plot prices across Hassan district. Updated: May 2026.</p>
          </div>
        </section>

        {/* Quick Answer */}
        <section className="py-6 px-4 bg-amber-50 border-b border-amber-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="bg-vvva-orange text-white text-[11px] font-bold px-2 py-1 rounded shrink-0 mt-0.5">PRICE SUMMARY</span>
              <p className="text-sm text-stone-700 leading-relaxed">
                Residential plot prices in Hassan range from ₹600/sqft (Holenarasipura) to ₹3,500/sqft (Hassan city prime). VVVA Developer's DTCP-approved plots start from ₹10 Lakh for 600 sqft. Call +91-98456-59193 for the exact current price of specific plots.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 px-4 bg-vvva-warm-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="font-playfair font-bold text-2xl text-vvva-black mb-6">Area-Wise Price Guide (May 2026)</h2>
              <div className="space-y-4">
                {PRICE_ZONES.map((zone, i) => (
                  <motion.div
                    key={zone.area}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-card border border-vvva-sand p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-vvva-black text-base">{zone.area}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Plot sizes: {zone.sizes.join(', ')}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-pill ${zone.availability === 'Limited' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                        {zone.availability}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs text-gray-400">Price Range</p>
                        <p className="font-bold text-vvva-orange text-lg">{zone.priceRange}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Starting From</p>
                        <p className="font-bold text-vvva-black text-lg">{zone.startingFrom}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-white rounded-card border border-vvva-sand p-6">
                <h3 className="font-playfair font-semibold text-lg text-vvva-black mb-4">Important Notes</h3>
                <ul className="space-y-2">
                  {NOTES.map((note, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="text-vvva-orange shrink-0 mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Link to="/buyers-guide/stamp-duty-karnataka-2026"
                  className="block bg-white rounded-card border border-vvva-sand p-4 hover:border-vvva-orange/40 transition-colors">
                  <p className="text-sm font-semibold text-vvva-black">Stamp Duty Calculator</p>
                  <p className="text-xs text-gray-400 mt-1">Calculate registration costs for your plot →</p>
                </Link>
                <Link to="/buyers-guide/plot-home-loan"
                  className="block bg-white rounded-card border border-vvva-sand p-4 hover:border-vvva-orange/40 transition-colors">
                  <p className="text-sm font-semibold text-vvva-black">Plot Loan EMI Calculator</p>
                  <p className="text-xs text-gray-400 mt-1">Check EMI for your budget →</p>
                </Link>
              </div>
            </div>

            <div className="sticky top-24 h-fit">
              <LeadForm
                title="Get Exact Current Prices"
                subtitle="Plot prices change frequently. Get the latest prices directly from our team."
                buttonText="Get Price Details"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
