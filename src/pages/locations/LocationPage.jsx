import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Seo from '../../seo/Seo';
import { makeFAQSchema, makeBreadcrumbSchema } from '../../seo/schema';
import LeadForm from '../../components/LeadForm';

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LocationPage({ data }) {
  const breadcrumbs = makeBreadcrumbSchema([
    { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
    { name: 'Locations', url: 'https://vvva-builders.vercel.app/locations/hassan' },
    { name: data.name, url: `https://vvva-builders.vercel.app/locations/${data.slug}` },
  ]);
  const faqSchema = makeFAQSchema(data.faqs);

  return (
    <>
      <Seo
        title={data.seoTitle}
        description={data.seoDescription}
        canonical={`/locations/${data.slug}`}
        schema={[breadcrumbs, faqSchema]}
      />

      <main className="pt-16 page-transition">
        {/* Hero */}
        <section className="py-20 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt={`Residential plots in ${data.name}`}
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Hassan District</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(26px, 4.5vw, 48px)' }}>
              {data.h1}
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto mb-6">{data.heroSub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+919845659193"
                className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-6 py-3 rounded-btn transition-colors shadow-lg shadow-vvva-orange/30">
                Call +91 98456 59193
              </a>
              <Link to="/contact"
                className="border border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-btn transition-colors">
                Schedule Site Visit
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Answer TL;DR for AI engines */}
        <section className="py-8 px-4 bg-amber-50 border-b border-amber-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="bg-vvva-orange text-white text-[11px] font-bold px-2 py-1 rounded shrink-0 mt-0.5">QUICK ANSWER</span>
              <p className="text-sm text-stone-700 leading-relaxed">{data.quickAnswer}</p>
            </div>
          </div>
        </section>

        {/* Breadcrumbs */}
        <nav className="py-3 px-4 bg-white border-b border-vvva-sand text-xs text-gray-400">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5">
            <Link to="/" className="hover:text-vvva-orange transition-colors">Home</Link>
            <span>/</span>
            <Link to="/locations/hassan" className="hover:text-vvva-orange transition-colors">Locations</Link>
            <span>/</span>
            <span className="text-vvva-black font-medium">{data.name}</span>
          </div>
        </nav>

        {/* Main content + sidebar */}
        <section className="py-14 px-4 bg-vvva-warm-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
            {/* Content column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Intro */}
              <div>
                <h2 className="font-playfair font-bold text-2xl text-vvva-black mb-4">About {data.name}</h2>
                <div className="prose prose-stone max-w-none text-[15px] text-gray-600 leading-relaxed space-y-4">
                  {data.introParagraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className="font-playfair font-bold text-xl text-vvva-black mb-4">Location Map</h2>
                <div className="rounded-card overflow-hidden border border-vvva-sand" style={{ height: '360px' }}>
                  <MapContainer
                    center={[data.mapLat, data.mapLng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[data.mapLat, data.mapLng]} icon={orangeIcon}>
                      <Popup>
                        <strong>VVVA Developer — {data.name}</strong><br />
                        Residential plots available
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {/* Distance table */}
              <div>
                <h2 className="font-playfair font-bold text-xl text-vvva-black mb-4">Distance from {data.name}</h2>
                <div className="overflow-x-auto rounded-card border border-vvva-sand">
                  <table className="w-full text-sm">
                    <thead className="bg-vvva-sand text-vvva-black">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">Destination</th>
                        <th className="text-left px-4 py-3 font-semibold">Distance</th>
                        <th className="text-left px-4 py-3 font-semibold">Travel Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-vvva-sand">
                      {data.distances.map((row) => (
                        <tr key={row.place} className="hover:bg-amber-50/40 transition-colors">
                          <td className="px-4 py-3 font-medium text-vvva-black">{row.place}</td>
                          <td className="px-4 py-3 text-gray-600">{row.distance}</td>
                          <td className="px-4 py-3 text-gray-600">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Why invest */}
              <div>
                <h2 className="font-playfair font-bold text-xl text-vvva-black mb-4">Why Invest in {data.name}?</h2>
                <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
                  {data.whyInvestParagraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
                <ul className="mt-5 space-y-2">
                  {data.whyInvestPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[15px] text-gray-700">
                      <span className="text-vvva-orange mt-0.5">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local landmarks */}
              <div>
                <h2 className="font-playfair font-bold text-xl text-vvva-black mb-4">Key Landmarks Near {data.name}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.landmarks.map((lm) => (
                    <div key={lm.name} className="bg-white rounded-card p-4 border border-vvva-sand">
                      <h3 className="font-semibold text-vvva-black text-sm mb-1">{lm.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{lm.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-playfair font-bold text-xl text-vvva-black mb-5">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {data.faqs.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-card border border-vvva-sand p-5"
                    >
                      <h3 className="font-semibold text-vvva-black text-sm mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Internal links */}
              <div className="bg-white rounded-card border border-vvva-sand p-6">
                <h3 className="font-playfair font-semibold text-lg text-vvva-black mb-4">Related Guides & Locations</h3>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-24">
                <LeadForm
                  title="Schedule a Free Site Visit"
                  subtitle={`Interested in plots in ${data.name}? Our team is ready to assist.`}
                  projectInterest={data.name}
                />
                <div className="mt-5 bg-stone-800 rounded-card p-5 text-center">
                  <p className="text-white/60 text-xs mb-3">Or call us directly</p>
                  <a href="tel:+919845659193"
                    className="block bg-vvva-orange text-white font-semibold py-2.5 rounded-btn text-sm hover:bg-vvva-orange-dark transition-colors mb-2">
                    +91 98456 59193
                  </a>
                  <a href="https://wa.me/919845659193?text=Hi%2C%20I%27m%20interested%20in%20plots%20in%20{data.name}%20from%20VVVA%20Developer."
                    target="_blank" rel="noopener noreferrer"
                    className="block bg-green-600 text-white font-semibold py-2.5 rounded-btn text-sm hover:bg-green-700 transition-colors">
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-14 px-4 bg-stone-700 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-white mb-4">
              Ready to own a plot in {data.name}?
            </h2>
            <p className="text-white/60 text-sm mb-8">
              Browse our current DTCP-approved residential plots and book a free site visit today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/projects"
                className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-8 py-3 rounded-btn transition-colors shadow-lg shadow-vvva-orange/30">
                View All Projects
              </Link>
              <Link to="/price-list"
                className="border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-btn transition-colors">
                Check Price List
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
