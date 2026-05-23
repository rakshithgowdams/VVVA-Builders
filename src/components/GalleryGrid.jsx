import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import GalleryModal from './GalleryModal.jsx';

function RealImage({ src, index, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-card cursor-pointer overflow-hidden aspect-video relative group"
    >
      <img
        src={src}
        alt={`Project photo ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
    </div>
  );
}

function PlaceholderImage({ index, onClick }) {
  const hues = [
    'from-orange-800 to-amber-600',
    'from-orange-600 to-yellow-500',
    'from-amber-700 to-orange-500',
    'from-orange-900 to-orange-600',
    'from-amber-800 to-orange-400',
    'from-orange-700 to-amber-500',
  ];
  const gradient = hues[index % hues.length];
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-card cursor-pointer overflow-hidden aspect-video flex items-center justify-center group relative`}
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-30 group-hover:opacity-50 transition-opacity" aria-hidden="true">
        <rect x="4" y="8" width="32" height="24" rx="3" stroke="white" strokeWidth="2"/>
        <circle cx="14" cy="18" r="3" fill="white"/>
        <path d="M4 26l8-8 6 6 4-4 10 10" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
      <span className="absolute bottom-2 right-2 text-white/60 text-xs font-mono">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  );
}

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 6;

export default function GalleryGrid({ images = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const openModal = (idx) => {
    setCurrentIdx(idx);
    setModalOpen(true);
  };

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, images.length));
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visibleImages.map((src, i) => (
          src
            ? <RealImage key={i} src={src} index={i} onClick={() => openModal(i)} />
            : <PlaceholderImage key={i} index={i} onClick={() => openModal(i)} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-card border border-vvva-orange/40 text-vvva-orange text-sm font-semibold hover:bg-vvva-orange/5 active:scale-[0.98] transition-all duration-150"
        >
          <FontAwesomeIcon icon={faChevronDown} />
          Load More Photos
          <span className="text-xs font-normal text-gray-400 ml-1">
            ({images.length - visibleCount} remaining)
          </span>
        </button>
      )}

      {modalOpen && (
        <GalleryModal
          images={images}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
