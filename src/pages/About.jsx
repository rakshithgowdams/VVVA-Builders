import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faEye, faHeart, faUsers, faLocationDot, faArrowTrendUp, faCircleCheck, faQuoteLeft, faBriefcase, faStar } from '@fortawesome/free-solid-svg-icons';
import StatCard from '../components/StatCard.jsx';
import Seo from '../seo/Seo';
import { LOCAL_BUSINESS_SCHEMA, makeBreadcrumbSchema } from '../seo/schema';

const breadcrumbs = makeBreadcrumbSchema([
  { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
  { name: 'About Us', url: 'https://vvva-builders.vercel.app/about' },
]);

const VALUES = [
  {
    icon: faTrophy,
    title: 'Quality',
    description: 'Every plot we develop meets the highest standards of infrastructure, documentation, and approvals.',
  },
  {
    icon: faEye,
    title: 'Transparency',
    description: 'Clear pricing, honest timelines, and full documentation. No hidden costs or surprises.',
  },
  {
    icon: faHeart,
    title: 'Trust',
    description: 'Built on relationships, not transactions. Our clients return and refer us because we earn their trust.',
  },
];

const JOURNEY = [
  { year: '2015', title: 'Founded', desc: 'VVVA Developer was established with the vision of making residential plot ownership transparent and accessible across Hassan.' },
  { year: '2017', title: 'First 10 Projects', desc: 'Crossed the milestone of 10 completed layouts in Hassan East corridor, earning the trust of over 80 families.' },
  { year: '2019', title: 'RERA Registration', desc: 'Became fully RERA-compliant, setting a new standard for documentation and transparency in plot development.' },
  { year: '2021', title: 'Expansion Phase', desc: 'Expanded into Sarjapur Road and Whitefield growth corridors, doubling the project pipeline.' },
  { year: '2023', title: '500+ Families', desc: 'Celebrated the milestone of 500+ families who have built their homes on VVVA Developer plots.' },
  { year: '2025', title: 'Decade of Excellence', desc: 'Marking 10 years with 50+ completed projects and a legacy of zero legal disputes, setting the gold standard.' },
];

const EMPLOYEES = [
  { name: 'Venkatesh V.', role: 'Managing Director', initials: 'VV', exp: '15 yrs in real estate' },
  { name: 'Ananya Reddy', role: 'Head of Projects', initials: 'AR', exp: '10 yrs in layout planning' },
  { name: 'Suresh Kumar', role: 'Legal & Compliance', initials: 'SK', exp: '12 yrs in property law' },
  { name: 'Priya Nair', role: 'Customer Relations', initials: 'PN', exp: '8 yrs in client management' },
  { name: 'Rajan Pillai', role: 'Site Engineer', initials: 'RP', exp: '11 yrs in civil engineering' },
  { name: 'Meera Shetty', role: 'Sales Manager', initials: 'MS', exp: '7 yrs in real estate sales' },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh & Sunitha Kumar',
    location: 'Bhoovanahalli Layout, Plot #107',
    text: 'We were nervous about investing in a plot for the first time. VVVA Developer walked us through every step — from site visits to documentation. Today our home stands on that plot and we couldn\'t be happier.',
    rating: 5,
  },
  {
    name: 'Dr. Mahesh Rao',
    location: 'Sarjapur Enclave, Plot #205',
    text: 'As a busy professional, I needed someone I could trust completely. VVVA\'s transparency with pricing and timelines was refreshing. No hidden costs, no last-minute surprises. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Kavitha & Arun Sharma',
    location: 'Hassan East Layout, Plot #312',
    text: 'What sets VVVA apart is their after-sale service. Even after we registered the plot, their team helped us coordinate with the BBMP for approval. Truly a partner, not just a seller.',
    rating: 5,
  },
];

const PROJECTS_PROGRESS = [
  { label: 'Residential Layouts', completed: 38, total: 50 },
  { label: 'Plots Registered', completed: 520, total: 600 },
  { label: 'RERA Compliant Projects', completed: 50, total: 50 },
  { label: 'Families Settled', completed: 500, total: 600 },
];

function ProgressBar({ label, completed, total }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-vvva-black">{label}</span>
        <span className="text-sm font-bold text-vvva-orange">{completed}/{total}</span>
      </div>
      <div className="w-full h-2.5 bg-vvva-sand rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="h-full bg-gradient-to-r from-vvva-orange to-amber-400 rounded-full"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{pct}% completed</p>
    </motion.div>
  );
}

export default function About() {
  const [activeQuote, setActiveQuote] = useState(0);

  return (
    <>
    <Seo
      title="About VVVA Developer — Hassan's Trusted Plot Developer Since 2015"
      description="VVVA Developer was founded in 2015 in Hassan, Karnataka. 50+ completed residential layout projects, 500+ happy families, RERA-registered. Learn our story."
      canonical="/about"
      schema={[LOCAL_BUSINESS_SCHEMA, breadcrumbs]}
    />
    <main className="pt-16 page-transition">
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <img
          src="/hero-real-estate-bg.webp"
          alt="VVVA Developer real estate development"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, #FF5500 0%, transparent 55%)` }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-vvva-orange text-sm font-semibold tracking-widest uppercase">
            Our Story
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }} className="font-playfair font-bold text-white mt-3 mb-5"
            style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
            About VVVA Developer
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} className="text-white/70 text-base sm:text-lg leading-relaxed">
            A decade of building communities, one plot at a time.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 bg-vvva-warm-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Who We Are</span>
              <h2 className="font-playfair font-bold text-3xl text-vvva-black mt-2 mb-5">
                Hassan's Trusted Residential Plot Developer
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                <p>Founded in 2015, VVVA Developer has grown to become one of Hassan's most respected residential plot developers. We started with a simple belief — every family deserves a piece of land to call their own.</p>
                <p>Over the past decade, we have developed more than 50 residential layout projects across Hassan East, Sarjapur, Whitefield, and surrounding growth corridors. All plots are RERA-registered and legally clear.</p>
                <p>Today, over 500 families have built their homes on VVVA Developer plots — and that number grows every year.</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-72 bg-white rounded-card flex items-center justify-center shadow-lg border border-stone-100 overflow-hidden">
                <img
                  src="/WhatsApp_Image_2026-05-03_at_22.45.12_2.png"
                  alt="VVVA Developer"
                  className="w-4/5 object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-vvva-orange text-white rounded-card px-5 py-3 shadow-lg">
                <p className="font-playfair font-bold text-2xl">10+</p>
                <p className="text-xs text-white/80">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-4 bg-vvva-sand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-vvva-black">VVVA Developer in Numbers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard value="10+" label="Years Experience" icon={faArrowTrendUp} />
            <StatCard value="50+" label="Projects Completed" icon={faLocationDot} />
            <StatCard value="500+" label="Happy Families" icon={faUsers} />
          </div>
        </div>
      </section>

      {/* Projects Progress Bars */}
      <section className="py-16 px-4 bg-vvva-warm-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Our Progress</span>
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-vvva-black mt-2">
              Projects Completed
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              A transparent look at how far we've come — and where we're headed.
            </p>
          </div>
          <div className="bg-white rounded-card p-8 border border-vvva-sand shadow-sm">
            {PROJECTS_PROGRESS.map((item) => (
              <ProgressBar key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-16 px-4 bg-vvva-sand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Our History</span>
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-vvva-black mt-2">
              The VVVA Journey
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              From a single vision to one of Hassan's most trusted developers — here's how it happened.
            </p>
          </div>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-vvva-orange/20 hidden sm:block" />
            <div className="space-y-6">
              {JOURNEY.map((step, i) => (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-vvva-orange flex items-center justify-center shadow-md shadow-vvva-orange/20 relative z-10">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-white text-lg" />
                  </div>
                  <div className="bg-white rounded-card p-5 border border-vvva-sand hover:border-vvva-orange/30 hover:shadow-sm transition-all duration-200 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-vvva-orange font-bold text-lg font-playfair">{step.year}</span>
                      <span className="h-px flex-1 bg-vvva-sand" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{step.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team / Employees */}
      <section className="py-16 px-4 bg-vvva-warm-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Our People</span>
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-vvva-black mt-2">
              The Team Behind VVVA
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              Experienced professionals united by the mission to make plot ownership simple and trustworthy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {EMPLOYEES.map((emp, i) => (
              <motion.div
                key={emp.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-card p-6 border border-vvva-sand hover:border-vvva-orange/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vvva-orange to-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-vvva-orange/20 mb-4">
                  {emp.initials}
                </div>
                <h3 className="font-playfair font-semibold text-lg text-vvva-black">{emp.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 mb-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-vvva-orange text-xs" />
                  <span className="text-xs font-semibold text-vvva-orange">{emp.role}</span>
                </div>
                <p className="text-xs text-gray-400">{emp.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-stone-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Client Stories</span>
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-white mt-2">
              What Our Families Say
            </h2>
          </div>

          {/* Active testimonial */}
          <motion.div
            key={activeQuote}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white/5 border border-white/10 rounded-card p-8 mb-6 relative"
          >
            <FontAwesomeIcon icon={faQuoteLeft} className="text-vvva-orange/30 absolute top-6 left-6 text-3xl" />
            <div className="flex gap-1 mb-4 ml-10">
              {Array.from({ length: TESTIMONIALS[activeQuote].rating }).map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-sm" />
              ))}
            </div>
            <p className="text-white/80 text-base leading-relaxed mb-6 ml-10">
              "{TESTIMONIALS[activeQuote].text}"
            </p>
            <div className="ml-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vvva-orange to-amber-400 flex items-center justify-center text-white font-bold text-sm">
                {TESTIMONIALS[activeQuote].name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{TESTIMONIALS[activeQuote].name}</p>
                <p className="text-white/40 text-xs">{TESTIMONIALS[activeQuote].location}</p>
              </div>
            </div>
          </motion.div>

          {/* Dot selectors */}
          <div className="flex justify-center gap-3">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveQuote(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === activeQuote
                    ? 'bg-vvva-orange w-7 h-2.5'
                    : 'bg-white/20 hover:bg-white/40 w-2.5 h-2.5'
                }`}
                aria-label={`View testimonial from ${t.name}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-vvva-warm-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Our Pillars</span>
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-vvva-black mt-2">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-card p-6 border border-vvva-sand hover:border-vvva-orange/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-vvva-orange/10 rounded-card flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={icon} className="text-vvva-orange text-xl" />
                </div>
                <h3 className="font-playfair font-semibold text-xl text-vvva-black mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-stone-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-white mb-4">
            Ready to find your plot?
          </h2>
          <p className="text-white/60 mb-8 text-sm">
            Browse our current projects across Hassan and take the first step toward owning your dream plot.
          </p>
          <Link
            to="/#projects"
            className="inline-block bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-8 py-3.5 rounded-btn transition-colors duration-150 shadow-lg shadow-vvva-orange/30"
          >
            View Our Projects
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
