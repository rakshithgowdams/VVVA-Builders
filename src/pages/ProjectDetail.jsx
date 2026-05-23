import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationDot, faCompass, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { fetchProjectWithDetails } from '../lib/db';
import { supabase } from '../lib/supabase';
import GalleryGrid from '../components/GalleryGrid.jsx';
import PlotSlotGrid from '../components/PlotSlotGrid.jsx';
import PropertyMap from '../components/PropertyMap.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import FloatingEnquireBtn from '../components/FloatingEnquireBtn.jsx';
import Seo from '../seo/Seo';
import { makeProjectSchema, makeBreadcrumbSchema } from '../seo/schema';

const STATUS_CONFIG = {
  open:   { label: 'OPEN',   bg: 'bg-green-500',  text: 'text-white' },
  future: { label: 'FUTURE', bg: 'bg-blue-500',   text: 'text-white' },
  closed: { label: 'CLOSED', bg: 'bg-gray-400',   text: 'text-white' },
};

function mapDbProject(p) {
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    status: p.status,
    description: p.description,
    cardImage: p.card_image_url,
    siteImage: p.site_layout_image_url,
    heroImage: p.hero_image_url,
    priceRange: p.price_range,
    reraNumber: p.rera_number,
    totalAreaAcres: p.total_area_acres,
    mapCoordinates: p.map_lat ? { lat: p.map_lat, lng: p.map_lng } : null,
    googleMapsUrl: p.google_maps_url || '',
    images: (p.images || []).map(img => img.url),
    plotSlots: (p.plot_slots || []).map(s => ({
      id: s.id,
      dimensions: s.dimensions,
      status: s.status,
      biteNo: s.bite_no,
      direction: s.direction,
      price: `₹${s.price_lakhs} Lakhs`,
      measurement: `${s.sqft} sqft`,
      details: s.details,
    })),
  };
}

async function fetchBySlugOrId(slugOrId) {
  const numericId = Number(slugOrId);
  if (!isNaN(numericId)) return fetchProjectWithDetails(numericId);
  const { data } = await supabase.from('projects').select('id').eq('slug', slugOrId).maybeSingle();
  if (!data) return null;
  return fetchProjectWithDetails(data.id);
}

export default function ProjectDetail() {
  const { id } = useParams();
  const heroRef = useRef(null);
  const [project, setProject] = useState(null);
  const [rawProject, setRawProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadProject = useCallback(() => {
    fetchBySlugOrId(id)
      .then(data => {
        if (!data) { setNotFound(true); return; }
        setRawProject(data);
        setProject(mapDbProject(data));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Real-time: update map immediately when admin changes coordinates
  useEffect(() => {
    const channel = supabase
      .channel(`project-detail-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects', filter: `id=eq.${id}` }, () => {
        loadProject();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, loadProject]);

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-vvva-warm-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-vvva-orange border-t-transparent rounded-full" />
      </main>
    );
  }

  if (notFound || !project) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center bg-vvva-warm-white">
        <div className="text-center">
          <p className="text-4xl mb-4">🏗️</p>
          <h1 className="font-playfair font-bold text-2xl text-vvva-black mb-2">Project Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/" className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-6 py-2.5 rounded-btn transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.closed;

  const projectSchema = rawProject ? makeProjectSchema(rawProject) : null;
  const breadcrumbs = makeBreadcrumbSchema([
    { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
    { name: 'Projects', url: 'https://vvva-builders.vercel.app/projects' },
    { name: project.name, url: `https://vvva-builders.vercel.app/projects/${rawProject?.slug || id}` },
  ]);

  return (
    <>
    {projectSchema && (
      <Seo
        title={rawProject?.seo_title || `${project.name} — DTCP Approved Plots in ${project.location} | VVVA Developer`}
        description={rawProject?.seo_description || `${project.description?.slice(0, 150) || project.name} — DTCP-approved residential plots. RERA: ${project.reraNumber || 'Applied'}. Call +91-98456-59193.`}
        canonical={`/projects/${rawProject?.slug || id}`}
        image={project.cardImage}
        schema={[projectSchema, breadcrumbs]}
      />
    )}
    <main className="pt-16 bg-vvva-warm-white page-transition">
      {/* Hero */}
      <section ref={heroRef} className="relative py-14 px-4 overflow-hidden">
        {project.cardImage && (
          <img
            src={project.cardImage}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-stone-900/70" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors mb-6">
            <FontAwesomeIcon icon={faArrowLeft} />
            All Projects
          </Link>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(24px, 4vw, 44px)' }}>
                {project.name}
              </motion.h1>
              <div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
                <FontAwesomeIcon icon={faLocationDot} className="text-sm" />
                <span>{project.location}</span>
              </div>
              {project.priceRange && (
                <p className="text-vvva-orange font-semibold text-sm mt-2">{project.priceRange}</p>
              )}
            </div>
            <span className={`${statusCfg.bg} ${statusCfg.text} text-xs font-bold tracking-wider px-3 py-1.5 rounded-pill mt-1`}>
              {statusCfg.label}
            </span>
          </div>
          {project.reraNumber && (
            <p className="text-white/40 text-xs mt-3">RERA: {project.reraNumber}</p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Description */}
        {project.description && (
          <section>
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">About</span>
            <h2 className="font-playfair font-bold text-2xl text-vvva-black mt-1 mb-3">Project Overview</h2>
            <p className="text-gray-600 leading-relaxed text-[15px]">{project.description}</p>
          </section>
        )}

        {/* Gallery */}
        {project.images.length > 0 && (
          <section>
            <div className="mb-5">
              <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Gallery</span>
              <h2 className="font-playfair font-bold text-2xl text-vvva-black mt-1">Project Photos</h2>
            </div>
            <GalleryGrid images={project.images} />
          </section>
        )}

        {/* Plot Slots */}
        <section>
          <PlotSlotGrid
            slots={project.plotSlots}
            projectId={project.id}
            siteImage={project.siteImage}
            projectName={project.name}
          />
        </section>

        {/* Map */}
        {project.mapCoordinates && (
          <section>
            <div className="mb-5">
              <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Location</span>
              <h2 className="font-playfair font-bold text-2xl text-vvva-black mt-1">Property Location</h2>
            </div>
            <PropertyMap coordinates={project.mapCoordinates} projectName={project.name} />
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCompass} className="text-vvva-orange text-sm" />
                <span>{project.location}</span>
              </div>
              <span className="font-mono text-xs text-gray-400">
                {project.mapCoordinates.lat.toFixed(4)}, {project.mapCoordinates.lng.toFixed(4)}
              </span>
              {project.googleMapsUrl && (
                <a
                  href={project.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1558b0] px-3 py-1.5 rounded-btn transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                  Open in Google Maps
                </a>
              )}
            </div>
          </section>
        )}

        {/* Enquiry */}
        <section id="enquiry">
          <div className="bg-white rounded-card border border-vvva-sand p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Enquiry</span>
              <h2 className="font-playfair font-bold text-2xl text-vvva-black mt-1">Interested in this project?</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in your details and our team will call you back within 24 hours.</p>
            </div>
            <div className="max-w-lg">
              <EnquiryForm projectName={project.name} projectId={project.id} />
            </div>
          </div>
        </section>
      </div>

      <FloatingEnquireBtn heroRef={heroRef} />
    </main>
    </>
  );
}
