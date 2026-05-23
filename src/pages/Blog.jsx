import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../seo/Seo';
import { makeBreadcrumbSchema } from '../seo/schema';

const breadcrumbs = makeBreadcrumbSchema([
  { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
  { name: 'Blog', url: 'https://vvva-builders.vercel.app/blog' },
]);

export const BLOG_POSTS = [
  {
    slug: 'why-buy-plot-hassan-2026',
    title: 'Why Hassan Is Karnataka\'s Best Plot Investment Destination in 2026',
    excerpt: 'NH-75, HIMS, Smart City Mission — three infrastructure catalysts making Hassan one of Karnataka\'s top tier-2 investment destinations.',
    author: 'Rakshith',
    date: 'May 10, 2026',
    category: 'Investment',
    heroImage: '/hero-real-estate-bg.webp',
    readTime: '5 min read',
  },
  {
    slug: 'dtcp-vs-panchayat-sites-karnataka',
    title: 'DTCP Sites vs Panchayat Sites in Karnataka — Which Should You Buy?',
    excerpt: 'A plain-English comparison of DTCP-approved plots and gram panchayat sites, including loan eligibility, construction permission, and resale value.',
    author: 'Rakshith',
    date: 'April 20, 2026',
    category: 'Legal',
    heroImage: '/hero-site.jpeg',
    readTime: '7 min read',
  },
  {
    slug: 'hassan-real-estate-price-trends-2026',
    title: 'Hassan Real Estate Price Trends 2026 — Where are Prices Heading?',
    excerpt: 'Analysis of residential plot price movements in Hassan city and district over 2021–2026, and outlook for 2027–2030.',
    author: 'Rakshith',
    date: 'March 15, 2026',
    category: 'Market Analysis',
    heroImage: '/hero-site2.jpeg',
    readTime: '8 min read',
  },
  {
    slug: 'first-time-plot-buyer-checklist-karnataka',
    title: '12-Point Checklist for First-Time Plot Buyers in Karnataka',
    excerpt: 'Everything a first-time buyer must verify before signing any agreement — from EC to DTCP approval to soil test.',
    author: 'Rakshith',
    date: 'February 28, 2026',
    category: 'Buyers Guide',
    heroImage: '/hero-site3.jpeg',
    readTime: '6 min read',
  },
  {
    slug: 'nri-investment-hassan-2026',
    title: 'NRI Investment in Hassan, Karnataka — A 2026 Opportunity Analysis',
    excerpt: 'Why Hassan is seeing growing NRI investment interest from Gulf, USA, and UK diaspora — with data, returns analysis, and practical steps.',
    author: 'Rakshith',
    date: 'January 20, 2026',
    category: 'NRI',
    heroImage: '/hero-site4.jpeg',
    readTime: '9 min read',
  },
];

export default function Blog() {
  return (
    <>
      <Seo
        title="Blog — Hassan Real Estate Insights | VVVA Developer"
        description="Expert articles on buying plots in Hassan, Karnataka. Real estate trends, DTCP guides, NRI investment, stamp duty, and market analysis from VVVA Developer."
        canonical="/blog"
        schema={breadcrumbs}
      />
      <main className="pt-16 page-transition">
        <section className="py-14 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="VVVA Developer blog"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Insights & Guides</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4.5vw, 46px)' }}>
              Real Estate Blog
            </h1>
            <p className="text-white/70">Hassan property market insights, buyer guides, and investment analysis by VVVA Developer.</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-vvva-warm-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/blog/${post.slug}`}
                    className="block bg-white rounded-card border border-vvva-sand hover:border-vvva-orange/40 hover:shadow-md transition-all duration-200 overflow-hidden group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-vvva-orange">{post.category}</span>
                      <h2 className="font-playfair font-bold text-base text-vvva-black mt-2 mb-2 leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>By {post.author}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
