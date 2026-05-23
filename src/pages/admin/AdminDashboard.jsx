import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faTableColumns, faLocationDot, faChartBar, faUsers, faMessage, faChevronDown, faTrash, faPlus, faXmark, faArrowUpRightFromSquare, faCheck, faVideo, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { signOut, getAdminSession } from '../../lib/adminAuth';
import { fetchAllProjectsWithDetails, fetchEnquiries, updateEnquiryStatus, addProjectImage, deleteProjectImage, updatePlotStatus, updateProjectGoogleMapsUrl, fetchPopupVideo, updatePopupVideo } from '../../lib/db';

const STATUS_BADGE = {
  open: 'bg-green-100 text-green-700',
  future: 'bg-blue-100 text-blue-700',
  closed: 'bg-stone-100 text-stone-500',
};

const ENQUIRY_BADGE = {
  new: 'bg-orange-100 text-orange-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-stone-100 text-stone-500',
};

const PLOT_BADGE = {
  available: 'bg-green-100 text-green-700',
  booked: 'bg-blue-100 text-blue-700',
  sold: 'bg-stone-100 text-stone-500',
};

function StatCard({ label, value, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <FontAwesomeIcon icon={icon} className="text-base" />
      </div>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
      <p className="text-xs text-stone-400 mt-0.5">{label}</p>
    </motion.div>
  );
}

function AddImageModal({ projectId, onClose, onAdded }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleAdd = async () => {
    if (!url.trim()) { setErr('URL is required'); return; }
    setSaving(true);
    try {
      await addProjectImage(projectId, url.trim(), caption.trim());
      onAdded();
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-stone-800">Add Project Image</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1.5">Image URL</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="/gallery-1.webp or https://..."
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1.5">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Short description"
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
            />
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="w-full bg-vvva-orange text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Add Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

function GoogleMapsEditor({ project, onSaved }) {
  const [url, setUrl] = useState(project.google_maps_url || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await updateProjectGoogleMapsUrl(project.id, url.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-stone-700">Google Maps Location Link</h4>
        {project.google_maps_url && (
          <a
            href={project.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" /> Preview
          </a>
        )}
      </div>
      <p className="text-xs text-stone-400 mb-2">Paste a Google Maps share link. It will appear as a button in the project location section.</p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setSaved(false); }}
          placeholder="https://maps.google.com/..."
          className="flex-1 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-vvva-orange hover:bg-vvva-orange-dark text-white disabled:opacity-60'
          }`}
        >
          {saved ? <><FontAwesomeIcon icon={faCheck} className="text-xs" /> Saved</> : saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {err && <p className="text-xs text-red-500 mt-1.5">{err}</p>}
    </div>
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = null;
    if (u.hostname.includes('youtu.be')) videoId = u.pathname.slice(1);
    else if (u.hostname.includes('youtube.com')) videoId = u.searchParams.get('v');
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch { return null; }
}

function PopupVideoPanel() {
  const [config, setConfig] = useState(null);
  const [url, setUrl] = useState('');
  const [active, setActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchPopupVideo().then(cfg => {
      if (cfg) {
        setConfig(cfg);
        setUrl(cfg.youtube_url || '');
        setActive(cfg.is_active || false);
      }
    }).catch(() => {});
  }, []);

  const embedUrl = getYouTubeEmbedUrl(url);

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await updatePopupVideo(url.trim(), active);
      setSaved(true);
      setConfig({ ...config, youtube_url: url.trim(), is_active: active });
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-2">Popup Video</h2>
      <p className="text-stone-400 text-sm mb-6">Configure the YouTube video that auto-plays inside the inquiry popup shown to site visitors.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setSaved(false); }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
            />
            <p className="text-xs text-stone-400 mt-1.5">Paste a YouTube share link or full URL. Short youtu.be links also work.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Status
            </label>
            <button
              onClick={() => { setActive(a => !a); setSaved(false); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold ${
                active
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              <FontAwesomeIcon icon={active ? faToggleOn : faToggleOff} className="text-xl" />
              {active ? 'Popup video is ON' : 'Popup video is OFF'}
            </button>
            <p className="text-xs text-stone-400 mt-1.5">When OFF, the popup shows the standard call-to-action without a video.</p>
          </div>

          {err && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-vvva-orange hover:bg-orange-600 text-white disabled:opacity-60'
            }`}
          >
            {saved ? <><FontAwesomeIcon icon={faCheck} /> Saved!</> : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Preview</p>
          {embedUrl ? (
            <div className="rounded-xl overflow-hidden border border-stone-100" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={embedUrl}
                title="Preview"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center justify-center gap-3 text-stone-300" style={{ aspectRatio: '16/9' }}>
              <FontAwesomeIcon icon={faVideo} className="text-4xl" />
              <span className="text-xs text-stone-400">Enter a valid YouTube URL to preview</span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-stone-400">
            <span className={`w-2 h-2 rounded-full ${active && embedUrl ? 'bg-green-500' : 'bg-stone-300'}`} />
            {active && embedUrl ? 'Video will appear in popup' : 'Video will NOT appear in popup'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedProject, setExpandedProject] = useState(null);
  const [addImageForProject, setAddImageForProject] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getAdminSession().then(s => {
      if (!s) { navigate('/admin', { replace: true }); return; }
      setSession(s);
    });
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    Promise.all([fetchAllProjectsWithDetails(), fetchEnquiries()])
      .then(([p, e]) => { setProjects(p); setEnquiries(e); })
      .finally(() => setLoading(false));
  }, [session, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  const handleSignOut = async () => { await signOut(); navigate('/admin', { replace: true }); };

  const handleEnquiryStatus = async (id, status) => {
    await updateEnquiryStatus(id, status);
    refresh();
  };

  const handlePlotStatus = async (slotId, status) => {
    await updatePlotStatus(slotId, status);
    refresh();
  };

  const handleDeleteImage = async (imgId) => {
    if (!confirm('Delete this image?')) return;
    await deleteProjectImage(imgId);
    refresh();
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-vvva-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalPlots = projects.reduce((s, p) => s + (p.plot_slots?.length || 0), 0);
  const available = projects.reduce((s, p) => s + (p.plot_slots?.filter(x => x.status === 'available').length || 0), 0);
  const booked = projects.reduce((s, p) => s + (p.plot_slots?.filter(x => x.status === 'booked').length || 0), 0);
  const sold = projects.reduce((s, p) => s + (p.plot_slots?.filter(x => x.status === 'sold').length || 0), 0);
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: faTableColumns },
    { id: 'projects', label: 'Projects', icon: faLocationDot },
    { id: 'enquiries', label: `Enquiries${newEnquiries > 0 ? ` (${newEnquiries})` : ''}`, icon: faMessage },
    { id: 'popup', label: 'Popup Video', icon: faVideo },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/WhatsApp_Image_2026-05-03_at_22.45.12_1.png"
              alt="VVVA Developer"
              className="h-8 w-auto object-contain"
            />
            <p className="text-stone-400 text-xs hidden sm:block">{session.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-red-500 border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 pb-0">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-vvva-orange text-vvva-orange'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              <FontAwesomeIcon icon={icon} className="text-sm" />
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Overview ───────────────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard label="Total Projects" value={projects.length} icon={faLocationDot} color="bg-blue-50 text-blue-600" delay={0} />
              <StatCard label="Total Plots" value={totalPlots} icon={faChartBar} color="bg-orange-50 text-vvva-orange" delay={0.05} />
              <StatCard label="Available" value={available} icon={faTableColumns} color="bg-green-50 text-green-600" delay={0.1} />
              <StatCard label="Booked / Sold" value={booked + sold} icon={faUsers} color="bg-stone-100 text-stone-600" delay={0.15} />
              <StatCard label="New Enquiries" value={newEnquiries} icon={faMessage} color="bg-orange-50 text-orange-600" delay={0.2} />
            </div>

            {/* Projects summary table */}
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-50">
                <h3 className="font-semibold text-stone-800 text-sm">Projects Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      {['Project', 'Location', 'Status', 'Plots', 'Available', 'Booked', 'Sold', 'Images'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-stone-800">{p.name}</td>
                        <td className="px-5 py-3.5 text-stone-500">{p.location}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-stone-700">{p.plot_slots?.length || 0}</td>
                        <td className="px-5 py-3.5 text-green-600 font-medium">{p.plot_slots?.filter(s => s.status === 'available').length || 0}</td>
                        <td className="px-5 py-3.5 text-blue-600 font-medium">{p.plot_slots?.filter(s => s.status === 'booked').length || 0}</td>
                        <td className="px-5 py-3.5 text-stone-400 font-medium">{p.plot_slots?.filter(s => s.status === 'sold').length || 0}</td>
                        <td className="px-5 py-3.5 text-stone-500">{p.images?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Projects ───────────────────────────────── */}
        {activeTab === 'projects' && (
          <div>
            <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-6">Manage Projects</h2>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                  {/* Project header */}
                  <button
                    onClick={() => setExpandedProject(expandedProject === p.id ? null : p.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img src={p.card_image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="text-left">
                        <p className="font-semibold text-stone-800">{p.name}</p>
                        <p className="text-xs text-stone-400">{p.location} · {p.price_range}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                      <FontAwesomeIcon icon={faChevronDown} className={`text-stone-400 transition-transform text-sm ${expandedProject === p.id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {expandedProject === p.id && (
                    <div className="border-t border-stone-100 px-6 py-5 space-y-6">
                      {/* Info */}
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-stone-400 text-xs uppercase font-semibold">Description</span><p className="text-stone-600 mt-1 text-[13px]">{p.description}</p></div>
                        <div className="space-y-2">
                          <div><span className="text-stone-400 text-xs">RERA</span><p className="text-stone-700 text-xs font-mono">{p.rera_number}</p></div>
                          <div><span className="text-stone-400 text-xs">Area</span><p className="text-stone-700 text-xs">{p.total_area_acres} acres</p></div>
                          <div><span className="text-stone-400 text-xs">Coordinates</span><p className="text-stone-700 text-xs font-mono">{p.map_lat}, {p.map_lng}</p></div>
                        </div>
                      </div>

                      {/* Google Maps URL */}
                      <GoogleMapsEditor project={p} onSaved={refresh} />

                      {/* Images */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-stone-700">Gallery Images ({p.images?.length || 0})</h4>
                          <button
                            onClick={() => setAddImageForProject(p.id)}
                            className="flex items-center gap-1.5 text-xs text-vvva-orange border border-vvva-orange/30 hover:bg-vvva-orange/5 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Image
                          </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {(p.images || []).map(img => (
                            <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
                              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors flex items-center justify-center">
                                <button
                                  onClick={() => handleDeleteImage(img.id)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1.5 rounded-lg transition-opacity"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                </button>
                              </div>
                              {img.caption && (
                                <p className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-white text-[9px] px-1.5 py-0.5 truncate">{img.caption}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Plot Slots */}
                      <div>
                        <h4 className="text-sm font-semibold text-stone-700 mb-3">Plot Slots ({p.plot_slots?.length || 0})</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-stone-50">
                                {['#', 'Dimensions', 'Sqft', 'Direction', 'Price', 'Status', 'Change'].map(h => (
                                  <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-stone-400 uppercase">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                              {(p.plot_slots || []).map(slot => (
                                <tr key={slot.id} className="hover:bg-stone-50/50">
                                  <td className="px-3 py-2 text-stone-500">{slot.bite_no}</td>
                                  <td className="px-3 py-2 font-medium text-stone-700">{slot.dimensions} ft</td>
                                  <td className="px-3 py-2 text-stone-500">{slot.sqft}</td>
                                  <td className="px-3 py-2 text-stone-500">{slot.direction}</td>
                                  <td className="px-3 py-2 text-stone-700">₹{slot.price_lakhs}L</td>
                                  <td className="px-3 py-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${PLOT_BADGE[slot.status]}`}>{slot.status}</span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <select
                                      value={slot.status}
                                      onChange={e => handlePlotStatus(slot.id, e.target.value)}
                                      className="text-[10px] border border-stone-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-vvva-orange/30"
                                    >
                                      <option value="available">Available</option>
                                      <option value="booked">Booked</option>
                                      <option value="sold">Sold</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Enquiries ──────────────────────────────── */}
        {activeTab === 'enquiries' && (
          <div>
            <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-6">
              Enquiries
              {newEnquiries > 0 && (
                <span className="ml-3 text-sm font-normal bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full">{newEnquiries} new</span>
              )}
            </h2>
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      {['Name', 'Phone', 'Email', 'Project', 'Message', 'Date', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {enquiries.length === 0 ? (
                      <tr><td colSpan={8} className="px-5 py-12 text-center text-stone-400 text-sm">No enquiries yet.</td></tr>
                    ) : enquiries.map(enq => (
                      <tr key={enq.id} className={`hover:bg-stone-50/50 transition-colors ${enq.status === 'new' ? 'bg-orange-50/30' : ''}`}>
                        <td className="px-5 py-3.5 font-medium text-stone-800">{enq.name}</td>
                        <td className="px-5 py-3.5 text-stone-600 font-mono text-xs">{enq.phone}</td>
                        <td className="px-5 py-3.5 text-stone-500 text-xs">{enq.email || '—'}</td>
                        <td className="px-5 py-3.5 text-stone-500 text-xs">{enq.projects?.name || '—'}</td>
                        <td className="px-5 py-3.5 text-stone-400 text-xs max-w-[160px] truncate">{enq.message || '—'}</td>
                        <td className="px-5 py-3.5 text-stone-400 text-xs whitespace-nowrap">
                          {new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${ENQUIRY_BADGE[enq.status]}`}>{enq.status}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <select
                            value={enq.status}
                            onChange={e => handleEnquiryStatus(enq.id, e.target.value)}
                            className="text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-vvva-orange/25"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Popup Video ────────────────────────────── */}
        {activeTab === 'popup' && <PopupVideoPanel />}
      </main>

      {addImageForProject && (
        <AddImageModal
          projectId={addImageForProject}
          onClose={() => setAddImageForProject(null)}
          onAdded={refresh}
        />
      )}
    </div>
  );
}
