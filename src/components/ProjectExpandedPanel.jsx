import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faLocationDot, faCompass, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import PlotSlotGrid from './PlotSlotGrid.jsx';
import GalleryGrid from './GalleryGrid.jsx';
import PropertyMap from './PropertyMap.jsx';

function SectionHeading({ label, title }) {
  return (
    <div className="mb-4">
      <span className="text-vvva-orange text-[10px] font-bold tracking-widest uppercase">{label}</span>
      <h3 className="font-playfair font-bold text-xl text-vvva-black mt-0.5">{title}</h3>
    </div>
  );
}

export default function ProjectExpandedPanel({ project, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      setTimeout(() => {
        panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [project?.id]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        key={project.id}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden col-span-full"
      >
        <div className="mt-2 mb-4 bg-white border border-vvva-orange/25 rounded-card shadow-lg overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-vvva-sand bg-vvva-warm-white">
            <div>
              <h2 className="font-playfair font-bold text-lg text-vvva-black">{project.name}</h2>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                {project.location}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-vvva-orange transition-colors p-1.5 rounded-btn hover:bg-vvva-orange/5"
              aria-label="Close project details"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-10">
            {/* 1. Property Slot Grid */}
            <section>
              <PlotSlotGrid slots={project.plotSlots} projectId={project.id} siteImage={project.siteImage || project.images?.[0]} projectName={project.name} />
            </section>

            {/* 2. Gallery */}
            <section>
              <SectionHeading label="Gallery" title="Project Photos" />
              <GalleryGrid images={project.images} />
            </section>

            {/* 3. Site Location */}
            <section>
              <SectionHeading label="Location" title="Site Location" />
              <PropertyMap coordinates={project.mapCoordinates} projectName={project.name} />
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FontAwesomeIcon icon={faCompass} className="text-vvva-orange text-xs" />
                  {project.location}
                </span>
                {project.mapCoordinates && (
                  <span className="text-xs text-gray-400 font-mono">
                    {project.mapCoordinates.lat?.toFixed(4)}, {project.mapCoordinates.lng?.toFixed(4)}
                  </span>
                )}
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

            {/* Enquiry CTA */}
            <section className="bg-vvva-sand/60 rounded-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-playfair font-semibold text-vvva-black">Interested in {project.name}?</p>
                <p className="text-sm text-gray-500 mt-0.5">Our team will call you back within 24 hours.</p>
              </div>
              <a
                href="/contact"
                className="shrink-0 bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold text-sm px-6 py-2.5 rounded-btn transition-colors"
              >
                Enquire Now
              </a>
            </section>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
