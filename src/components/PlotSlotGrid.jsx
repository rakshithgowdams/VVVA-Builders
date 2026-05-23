import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SlotInfoPanel from './SlotInfoPanel.jsx';

const SLOT_STYLES = {
  available: {
    wrapper: 'border-[1.5px] border-green-700 bg-green-50 cursor-pointer hover:bg-green-100 hover:shadow-sm',
    num: 'text-green-800',
    dim: 'text-green-900 font-bold',
  },
  booked: {
    wrapper: 'border border-yellow-600 bg-yellow-50 cursor-not-allowed',
    num: 'text-yellow-800',
    dim: 'text-yellow-900 font-bold',
  },
  sold: {
    wrapper: 'border border-gray-400 bg-gray-200 cursor-not-allowed',
    num: 'text-gray-500',
    dim: 'text-gray-500 line-through',
  },
};

const STATUS_LABEL = {
  available: null,
  booked: { text: 'Booked', cls: 'bg-yellow-200 text-yellow-900' },
  sold: { text: 'Sold', cls: 'bg-gray-300 text-gray-600' },
};

function SlotCard({ slot, isSelected, onClick }) {
  const styles = SLOT_STYLES[slot.status] || SLOT_STYLES.sold;
  const label = STATUS_LABEL[slot.status];

  return (
    <div
      onClick={() => slot.status === 'available' && onClick(slot)}
      className={`rounded-card p-3 transition-all duration-150 relative ${styles.wrapper} ${
        isSelected ? 'ring-2 ring-green-500 ring-offset-1' : ''
      }`}
    >
      <div className={`text-[10px] font-semibold mb-1.5 ${styles.num}`}>
        #{slot.biteNo}
      </div>
      <div className={`text-sm font-bold leading-snug ${styles.dim}`}>
        {slot.dimensions} ft
      </div>
      {label && (
        <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-chip ${label.cls}`}>
          {label.text}
        </span>
      )}
      {slot.status === 'available' && !isSelected && (
        <span className="text-[9px] text-green-800 font-medium mt-1 block">
          Tap to view
        </span>
      )}
      {isSelected && (
        <span className="text-[9px] text-green-800 font-semibold mt-1 block">
          Selected
        </span>
      )}
    </div>
  );
}

const INITIAL_VISIBLE = 4;

export default function PlotSlotGrid({ slots = [], projectId, siteImage, projectName = '' }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const handleSlotClick = (slot) => {
    setSelectedSlot((prev) => (prev?.id === slot.id ? null : slot));
  };

  const visibleSlots = slots.slice(0, visibleCount);
  const hasMore = visibleCount < slots.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + INITIAL_VISIBLE, slots.length));
  };

  return (
    <div>
      <div className="mb-3">
        <h2 className="font-playfair font-bold text-2xl text-vvva-black">Select Your Plot</h2>
        <p className="text-sm text-gray-500 mt-1">Tap an available slot to view details</p>
        <div className="w-full mt-3 rounded-card overflow-hidden bg-vvva-sand" style={{ aspectRatio: '16/9' }}>
          {siteImage ? (
            <img
              src={siteImage}
              alt="Site layout"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-900 via-orange-700 to-amber-500 flex items-center justify-center relative">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20" aria-hidden="true">
                <rect x="6" y="12" width="52" height="40" rx="5" stroke="white" strokeWidth="2"/>
                <path d="M6 42l14-14 10 10 8-8 18 18" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="20" cy="26" r="4" fill="white"/>
              </svg>
              <span className="absolute bottom-3 right-4 text-white/40 text-xs font-mono">Project Layout</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border-[1.5px] border-green-700 bg-green-50 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-yellow-600 bg-yellow-50 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-gray-400 bg-gray-200 inline-block" />
          Sold
        </span>
      </div>

      {slots.length === 0 ? (
        <div className="bg-vvva-sand/60 rounded-card py-8 text-center text-gray-500 text-sm">
          No plot slots available for this project.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {visibleSlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={selectedSlot?.id === slot.id}
                onClick={handleSlotClick}
              />
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadMore}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-card border border-vvva-orange/40 text-vvva-orange text-sm font-semibold hover:bg-vvva-orange/5 active:scale-[0.98] transition-all duration-150"
            >
              <FontAwesomeIcon icon={faChevronDown} />
              Load More Slots
              <span className="text-xs font-normal text-gray-400 ml-1">
                ({slots.length - visibleCount} remaining)
              </span>
            </button>
          )}
        </>
      )}

      <SlotInfoPanel
        slot={selectedSlot}
        projectId={projectId}
        projectName={projectName}
        onClose={() => setSelectedSlot(null)}
      />
    </div>
  );
}
