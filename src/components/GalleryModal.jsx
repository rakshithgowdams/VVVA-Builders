import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const hues = [
  'from-orange-800 to-amber-600',
  'from-orange-600 to-yellow-500',
  'from-amber-700 to-orange-500',
  'from-orange-900 to-orange-600',
  'from-amber-800 to-orange-400',
  'from-orange-700 to-amber-500',
];

export default function GalleryModal({ images, currentIdx, setCurrentIdx, onClose }) {
  const total = images.length;

  const prev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + total) % total);
  }, [total, setCurrentIdx]);

  const next = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % total);
  }, [total, setCurrentIdx]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-4 right-16 text-white/70 text-sm font-mono z-10">
        {currentIdx + 1} of {total}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Close gallery"
      >
        <FontAwesomeIcon icon={faXmark} className="text-xl" />
      </button>

      {/* Prev arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
        aria-label="Previous image"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
      </button>

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
        aria-label="Next image"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-card overflow-hidden flex items-center justify-center bg-black"
          style={{ width: 'min(80vw, 720px)', height: 'min(60vh, 480px)' }}
        >
          {images[currentIdx] ? (
            <img
              src={images[currentIdx]}
              alt={`Project photo ${currentIdx + 1}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${hues[currentIdx % hues.length]} flex items-center justify-center`}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-20" aria-hidden="true">
                <rect x="8" y="16" width="64" height="48" rx="6" stroke="white" strokeWidth="3"/>
                <circle cx="28" cy="36" r="6" fill="white"/>
                <path d="M8 52l16-16 12 12 8-8 20 20" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <span className="absolute bottom-4 right-4 text-white/60 text-sm font-mono bg-black/30 px-2 py-0.5 rounded">
            {currentIdx + 1} / {total}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
            className={`rounded-full transition-all duration-200 ${
              i === currentIdx ? 'w-5 h-2 bg-vvva-orange' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
