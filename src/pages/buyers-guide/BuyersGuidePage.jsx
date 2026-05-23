import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../seo/Seo';
import { makeBreadcrumbSchema, makeArticleSchema } from '../../seo/schema';
import LeadForm from '../../components/LeadForm';

const BASE_URL = 'https://vvva-builders.vercel.app';

export default function BuyersGuidePage({ data }) {
  const breadcrumbs = makeBreadcrumbSchema([
    { name: 'Home', url: `${BASE_URL}/` },
    { name: "Buyer's Guide", url: `${BASE_URL}/buyers-guide` },
    { name: data.title, url: `${BASE_URL}/buyers-guide/${data.slug}` },
  ]);

  const article = makeArticleSchema({
    title: data.title,
    excerpt: data.seoDescription,
    hero_image_url: `${BASE_URL}/hero-real-estate-bg.webp`,
    published_at: data.publishedAt,
    updated_at: data.lastUpdated,
    slug: `buyers-guide/${data.slug}`,
    author: 'Rakshith',
  });

  return (
    <>
      <Seo
        title={data.seoTitle}
        description={data.seoDescription}
        canonical={`/buyers-guide/${data.slug}`}
        type="article"
        schema={[breadcrumbs, article]}
      />

      <main className="pt-16 page-transition">
        {/* Hero */}
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt={data.title}
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Buyer's Guide</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(22px, 4vw, 44px)' }}>
              {data.title}
            </h1>
            <p className="text-white/70 text-sm">
              By <Link to="/about" className="text-vvva-orange hover:underline">Rakshith</Link>, VVVA Developer &nbsp;·&nbsp; Updated: {data.lastUpdated}
            </p>
          </div>
        </section>

        {/* TL;DR Quick Answer */}
        <section className="py-6 px-4 bg-amber-50 border-b border-amber-100">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="bg-vvva-orange text-white text-[11px] font-bold px-2 py-1 rounded shrink-0 mt-0.5">TL;DR</span>
              <p className="text-sm text-stone-700 leading-relaxed">{data.tldr}</p>
            </div>
          </div>
        </section>

        {/* Breadcrumbs */}
        <nav className="py-3 px-4 bg-white border-b border-vvva-sand text-xs text-gray-400">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5">
            <Link to="/" className="hover:text-vvva-orange">Home</Link>
            <span>/</span>
            <Link to="/buyers-guide" className="hover:text-vvva-orange">Buyer's Guide</Link>
            <span>/</span>
            <span className="text-vvva-black font-medium">{data.breadcrumbLabel}</span>
          </div>
        </nav>

        {/* Content + sidebar */}
        <section className="py-14 px-4 bg-vvva-warm-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <article className="lg:col-span-2 space-y-10">
              {data.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  viewport={{ once: true }}
                >
                  {section.type === 'heading' && (
                    <h2 className="font-playfair font-bold text-xl sm:text-2xl text-vvva-black">{section.content}</h2>
                  )}
                  {section.type === 'paragraph' && (
                    <p className="text-[15px] text-gray-600 leading-relaxed">{section.content}</p>
                  )}
                  {section.type === 'list' && (
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[15px] text-gray-700">
                          <span className="text-vvva-orange shrink-0 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.type === 'table' && (
                    <div className="overflow-x-auto rounded-card border border-vvva-sand">
                      <table className="w-full text-sm">
                        <thead className="bg-vvva-sand text-vvva-black">
                          <tr>
                            {section.headers.map((h) => (
                              <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-vvva-sand">
                          {section.rows.map((row, j) => (
                            <tr key={j} className="hover:bg-amber-50/40 transition-colors">
                              {row.map((cell, k) => (
                                <td key={k} className={`px-4 py-3 ${k === 0 ? 'font-medium text-vvva-black' : 'text-gray-600'}`}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {section.type === 'callout' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-card p-5">
                      <p className="text-sm font-semibold text-amber-800 mb-1">{section.label || 'Important'}</p>
                      <p className="text-sm text-amber-700 leading-relaxed">{section.content}</p>
                    </div>
                  )}
                  {section.type === 'steps' && (
                    <div className="space-y-4">
                      {section.steps.map((step, j) => (
                        <div key={j} className="flex gap-4 bg-white rounded-card border border-vvva-sand p-5">
                          <div className="w-8 h-8 rounded-full bg-vvva-orange flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {j + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-vvva-black text-sm mb-1">{step.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Related links */}
              <div className="bg-white rounded-card border border-vvva-sand p-6">
                <h3 className="font-playfair font-semibold text-lg text-vvva-black mb-4">Related Guides</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.relatedLinks.map((link) => (
                    <Link key={link.to} to={link.to}
                      className="text-sm text-vvva-orange hover:text-vvva-orange-dark hover:underline transition-colors">
                      → {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">Last updated: {data.lastUpdated}</p>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="sticky top-24">
                <LeadForm title="Get Expert Advice" subtitle="Have questions? Our property advisor will call you within 2 hours." />
                <div className="mt-5 bg-stone-800 rounded-card p-5">
                  <p className="text-white font-playfair font-semibold text-base mb-3">Quick Links</p>
                  <div className="space-y-2">
                    <Link to="/projects" className="block text-sm text-white/60 hover:text-vvva-orange transition-colors">→ View Current Projects</Link>
                    <Link to="/price-list" className="block text-sm text-white/60 hover:text-vvva-orange transition-colors">→ Current Price List</Link>
                    <Link to="/contact" className="block text-sm text-white/60 hover:text-vvva-orange transition-colors">→ Contact Us</Link>
                    <Link to="/faq" className="block text-sm text-white/60 hover:text-vvva-orange transition-colors">→ All FAQs</Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-4 bg-stone-700 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-white mb-4">
              Ready to buy your plot in Hassan?
            </h2>
            <p className="text-white/60 text-sm mb-8">Browse VVVA Developer's current DTCP-approved residential plots across Hassan district.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/projects"
                className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-8 py-3 rounded-btn transition-colors">
                View All Projects
              </Link>
              <Link to="/contact"
                className="border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-btn transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
