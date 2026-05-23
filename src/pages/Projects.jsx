import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../seo/Seo';
import { makeProjectListSchema, makeBreadcrumbSchema } from '../seo/schema';
import { fetchAllProjectsWithDetails, getCachedProjects } from '../lib/db';

const breadcrumbs = makeBreadcrumbSchema([
  { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
  { name: 'Projects', url: 'https://vvva-builders.vercel.app/projects' },
]);

const STATUS_LABEL = { open: 'Available', future: 'Coming Soon', closed: 'Sold Out' };
const STATUS_CLASS = {
  open: 'bg-green-50 text-green-700',
  future: 'bg-amber-50 text-amber-700',
  closed: 'bg-stone-100 text-stone-500',
};

export default function Projects() {
  const cached = getCachedProjects();
  const [projects, setProjects] = useState(() => cached ?? []);
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    fetchAllProjectsWithDetails()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const listSchema = makeProjectListSchema(projects.map(p => ({ id: p.id, name: p.name, slug: p.slug })));

  return (
    <>
      <Seo
        title="All Residential Plot Projects in Hassan — VVVA Developer"
        description="Browse all DTCP-approved residential plot projects by VVVA Developer in Hassan, Karnataka. View plots, prices, and availability. Call +91-98456-59193."
        canonical="/projects"
        schema={[breadcrumbs, listSchema]}
      />
      <main className="pt-16 page-transition">
        <section className="py-14 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="VVVA Developer projects in Hassan"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Our Projects</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4.5vw, 46px)' }}>
              Residential Plot Projects — Hassan District
            </h1>
            <p className="text-white/70">All DTCP & RERA-approved residential layouts currently available or coming soon.</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-vvva-warm-white">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-card border border-vvva-sand h-72 animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Projects are being updated. Please call us at +91-98456-59193 for current availability.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={`/projects/${project.slug || project.id}`}
                      className="block bg-white rounded-card border border-vvva-sand hover:border-vvva-orange/40 hover:shadow-md transition-all duration-200 overflow-hidden group"
                    >
                      {project.card_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={project.card_image_url}
                            alt={`${project.name} — DTCP approved residential plots in ${project.location}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h2 className="font-playfair font-bold text-base text-vvva-black leading-snug">{project.name}</h2>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-pill shrink-0 ${STATUS_CLASS[project.status]}`}>
                            {STATUS_LABEL[project.status]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{project.location}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{project.description}</p>
                        {project.price_range && (
                          <p className="text-vvva-orange font-semibold text-sm">{project.price_range}</p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
