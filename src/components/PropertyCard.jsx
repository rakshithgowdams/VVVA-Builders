import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  open:   { label: 'OPEN',   bg: 'bg-green-500',  text: 'text-white' },
  future: { label: 'FUTURE', bg: 'bg-blue-500',   text: 'text-white' },
  closed: { label: 'CLOSED', bg: 'bg-gray-400',   text: 'text-white' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.closed;
  return (
    <span className={`${cfg.bg} ${cfg.text} text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-pill`}>
      {cfg.label}
    </span>
  );
}

function PlotGradient({ status }) {
  const gradients = {
    open:   'from-orange-700 via-orange-500 to-amber-400',
    future: 'from-blue-900 via-blue-600 to-blue-400',
    closed: 'from-gray-700 via-gray-500 to-gray-400',
  };
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[status] || gradients.closed} flex items-center justify-center`}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="opacity-20" aria-hidden="true">
        <rect x="10" y="10" width="40" height="40" rx="4" stroke="white" strokeWidth="2"/>
        <path d="M10 30h40M30 10v40" stroke="white" strokeWidth="1.5"/>
        <circle cx="30" cy="30" r="6" fill="white"/>
      </svg>
    </div>
  );
}

function CardImageSkeleton() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-200">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function LazyCardImage({ src, alt, status, availableCount }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {!loaded && !error && <CardImageSkeleton />}
      {error && <PlotGradient status={status} />}
      {src && !error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {!src && !loaded && <PlotGradient status={status} />}
    </>
  );
}

export default function PropertyCard({ project, isExpanded, onClick }) {
  const slots = project.plotSlots || [];
  const availableCount = slots.filter(s => s.status === 'available').length;

  const dimChips = [...new Set(
    slots.filter(s => s.status === 'available').map(s => s.dimensions)
  )].slice(0, 3);

  return (
    <motion.div
      whileHover={isExpanded ? {} : { y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white rounded-card overflow-hidden cursor-pointer border transition-all duration-200 group ${
        isExpanded
          ? 'border-vvva-orange shadow-lg ring-2 ring-vvva-orange/20'
          : 'border-vvva-sand hover:border-vvva-orange/70 hover:shadow-lg'
      }`}
      style={{ boxShadow: isExpanded ? '0 4px 20px rgba(255,85,0,0.15)' : '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      {/* Image area */}
      <div className="relative h-[180px] overflow-hidden">
        <LazyCardImage
          src={project.cardImage}
          alt={project.name}
          status={project.status}
          availableCount={availableCount}
        />
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={project.status} />
        </div>
        {project.status === 'open' && availableCount > 0 && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-pill">
            {availableCount} plot{availableCount > 1 ? 's' : ''} available
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-inter font-semibold text-[15px] leading-snug mb-1.5 transition-colors ${
              isExpanded ? 'text-vvva-orange' : 'text-vvva-black group-hover:text-vvva-orange'
            }`}>
              {project.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-400 mb-3">
              <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
              <span className="text-[11px]">{project.location}</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`shrink-0 mt-0.5 ${isExpanded ? 'text-vvva-orange' : 'text-gray-300 group-hover:text-vvva-orange/50'}`}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </motion.div>
        </div>

        {/* Dimension chips */}
        {dimChips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {dimChips.map((dim) => (
              <span
                key={dim}
                className="text-[10px] font-medium text-vvva-black bg-vvva-sand border border-vvva-sand rounded-chip px-2 py-0.5"
              >
                {dim} ft
              </span>
            ))}
            {slots.filter(s => s.status === 'available').length > 3 && (
              <span className="text-[10px] font-medium text-vvva-orange/80 bg-vvva-orange/10 rounded-chip px-2 py-0.5">
                +{slots.filter(s => s.status === 'available').length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-gray-400 italic">No plots available</span>
        )}
      </div>
    </motion.div>
  );
}
