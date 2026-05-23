import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket, faTableColumns, faLocationDot, faChartBar,
  faUsers, faMessage, faChevronDown, faTrash, faPlus, faXmark,
  faArrowUpRightFromSquare, faCheck, faVideo, faToggleOn, faToggleOff,
  faUserCircle, faUser, faBars, faBuilding, faPencil, faEye, faClock,
} from '@fortawesome/free-solid-svg-icons';
import { signOut, getAdminSession, getSessionExpiry } from '../../lib/adminAuth';
import {
  fetchAllProjectsWithDetails, fetchEnquiries, updateEnquiryStatus,
  addProjectImage, deleteProjectImage, updatePlotStatus,
  updateProjectGoogleMapsUrl, fetchPopupVideo, updatePopupVideo,
} from '../../lib/db';
import AdminProfile from '../../components/AdminProfile.jsx';
import ProjectsManager from '../../components/ProjectsManager.jsx';

// ── Session timer ──────────────────────────────────────────────────────────────
function useSessionTimer(onExpire) {
  const [remaining, setRemaining] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const expiry = getSessionExpiry();
      if (!expiry) { setRemaining(null); return; }
      const diff = Math.max(0, expiry - Date.now());
      setRemaining(diff);
      if (diff === 0) onExpire();
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [onExpire]);

  return remaining;
}

function SessionBadge({ remaining, compact }) {
  if (remaining === null) return null;

  const totalSec = Math.floor(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const timeStr = h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const urgent = totalSec < 300; // last 5 minutes
  const warning = totalSec < 900; // last 15 minutes

  const colorClass = urgent
    ? 'bg-red-50 text-red-600 border-red-200'
    : warning
    ? 'bg-amber-50 text-amber-600 border-amber-200'
    : 'bg-stone-50 text-stone-500 border-stone-200';

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-lg border ${colorClass}`}>
        <FontAwesomeIcon icon={faClock} className="text-[10px]" />
        {timeStr}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${colorClass}`}>
      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
      <span className="hidden sm:inline">Session expires in</span>
      <span className="font-mono font-bold">{timeStr}</span>
    </div>
  );
}

// ── Badge maps ─────────────────────────────────────────────────────────────────
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

// ── Small helpers ──────────────────────────────────────────────────────────────
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
              type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="/gallery-1.webp or https://..."
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1.5">Caption (optional)</label>
            <input
              type="text" value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="Short description"
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
            />
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
          <button onClick={handleAdd} disabled={saving}
            className="w-full bg-vvva-orange text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60">
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
    setSaving(true); setErr('');
    try {
      await updateProjectGoogleMapsUrl(project.id, url.trim());
      setSaved(true); setTimeout(() => setSaved(false), 2000); onSaved();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-stone-700">Google Maps Location Link</h4>
        {project.google_maps_url && (
          <a href={project.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" /> Preview
          </a>
        )}
      </div>
      <p className="text-xs text-stone-400 mb-2">Paste a Google Maps share link. It will appear as a button in the project location section.</p>
      <div className="flex gap-2">
        <input type="url" value={url} onChange={e => { setUrl(e.target.value); setSaved(false); }}
          placeholder="https://maps.google.com/..."
          className="flex-1 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
        />
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-vvva-orange hover:bg-vvva-orange-dark text-white disabled:opacity-60'}`}>
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
      if (cfg) { setConfig(cfg); setUrl(cfg.youtube_url || ''); setActive(cfg.is_active || false); }
    }).catch(() => {});
  }, []);

  const embedUrl = getYouTubeEmbedUrl(url);

  const handleSave = async () => {
    setSaving(true); setErr('');
    try {
      await updatePopupVideo(url.trim(), active);
      setSaved(true); setConfig({ ...config, youtube_url: url.trim(), is_active: active });
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-2">Popup Video</h2>
      <p className="text-stone-400 text-sm mb-6">Configure the YouTube video that auto-plays inside the inquiry popup shown to site visitors.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">YouTube Video URL</label>
            <input type="url" value={url} onChange={e => { setUrl(e.target.value); setSaved(false); }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange"
            />
            <p className="text-xs text-stone-400 mt-1.5">Paste a YouTube share link or full URL.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Status</label>
            <button onClick={() => { setActive(a => !a); setSaved(false); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold ${active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}>
              <FontAwesomeIcon icon={active ? faToggleOn : faToggleOff} className="text-xl" />
              {active ? 'Popup video is ON' : 'Popup video is OFF'}
            </button>
          </div>
          {err && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}
          <button onClick={handleSave} disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-vvva-orange hover:bg-orange-600 text-white disabled:opacity-60'}`}>
            {saved ? <><FontAwesomeIcon icon={faCheck} /> Saved!</> : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Preview</p>
          {embedUrl ? (
            <div className="rounded-xl overflow-hidden border border-stone-100 relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={embedUrl}
                title="Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          ) : (
            <div className="rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center justify-center gap-3 text-stone-300 relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <FontAwesomeIcon icon={faVideo} className="text-4xl" />
                <span className="text-xs text-stone-400">Enter a valid YouTube URL to preview</span>
              </div>
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

// ── Overview panel ─────────────────────────────────────────────────────────────
function OverviewPanel({ projects, enquiries, onTabChange }) {
  const totalPlots = projects.reduce((s, p) => s + (p.plot_slots?.length || 0), 0);
  const available = projects.reduce((s, p) => s + (p.plot_slots?.filter(x => x.status === 'available').length || 0), 0);
  const booked = projects.reduce((s, p) => s + (p.plot_slots?.filter(x => x.status === 'booked').length || 0), 0);
  const sold = projects.reduce((s, p) => s + (p.plot_slots?.filter(x => x.status === 'sold').length || 0), 0);

  const newEnq = enquiries.filter(e => e.status === 'new').length;
  const contactedEnq = enquiries.filter(e => e.status === 'contacted').length;
  const closedEnq = enquiries.filter(e => e.status === 'closed').length;
  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div>
      <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Projects" value={projects.length} icon={faLocationDot} color="bg-blue-50 text-blue-600" delay={0} />
        <StatCard label="Total Plots" value={totalPlots} icon={faChartBar} color="bg-orange-50 text-vvva-orange" delay={0.05} />
        <StatCard label="Available" value={available} icon={faTableColumns} color="bg-green-50 text-green-600" delay={0.1} />
        <StatCard label="Booked / Sold" value={booked + sold} icon={faUsers} color="bg-stone-100 text-stone-600" delay={0.15} />
        <StatCard label="New Enquiries" value={newEnq} icon={faMessage} color="bg-orange-50 text-orange-600" delay={0.2} />
      </div>

      {/* Projects summary table */}
      <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden mb-8">
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

      {/* Contact Queries section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-stone-800 text-base">Contact Queries</h3>
            <p className="text-stone-400 text-xs mt-0.5">All enquiries received through the contact &amp; project forms</p>
          </div>
          <button
            onClick={() => onTabChange('enquiries')}
            className="flex items-center gap-1.5 text-xs text-vvva-orange border border-vvva-orange/30 hover:bg-vvva-orange/5 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            View all <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
          </button>
        </div>

        {/* Status breakdown pills */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'New', count: newEnq, bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-400', text: 'text-orange-700', sub: 'text-orange-400' },
            { label: 'Contacted', count: contactedEnq, bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-400', text: 'text-blue-700', sub: 'text-blue-400' },
            { label: 'Closed', count: closedEnq, bg: 'bg-stone-50', border: 'border-stone-100', dot: 'bg-stone-300', text: 'text-stone-600', sub: 'text-stone-400' },
          ].map(({ label, count, bg, border, dot, text, sub }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl px-4 py-3.5 flex items-center gap-3`}>
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
              <div>
                <p className={`text-xl font-bold leading-none ${text}`}>{count}</p>
                <p className={`text-[11px] mt-0.5 ${sub}`}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent queries list */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-stone-50 flex items-center justify-between">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Recent Queries</p>
            <p className="text-xs text-stone-400">{enquiries.length} total</p>
          </div>
          {enquiries.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faMessage} className="text-stone-300 text-lg" />
              </div>
              <p className="text-stone-400 text-sm">No contact queries yet</p>
              <p className="text-stone-300 text-xs mt-1">Queries from your site visitors will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {recentEnquiries.map(enq => (
                <div key={enq.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-stone-50/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faUser} className="text-stone-400 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-stone-800 truncate">{enq.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${ENQUIRY_BADGE[enq.status]}`}>{enq.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-stone-400 font-mono">{enq.phone}</p>
                      {enq.projects?.name && (
                        <>
                          <span className="text-stone-200">·</span>
                          <p className="text-xs text-stone-400 truncate">{enq.projects.name}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-300 shrink-0 whitespace-nowrap">
                    {new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              ))}
              {enquiries.length > 5 && (
                <div className="px-5 py-3 text-center">
                  <button
                    onClick={() => onTabChange('enquiries')}
                    className="text-xs text-vvva-orange hover:underline font-medium"
                  >
                    +{enquiries.length - 5} more — view all enquiries
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Projects manage panel (plot/image management only — creation/edit in ProjectsManager) ──
function ProjectsPanel({ projects, onRefresh }) {
  const [expanded, setExpanded] = useState(null);
  const [addImageFor, setAddImageFor] = useState(null);

  const handleDeleteImage = async (imgId) => {
    if (!confirm('Delete this image?')) return;
    await deleteProjectImage(imgId);
    onRefresh();
  };

  const handlePlotStatus = async (slotId, status) => {
    await updatePlotStatus(slotId, status);
    onRefresh();
  };

  return (
    <div>
      <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-6">Manage Projects</h2>
      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img src={p.card_image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                <div className="text-left">
                  <p className="font-semibold text-stone-800">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.location} · {p.price_range}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-stone-400 transition-transform text-sm ${expanded === p.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {expanded === p.id && (
              <div className="border-t border-stone-100 px-6 py-5 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-stone-400 text-xs uppercase font-semibold">Description</span><p className="text-stone-600 mt-1 text-[13px]">{p.description}</p></div>
                  <div className="space-y-2">
                    <div><span className="text-stone-400 text-xs">RERA</span><p className="text-stone-700 text-xs font-mono">{p.rera_number}</p></div>
                    <div><span className="text-stone-400 text-xs">Area</span><p className="text-stone-700 text-xs">{p.total_area_acres} acres</p></div>
                    <div><span className="text-stone-400 text-xs">Coordinates</span><p className="text-stone-700 text-xs font-mono">{p.map_lat}, {p.map_lng}</p></div>
                  </div>
                </div>

                <GoogleMapsEditor project={p} onSaved={onRefresh} />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-stone-700">Gallery Images ({p.images?.length || 0})</h4>
                    <button onClick={() => setAddImageFor(p.id)}
                      className="flex items-center gap-1.5 text-xs text-vvva-orange border border-vvva-orange/30 hover:bg-vvva-orange/5 px-3 py-1.5 rounded-lg transition-colors">
                      <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Image
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {(p.images || []).map(img => (
                      <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors flex items-center justify-center">
                          <button onClick={() => handleDeleteImage(img.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1.5 rounded-lg transition-opacity">
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          </button>
                        </div>
                        {img.caption && <p className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-white text-[9px] px-1.5 py-0.5 truncate">{img.caption}</p>}
                      </div>
                    ))}
                  </div>
                </div>

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
                              <select value={slot.status} onChange={e => handlePlotStatus(slot.id, e.target.value)}
                                className="text-[10px] border border-stone-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-vvva-orange/30">
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

      {addImageFor && (
        <AddImageModal projectId={addImageFor} onClose={() => setAddImageFor(null)} onAdded={onRefresh} />
      )}
    </div>
  );
}

// ── Enquiries panel ────────────────────────────────────────────────────────────
function EnquiriesPanel({ enquiries, onRefresh }) {
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const handleStatus = async (id, status) => {
    await updateEnquiryStatus(id, status);
    onRefresh();
  };

  return (
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
                    <select value={enq.status} onChange={e => handleStatus(enq.id, e.target.value)}
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-vvva-orange/25">
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
  );
}

// ── Nav items config ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',          icon: faTableColumns },
  { id: 'property',   label: 'Property Projects',  icon: faBuilding },
  { id: 'projects',   label: 'Manage Projects',    icon: faLocationDot },
  { id: 'enquiries',  label: 'Enquiries',          icon: faMessage },
  { id: 'popup',      label: 'Popup Video',        icon: faVideo },
  { id: 'profile',    label: 'My Profile',         icon: faUserCircle },
];

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleExpire = useCallback(async () => {
    await signOut();
    navigate('/admin', { replace: true });
  }, [navigate]);

  const sessionRemaining = useSessionTimer(handleExpire);
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const navigate_to = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-vvva-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label || '';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-row">
      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {/* On mobile: off-canvas drawer (fixed, full height, slides in)      */}
      {/* On lg+: grid column, sticky, full viewport height                 */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-stone-900 flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:self-start lg:z-auto lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ width: '260px', height: '100vh' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/vvva-logo copy copy.png"
              alt="VVVA Developer"
              className="h-9 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
            <p className="text-stone-500 text-[10px] tracking-widest uppercase">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon }) => {
            const isActive = activeTab === id;
            const badge = id === 'enquiries' && newEnquiries > 0 ? newEnquiries : null;
            return (
              <button
                key={id}
                onClick={() => navigate_to(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-vvva-orange text-white shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <FontAwesomeIcon icon={icon} className="text-sm w-4 shrink-0" />
                <span className="flex-1 text-left truncate">{label}</span>
                {badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div className="border-t border-stone-800 p-4 space-y-3 shrink-0">
          {sessionRemaining !== null && (
            <SessionBadge remaining={sessionRemaining} compact={false} />
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faUser} className="text-stone-400 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{session.user.email}</p>
              <p className="text-stone-500 text-[10px]">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-xs text-stone-400 hover:text-red-400 hover:bg-stone-800 px-3 py-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full">
        {/* Top bar (mobile) */}
        <header className="bg-white border-b border-stone-100 px-4 h-14 flex items-center justify-between lg:hidden sticky top-0 z-30 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-stone-600 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
          <p className="font-semibold text-stone-800 text-sm">{activeLabel}</p>
          <SessionBadge remaining={sessionRemaining} compact={true} />
        </header>

        {/* Top bar (desktop) */}
        <header className="hidden lg:flex bg-white border-b border-stone-100 px-6 items-center justify-between sticky top-0 z-30 shrink-0" style={{ height: '52px' }}>
          <p className="font-semibold text-stone-700 text-sm">{activeLabel}</p>
          <SessionBadge remaining={sessionRemaining} compact={false} />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <OverviewPanel projects={projects} enquiries={enquiries} onTabChange={navigate_to} />
              )}
              {activeTab === 'property' && (
                <ProjectsManager projects={projects} onRefresh={refresh} />
              )}
              {activeTab === 'projects' && (
                <ProjectsPanel projects={projects} onRefresh={refresh} />
              )}
              {activeTab === 'enquiries' && (
                <EnquiriesPanel enquiries={enquiries} onRefresh={refresh} />
              )}
              {activeTab === 'popup' && <PopupVideoPanel />}
              {activeTab === 'profile' && <AdminProfile session={session} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
