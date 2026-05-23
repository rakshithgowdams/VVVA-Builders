const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'open' },
  { label: 'Upcoming', value: 'future' },
  { label: 'Sold Out', value: 'closed' },
];

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TABS.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-vvva-orange text-white shadow-sm'
                : 'bg-white text-vvva-black border border-vvva-sand hover:border-vvva-orange hover:text-vvva-orange'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
