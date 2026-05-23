import { Link, useParams, Navigate } from 'react-router-dom';
import Seo from '../seo/Seo';
import { makeArticleSchema, makeBreadcrumbSchema } from '../seo/schema';
import { BLOG_POSTS } from './Blog';
import LeadForm from '../components/LeadForm';

const BASE_URL = 'https://vvva-builders.vercel.app';

const BLOG_CONTENT = {
  'why-buy-plot-hassan-2026': {
    sections: [
      { type: 'tldr', content: 'Hassan is experiencing infrastructure-led real estate appreciation driven by NH-75 four-laning, HIMS Hospital expansion, and the Smart City Mission. DTCP-approved residential plots starting from ₹15 Lakh offer entry-level investment in a tier-2 city with Bengaluru-connectivity.' },
      { type: 'h2', content: 'The Hassan Investment Thesis in 2026' },
      { type: 'p', content: 'Hassan, Karnataka has quietly become one of the most compelling real estate investment destinations in South India for 2026. While Bengaluru\'s prices have outpaced most buyers\' budgets, Hassan — 187 km away and under 3 hours by road — offers affordable entry with strong appreciation fundamentals.' },
      { type: 'h2', content: '1. NH-75 Connectivity — Hassan to Bengaluru in 3 Hours' },
      { type: 'p', content: 'The four-laning of NH-75 (Bengaluru–Mangaluru highway) passing through Hassan was completed in 2022. This single infrastructure development reduced Bengaluru travel time by 45–60 minutes and made Hassan a genuine commuter satellite city for Bengaluru-based professionals.' },
      { type: 'h2', content: '2. HIMS Hospital — Healthcare Institutional Anchor' },
      { type: 'p', content: 'The Hassan Institute of Medical Sciences (HIMS) employs over 1,500 medical professionals and students. Hospitals of this scale are proven residential demand anchors — they create permanent, recession-resistant housing demand in surrounding areas.' },
      { type: 'h2', content: '3. Hassan Smart City Mission — ₹2,000 Crore Infrastructure Pipeline' },
      { type: 'p', content: 'Hassan was selected under the Smart City Mission with an approved project pipeline worth over ₹2,000 crore. Smart city investments include water supply, sewerage, roads, digital infrastructure, and public amenities — all of which directly improve livability and property values.' },
      { type: 'h2', content: 'Price Appreciation Data — Hassan 2019–2026' },
      { type: 'p', content: 'According to local property registrations tracked by our team, residential plot prices in Hassan\'s prime corridors have appreciated as follows: Hassan Bypass corridor: 55–70% since 2019. HIMS vicinity: 30–45%. Channarayapatna (NH-75 frontage): 25–40%. These returns have outperformed Bengaluru\'s peripheral ring road areas on a percentage basis.' },
    ],
  },
  'dtcp-vs-panchayat-sites-karnataka': {
    sections: [
      { type: 'tldr', content: 'DTCP-approved sites are legally sanctioned by the Karnataka town planning authority — they are eligible for bank loans, construction permissions, and Khata A. Gram panchayat sites (non-DTCP) may lack layout approval — they cannot get construction licences or bank loans. Always buy DTCP-approved.' },
      { type: 'h2', content: 'What is a DTCP-Approved Site?' },
      { type: 'p', content: 'A DTCP-approved site is a plot in a residential layout that has been officially sanctioned by the Directorate of Town and Country Planning (DTCP), Karnataka. The approval confirms that the layout conforms to town planning norms: minimum road widths, open space, drainage, and plot sizes.' },
      { type: 'h2', content: 'What is a Gram Panchayat Site?' },
      { type: 'p', content: 'A gram panchayat site is typically a plot in a revenue village that has been divided by the landowner without formal DTCP layout approval. The gram panchayat issues a Khata B certificate and collects revenue tax — but this is NOT the same as DTCP approval.' },
      { type: 'h2', content: 'Key Differences' },
      { type: 'p', content: 'DTCP sites: bank loans ✓, construction licence ✓, Khata A ✓, resale value high ✓. Panchayat sites without DTCP: bank loans ✗, construction licence ✗, Khata B, resale limited. The practical consequence: you cannot legally build a house on a gram panchayat site without construction approval, which requires DTCP compliance.' },
    ],
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const content = BLOG_CONTENT[slug];
  const articleSchema = makeArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    hero_image_url: `${BASE_URL}${post.heroImage}`,
    published_at: post.date,
    updated_at: post.date,
    slug: `blog/${post.slug}`,
    author: post.author,
  });
  const breadcrumbs = makeBreadcrumbSchema([
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: post.title, url: `${BASE_URL}/blog/${post.slug}` },
  ]);

  return (
    <>
      <Seo
        title={`${post.title} | VVVA Developer Blog`}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        image={`${BASE_URL}${post.heroImage}`}
        type="article"
        schema={[articleSchema, breadcrumbs]}
      />
      <main className="pt-16 page-transition">
        <div className="relative aspect-video max-h-72 overflow-hidden">
          <img src={post.heroImage} alt={post.title}
            className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent" />
        </div>

        <nav className="py-3 px-4 bg-white border-b border-vvva-sand text-xs text-gray-400">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5">
            <Link to="/" className="hover:text-vvva-orange">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-vvva-orange">Blog</Link>
            <span>/</span>
            <span className="text-vvva-black font-medium line-clamp-1">{post.title}</span>
          </div>
        </nav>

        <section className="py-12 px-4 bg-vvva-warm-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
            <article className="lg:col-span-2">
              <span className="text-xs font-semibold text-vvva-orange">{post.category}</span>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-vvva-black mt-2 mb-3 leading-snug">{post.title}</h1>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-8 pb-5 border-b border-vvva-sand">
                <span>By <Link to="/about" className="text-vvva-orange hover:underline">{post.author}</Link>, VVVA Developer</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>

              {content ? (
                <div className="space-y-6">
                  {content.sections.map((s, i) => (
                    <div key={i}>
                      {s.type === 'tldr' && (
                        <div className="bg-amber-50 border border-amber-100 rounded-card p-4 flex gap-3">
                          <span className="bg-vvva-orange text-white text-[11px] font-bold px-2 py-0.5 rounded shrink-0 h-fit">TL;DR</span>
                          <p className="text-sm text-stone-700 leading-relaxed">{s.content}</p>
                        </div>
                      )}
                      {s.type === 'h2' && <h2 className="font-playfair font-bold text-xl text-vvva-black">{s.content}</h2>}
                      {s.type === 'p' && <p className="text-[15px] text-gray-600 leading-relaxed">{s.content}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[15px] text-gray-600 leading-relaxed">{post.excerpt} This article is being updated with full content. Check back soon, or explore our <Link to="/buyers-guide" className="text-vvva-orange hover:underline">Buyer's Guides</Link> for detailed information.</p>
              )}

              <div className="mt-8 pt-6 border-t border-vvva-sand">
                <Link to="/blog" className="text-sm text-vvva-orange hover:underline">← Back to Blog</Link>
              </div>
            </article>

            <aside className="sticky top-24 h-fit">
              <LeadForm title="Interested in Hassan Plots?" subtitle="Get personalised guidance from our team." />
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
