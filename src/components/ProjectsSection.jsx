import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllProjectsWithDetails, getCachedProjects } from '../lib/db';
import ProjectCardSkeleton from './ProjectCardSkeleton.jsx';
import SearchBar from './SearchBar.jsx';
import FilterTabs from './FilterTabs.jsx';
import PropertyCard from './PropertyCard.jsx';
import ProjectExpandedPanel from './ProjectExpandedPanel.jsx';

const PAGE_SIZE = 6;
const PAGE_INCREMENT = 3;

function getColumns() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

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
      price: `₹${s.price_lakhs} /sqr feet`,
      measurement: `${s.sqft} sqft`,
      details: s.details,
    })),
  };
}

export default function ProjectsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedId, setExpandedId] = useState(null);
  const [cols, setCols] = useState(getColumns);

  // Pre-populate from cache so projects render immediately on first paint
  const cached = getCachedProjects();
  const [projects, setProjects] = useState(() => cached ? cached.map(mapDbProject) : []);
  const [loading, setLoading] = useState(cached === null);
  const [error, setError] = useState(null);

  const statusParam = searchParams.get('status') || 'all';
  const [activeFilter, setActiveFilter] = useState(
    ['open', 'future', 'closed', 'all'].includes(statusParam) ? statusParam : 'all'
  );

  const loadProjects = useCallback((isRetry = false) => {
    if (isRetry) {
      setError(null);
      setLoading(true);
    }
    fetchAllProjectsWithDetails()
      .then(data => {
        setProjects(data.map(mapDbProject));
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const onResize = () => setCols(getColumns());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setVisibleCount(PAGE_SIZE);
    setExpandedId(null);
    if (value === 'all') setSearchParams({});
    else setSearchParams({ status: value });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setVisibleCount(PAGE_SIZE);
    setExpandedId(null);
  };

  const handleCardClick = (projectId) => {
    setExpandedId((prev) => (prev === projectId ? null : projectId));
  };

  const filtered = projects.filter((p) => {
    const matchStatus = activeFilter === 'all' || p.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const expandedProject = projects.find((p) => p.id === expandedId) || null;
  const expandedIndex = expandedId ? visible.findIndex((p) => p.id === expandedId) : -1;
  const expandedRow = expandedIndex >= 0 ? Math.floor(expandedIndex / cols) : -1;

  const rows = [];
  for (let i = 0; i < visible.length; i += cols) {
    rows.push(visible.slice(i, i + cols));
  }

  return (
    <section id="projects" className="py-20 bg-vvva-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-vvva-orange text-sm font-semibold tracking-widest uppercase">Portfolio</span>
          <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-vvva-black mt-2 mb-3">
            Our Projects
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Explore premium residential plots across Bengaluru — click any card to view details inline.
          </p>
        </div>

        <div className="mb-5">
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <FilterTabs active={activeFilter} onChange={handleFilterChange} />
          <span className="text-xs text-gray-400">
            {loading ? 'Loading…' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm mb-4">Failed to load projects. Please try again.</p>
            <button
              onClick={() => loadProjects(true)}
              className="border-2 border-vvva-orange text-vvva-orange hover:bg-vvva-orange hover:text-white font-semibold px-6 py-2 rounded-btn transition-all duration-200 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            {visible.length > 0 ? (
              <motion.div
                key={`${activeFilter}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {rows.map((rowCards, rowIdx) => (
                  <div key={rowIdx}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-0">
                      {rowCards.map((project, i) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (rowIdx * cols + i) * 0.06 }}
                        >
                          <PropertyCard
                            project={project}
                            isExpanded={expandedId === project.id}
                            onClick={() => handleCardClick(project.id)}
                          />
                        </motion.div>
                      ))}
                    </div>
                    {expandedRow === rowIdx && expandedProject && (
                      <ProjectExpandedPanel
                        key={expandedProject.id}
                        project={expandedProject}
                        onClose={() => setExpandedId(null)}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-400"
              >
                <p className="text-4xl mb-3">🏗️</p>
                <p className="font-medium text-gray-500">No projects match your search.</p>
                <p className="text-sm mt-1">Try changing filters or search term.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {hasMore && !loading && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_INCREMENT)}
              className="border-2 border-vvva-orange text-vvva-orange hover:bg-vvva-orange hover:text-white font-semibold px-8 py-2.5 rounded-btn transition-all duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
