import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by project name or location..."
        className="w-full bg-white border border-vvva-sand rounded-card pl-5 pr-12 py-3.5 text-sm text-vvva-black placeholder-gray-400 focus:outline-none focus:border-vvva-orange focus:ring-2 focus:ring-vvva-orange/20 transition-all"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Search size={18} />
      </div>
    </div>
  );
}
