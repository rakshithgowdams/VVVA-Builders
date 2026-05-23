import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import Seo from '../seo/Seo';
import { makeBreadcrumbSchema } from '../seo/schema';

const breadcrumbs = makeBreadcrumbSchema([
  { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
  { name: 'Testimonials', url: 'https://vvva-builders.vercel.app/testimonials' },
]);

const REVIEWS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Customer Reviews — VVVA Developer',
  itemListElement: [
    {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Rajesh Kumar' },
      reviewBody: 'Excellent documentation and hassle-free registration. VVVA Developer made our first plot purchase completely transparent.',
      itemReviewed: { '@type': 'Organization', name: 'VVVA Developer' },
    },
  ],
};

const TESTIMONIALS = [
  {
    name: 'Rajesh & Sunitha Kumar',
    location: 'Hassan, Karnataka',
    project: 'Bhoovanahalli Layout',
    plot: 'Plot #107 — 1200 sqft',
    rating: 5,
    text: 'We were nervous about investing in a plot for the first time. VVVA Developer walked us through every step — from site visits to documentation. Today our home stands on that plot and we couldn\'t be happier. The DTCP approval was already in place and the registration was smooth.',
    initials: 'RS',
  },
  {
    name: 'Dr. Mahesh Rao',
    location: 'Hassan, Karnataka',
    project: 'HIMS Corridor Project',
    plot: 'Plot #205 — 720 sqft',
    rating: 5,
    text: 'As a busy medical professional at HIMS, I needed someone I could trust completely. VVVA\'s transparency with pricing and timelines was refreshing. No hidden costs, no last-minute surprises. They arranged a Saturday site visit specifically for me.',
    initials: 'MR',
  },
  {
    name: 'Kavitha & Arun Sharma',
    location: 'Bengaluru → Hassan',
    project: 'Hassan Bypass Layout',
    plot: 'Plot #312 — 1500 sqft',
    rating: 5,
    text: 'We were investing from Bengaluru and were initially worried about managing a remote purchase. VVVA Developer\'s team arranged video calls, shared all documents digitally, and coordinated the registration — we only had to visit Hassan once for the final registration.',
    initials: 'KA',
  },
  {
    name: 'Mohammed Farhan',
    location: 'Dubai → Hassan (NRI)',
    project: 'Salagame Road Enclave',
    plot: 'Plot #18 — 1800 sqft',
    rating: 5,
    text: 'Being an NRI, I was worried about the documentation and POA process. VVVA\'s team guided me step by step — from apostilling my POA in Dubai to the final registration. They even helped with Khata transfer. Highly recommend for NRI buyers.',
    initials: 'MF',
  },
  {
    name: 'Smt. Lakshmi Venkatesh',
    location: 'Hassan, Karnataka',
    project: 'Channarayapatna Layout',
    plot: 'Plot #45 — 900 sqft',
    rating: 5,
    text: 'I bought this plot for my retirement. VVVA Developer\'s team was very patient and explained everything — from DTCP approval to stamp duty calculation. The plot is well-developed with proper roads. I am planning to build my retirement home next year.',
    initials: 'LV',
  },
  {
    name: 'Vijay Krishnaswamy',
    location: 'Chennai → Hassan',
    project: 'Holenarasipura Layout',
    plot: 'Plot #89 — 600 sqft',
    rating: 5,
    text: 'I heard about VVVA Developer through my Hassan relatives. The entire experience was professional and transparent. They showed me multiple plots, explained the pros and cons of each, and never pressured me. The documentation was impeccable.',
    initials: 'VK',
  },
];

export default function Testimonials() {
  return (
    <>
      <Seo
        title="Customer Reviews — VVVA Developer Hassan | Testimonials"
        description="Read real customer reviews of VVVA Developer. Hassan families share their plot buying experience. 500+ satisfied buyers. 5-star rated by our customers."
        canonical="/testimonials"
        schema={[breadcrumbs, REVIEWS_SCHEMA]}
      />
      <main className="pt-16 page-transition">
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="VVVA Developer testimonials"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">What Our Customers Say</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4.5vw, 46px)' }}>
              500+ Happy Families Trust VVVA Developer
            </h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1,2,3,4,5].map(i => (
                <FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-xl" />
              ))}
              <span className="text-white/70 text-sm ml-2">5.0 average rating</span>
            </div>
          </div>
        </section>

        <section className="py-14 px-4 bg-vvva-warm-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-card border border-vvva-sand p-6 relative"
                >
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-vvva-orange/20 absolute top-5 right-5 text-2xl" />
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <FontAwesomeIcon key={j} icon={faStar} className="text-amber-400 text-sm" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-vvva-sand">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vvva-orange to-amber-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-vvva-black text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.project} · {t.plot}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-stone-700 rounded-card p-8 max-w-2xl mx-auto">
                <h2 className="font-playfair font-bold text-2xl text-white mb-3">Join 500+ Happy Families</h2>
                <p className="text-white/60 text-sm mb-6">Browse our current plots and take the first step toward your dream home.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/projects"
                    className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-6 py-2.5 rounded-btn transition-colors">
                    View Projects
                  </Link>
                  <a href="tel:+919845659193"
                    className="border border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-2.5 rounded-btn transition-colors">
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
