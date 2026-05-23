import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faPencil, faTrash, faXmark, faCheck, faChevronDown,
  faChevronLeft, faSpinner, faCircleExclamation, faImage,
  faMapMarkerAlt, faBuilding, faLayerGroup, faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  createProject, updateProject, deleteProject,
  addPlotSlot, deletePlotSlot, addProjectImage, deleteProjectImage,
  updatePlotStatus,
} from '../lib/db';

const STATUS_OPTS = ['open', 'future', 'closed'];
const DIRECTION_OPTS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const PLOT_STATUS_OPTS = ['available', 'booked', 'sold'];

const PLOT_BADGE = {
  available: 'bg-green-100 text-green-700',
  booked: 'bg-blue-100 text-blue-700',
  sold: 'bg-stone-100 text-stone-500',
};
const STATUS_BADGE = {
  open: 'bg-green-100 text-green-700',
  future: 'bg-blue-100 text-blue-700',
  closed: 'bg-stone-100 text-stone-500',
};

// ── Field component ────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all"
      {...rest}
    />
  );
}

function Select({ value, onChange, options, labelFn }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all"
    >
      {options.map(o => (
        <option key={o} value={o}>{labelFn ? labelFn(o) : o.charAt(0).toUpperCase() + o.slice(1)}</option>
      ))}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all resize-none"
    />
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EMPTY_FORM() {
  return {
    name: '', location: '', status: 'open', description: '',
    card_image_url: '', site_layout_image_url: '', hero_image_url: '',
    price_range: '', rera_number: '', total_area_acres: '',
    launch_date: '', map_lat: '', map_lng: '', google_maps_url: '',
  };
}

// ── Project Form (full create/edit) ───────────────────────────────────────────
function ProjectForm({ project, onSaved, onCancel }) {
  const isEdit = !!project;
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          name: project.name || '',
          location: project.location || '',
          status: project.status || 'open',
          description: project.description || '',
          card_image_url: project.card_image_url || '',
          site_layout_image_url: project.site_layout_image_url || '',
          hero_image_url: project.hero_image_url || '',
          price_range: project.price_range || '',
          rera_number: project.rera_number || '',
          total_area_acres: project.total_area_acres ?? '',
          launch_date: project.launch_date || '',
          map_lat: project.map_lat ?? '',
          map_lng: project.map_lng ?? '',
          google_maps_url: project.google_maps_url || '',
        }
      : EMPTY_FORM()
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      setErr('Name and Location are required.');
      return;
    }
    setErr('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        total_area_acres: form.total_area_acres === '' ? 0 : parseFloat(form.total_area_acres),
        map_lat: form.map_lat === '' ? null : parseFloat(form.map_lat),
        map_lng: form.map_lng === '' ? null : parseFloat(form.map_lng),
        launch_date: form.launch_date || null,
      };
      if (isEdit) {
        await updateProject(project.id, payload);
      } else {
        await createProject(payload);
      }
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div>
          <h2 className="font-playfair font-bold text-xl text-stone-800">
            {isEdit ? `Edit: ${project.name}` : 'Create New Project'}
          </h2>
          <p className="text-stone-400 text-xs mt-0.5">{isEdit ? 'Update all project information below.' : 'Fill in the details to create a new property project.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Core Info ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faBuilding} className="text-vvva-orange text-sm" />
              <h3 className="font-semibold text-stone-800 text-sm">Core Information</h3>
            </div>
            <Field label="Project Name" required>
              <Input value={form.name} onChange={set('name')} placeholder="e.g. Bhoovanahalli Enclave" />
            </Field>
            <Field label="Location" required>
              <Input value={form.location} onChange={set('location')} placeholder="e.g. Bhoovanahalli, Bangalore" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <Select value={form.status} onChange={set('status')} options={STATUS_OPTS} />
              </Field>
              <Field label="Price Range">
                <Input value={form.price_range} onChange={set('price_range')} placeholder="e.g. ₹45L – ₹80L" />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={form.description} onChange={set('description')} placeholder="Describe the project..." rows={4} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="RERA Number">
                <Input value={form.rera_number} onChange={set('rera_number')} placeholder="PRM/KA/RERA/..." />
              </Field>
              <Field label="Total Area (acres)">
                <Input type="number" value={form.total_area_acres} onChange={set('total_area_acres')} placeholder="5.5" />
              </Field>
            </div>
            <Field label="Launch Date">
              <Input type="date" value={form.launch_date} onChange={set('launch_date')} />
            </Field>
          </div>

          {/* ── Images + Location ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faImage} className="text-vvva-orange text-sm" />
                <h3 className="font-semibold text-stone-800 text-sm">Images</h3>
              </div>
              <Field label="Card Image URL" hint="Shown on the project listing card">
                <Input value={form.card_image_url} onChange={set('card_image_url')} placeholder="https://... or /image.webp" />
                {form.card_image_url && (
                  <img src={form.card_image_url} alt="card preview" className="mt-2 h-20 w-full object-cover rounded-lg border border-stone-100" />
                )}
              </Field>
              <Field label="Hero Image URL" hint="Large banner on project detail page">
                <Input value={form.hero_image_url} onChange={set('hero_image_url')} placeholder="https://... or /image.webp" />
                {form.hero_image_url && (
                  <img src={form.hero_image_url} alt="hero preview" className="mt-2 h-20 w-full object-cover rounded-lg border border-stone-100" />
                )}
              </Field>
              <Field label="Site Layout Image URL" hint="Plot layout / site map image">
                <Input value={form.site_layout_image_url} onChange={set('site_layout_image_url')} placeholder="https://... or /image.webp" />
                {form.site_layout_image_url && (
                  <img src={form.site_layout_image_url} alt="layout preview" className="mt-2 h-20 w-full object-cover rounded-lg border border-stone-100" />
                )}
              </Field>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-vvva-orange text-sm" />
                <h3 className="font-semibold text-stone-800 text-sm">Location & Map</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude">
                  <Input type="number" value={form.map_lat} onChange={set('map_lat')} placeholder="12.9716" />
                </Field>
                <Field label="Longitude">
                  <Input type="number" value={form.map_lng} onChange={set('map_lng')} placeholder="77.5946" />
                </Field>
              </div>
              <Field label="Google Maps Link" hint="Share link from Google Maps">
                <Input type="url" value={form.google_maps_url} onChange={set('google_maps_url')} placeholder="https://maps.google.com/..." />
                {form.google_maps_url && (
                  <a href={form.google_maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" /> Preview on Maps
                  </a>
                )}
              </Field>
            </div>
          </div>
        </div>

        {err && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0 mt-0.5" />
            <span>{err}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-vvva-orange hover:bg-orange-600 text-white disabled:opacity-60 transition-colors">
            {saving
              ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> Saving…</>
              : <><FontAwesomeIcon icon={faCheck} className="text-xs" /> {isEdit ? 'Save Changes' : 'Create Project'}</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Plot Slot Form ─────────────────────────────────────────────────────────────
function AddPlotForm({ projectId, onAdded, onClose }) {
  const [form, setForm] = useState({
    bite_no: '', dimensions: '', sqft: '', direction: 'North',
    status: 'available', price_lakhs: '', details: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bite_no || !form.dimensions || !form.sqft || !form.price_lakhs) {
      setErr('Plot No, Dimensions, Sqft and Price are required.'); return;
    }
    setErr(''); setSaving(true);
    try {
      await addPlotSlot({
        project_id: projectId,
        bite_no: parseInt(form.bite_no),
        dimensions: form.dimensions,
        sqft: parseInt(form.sqft),
        direction: form.direction,
        status: form.status,
        price_lakhs: parseFloat(form.price_lakhs),
        details: form.details,
      });
      onAdded();
      onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-stone-800">Add Plot Slot</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Plot No" required>
              <Input type="number" value={form.bite_no} onChange={set('bite_no')} placeholder="1" />
            </Field>
            <Field label="Dimensions (ft)" required>
              <Input value={form.dimensions} onChange={set('dimensions')} placeholder="30×40" />
            </Field>
            <Field label="Area (sqft)" required>
              <Input type="number" value={form.sqft} onChange={set('sqft')} placeholder="1200" />
            </Field>
            <Field label="Price (Lakhs)" required>
              <Input type="number" value={form.price_lakhs} onChange={set('price_lakhs')} placeholder="45" />
            </Field>
            <Field label="Facing Direction">
              <Select value={form.direction} onChange={set('direction')} options={DIRECTION_OPTS} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={set('status')} options={PLOT_STATUS_OPTS} />
            </Field>
          </div>
          <Field label="Details (optional)">
            <Textarea value={form.details} onChange={set('details')} placeholder="Any extra details..." rows={2} />
          </Field>
          {err && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-vvva-orange text-white disabled:opacity-60 transition-colors">
              {saving ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> Adding…</> : 'Add Plot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Add Image Modal ────────────────────────────────────────────────────────────
function AddImageModal({ projectId, onClose, onAdded }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleAdd = async () => {
    if (!url.trim()) { setErr('URL is required'); return; }
    setSaving(true);
    try { await addProjectImage(projectId, url.trim(), caption.trim()); onAdded(); onClose(); }
    catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-stone-800">Add Gallery Image</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Image URL" required>
            <Input value={url} onChange={setUrl} placeholder="/gallery-1.webp or https://..." />
            {url && <img src={url} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-stone-100" onError={e => e.target.style.display='none'} />}
          </Field>
          <Field label="Caption (optional)">
            <Input value={caption} onChange={setCaption} placeholder="Short description" />
          </Field>
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

// ── Project Detail (expand for images/plots management) ───────────────────────
function ProjectDetail({ project, onRefresh, onEdit, onBack }) {
  const [addPlot, setAddPlot] = useState(false);
  const [addImage, setAddImage] = useState(false);
  const [deletingPlot, setDeletingPlot] = useState(null);

  const handleDeletePlot = async (id) => {
    if (!confirm('Delete this plot slot? This cannot be undone.')) return;
    setDeletingPlot(id);
    try { await deletePlotSlot(id); onRefresh(); }
    catch (e) { alert(e.message); }
    finally { setDeletingPlot(null); }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Delete this image?')) return;
    try { await deleteProjectImage(id); onRefresh(); }
    catch (e) { alert(e.message); }
  };

  const handlePlotStatus = async (slotId, status) => {
    await updatePlotStatus(slotId, status);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="flex-1">
          <h2 className="font-playfair font-bold text-xl text-stone-800">{project.name}</h2>
          <p className="text-stone-400 text-xs mt-0.5">{project.location} · {project.price_range}</p>
        </div>
        <button onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-vvva-orange text-white hover:bg-orange-600 transition-colors">
          <FontAwesomeIcon icon={faPencil} className="text-xs" /> Edit Project
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero image preview */}
        {project.hero_image_url && (
          <div className="rounded-2xl overflow-hidden h-48 bg-stone-100">
            <img src={project.hero_image_url} alt={project.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Status', value: <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[project.status]}`}>{project.status}</span> },
            { label: 'Price Range', value: project.price_range || '—' },
            { label: 'RERA Number', value: <span className="font-mono text-xs">{project.rera_number || '—'}</span> },
            { label: 'Total Area', value: project.total_area_acres ? `${project.total_area_acres} acres` : '—' },
            { label: 'Coordinates', value: project.map_lat ? <span className="font-mono text-xs">{project.map_lat}, {project.map_lng}</span> : '—' },
            { label: 'Launch Date', value: project.launch_date || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1">{label}</p>
              <div className="text-sm text-stone-700 font-medium">{value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {project.description && (
          <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-stone-600 leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* Gallery Images */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faImage} className="text-vvva-orange text-sm" />
              <h3 className="font-semibold text-stone-800 text-sm">Gallery Images ({project.images?.length || 0})</h3>
            </div>
            <button onClick={() => setAddImage(true)}
              className="flex items-center gap-1.5 text-xs text-vvva-orange border border-vvva-orange/30 hover:bg-vvva-orange/5 px-3 py-1.5 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Image
            </button>
          </div>
          {(project.images?.length || 0) === 0 ? (
            <div className="bg-stone-50 rounded-xl py-8 text-center text-stone-300 border border-dashed border-stone-200">
              <FontAwesomeIcon icon={faImage} className="text-3xl mb-2 block mx-auto" />
              <p className="text-xs text-stone-400">No gallery images yet. Add one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {project.images.map(img => (
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
          )}
        </div>

        {/* Plot Slots */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLayerGroup} className="text-vvva-orange text-sm" />
              <h3 className="font-semibold text-stone-800 text-sm">Plot Slots ({project.plot_slots?.length || 0})</h3>
            </div>
            <button onClick={() => setAddPlot(true)}
              className="flex items-center gap-1.5 text-xs text-vvva-orange border border-vvva-orange/30 hover:bg-vvva-orange/5 px-3 py-1.5 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Plot
            </button>
          </div>

          {(project.plot_slots?.length || 0) === 0 ? (
            <div className="bg-stone-50 rounded-xl py-8 text-center border border-dashed border-stone-200">
              <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-stone-300 mb-2 block mx-auto" />
              <p className="text-xs text-stone-400">No plots yet. Add one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-stone-50">
                    {['Plot #', 'Dimensions', 'Sqft', 'Facing', 'Price', 'Status', 'Change', 'Delete'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-stone-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {project.plot_slots.map(slot => (
                    <tr key={slot.id} className="hover:bg-stone-50/50">
                      <td className="px-3 py-2.5 font-medium text-stone-600">{slot.bite_no}</td>
                      <td className="px-3 py-2.5 font-medium text-stone-700">{slot.dimensions} ft</td>
                      <td className="px-3 py-2.5 text-stone-500">{slot.sqft}</td>
                      <td className="px-3 py-2.5 text-stone-500">{slot.direction}</td>
                      <td className="px-3 py-2.5 text-stone-700 font-medium">₹{slot.price_lakhs}L</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${PLOT_BADGE[slot.status]}`}>{slot.status}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <select value={slot.status} onChange={e => handlePlotStatus(slot.id, e.target.value)}
                          className="text-[10px] border border-stone-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-vvva-orange/30">
                          {PLOT_STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => handleDeletePlot(slot.id)} disabled={deletingPlot === slot.id}
                          className="text-red-400 hover:text-red-600 disabled:opacity-40 p-1 rounded hover:bg-red-50 transition-colors">
                          <FontAwesomeIcon icon={deletingPlot === slot.id ? faSpinner : faTrash} className={`text-xs ${deletingPlot === slot.id ? 'animate-spin' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {addPlot && <AddPlotForm projectId={project.id} onAdded={onRefresh} onClose={() => setAddPlot(false)} />}
      {addImage && <AddImageModal projectId={project.id} onAdded={onRefresh} onClose={() => setAddImage(false)} />}
    </div>
  );
}

// ── Main Projects Manager ──────────────────────────────────────────────────────
export default function ProjectsManager({ projects, onRefresh }) {
  // view: 'list' | 'create' | 'edit' | 'detail'
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null); // project for edit/detail
  const [deleting, setDeleting] = useState(null);

  const handleSaved = () => { onRefresh(); setView('list'); setSelected(null); };

  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.name}"? All plot slots and images will be permanently removed.`)) return;
    setDeleting(project.id);
    try { await deleteProject(project.id); onRefresh(); }
    catch (e) { alert(e.message); }
    finally { setDeleting(null); }
  };

  if (view === 'create') {
    return <ProjectForm onSaved={handleSaved} onCancel={() => setView('list')} />;
  }
  if (view === 'edit' && selected) {
    return <ProjectForm project={selected} onSaved={handleSaved} onCancel={() => { setView('detail'); }} />;
  }
  if (view === 'detail' && selected) {
    // Find fresh project data
    const fresh = projects.find(p => p.id === selected.id) || selected;
    return (
      <ProjectDetail
        project={fresh}
        onRefresh={onRefresh}
        onEdit={() => { setSelected(fresh); setView('edit'); }}
        onBack={() => { setView('list'); setSelected(null); }}
      />
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair font-bold text-2xl text-stone-800">Property Projects</h2>
          <p className="text-stone-400 text-sm mt-0.5">Create, edit or delete property projects.</p>
        </div>
        <button
          onClick={() => setView('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-vvva-orange hover:bg-orange-600 text-white transition-colors shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-200 py-20 text-center">
          <FontAwesomeIcon icon={faBuilding} className="text-5xl text-stone-200 mb-4 block mx-auto" />
          <p className="text-stone-500 font-medium mb-1">No projects yet</p>
          <p className="text-stone-400 text-sm mb-5">Create your first property project to get started.</p>
          <button onClick={() => setView('create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-vvva-orange text-white hover:bg-orange-600 transition-colors">
            <FontAwesomeIcon icon={faPlus} className="text-xs" /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Card image */}
              <div className="relative h-40 bg-stone-100 overflow-hidden">
                {p.card_image_url ? (
                  <img src={p.card_image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faBuilding} className="text-4xl text-stone-300" />
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-sm ${STATUS_BADGE[p.status]}`}>
                  {p.status}
                </span>
              </div>

              {/* Card content */}
              <div className="p-4">
                <h3 className="font-semibold text-stone-800 text-sm mb-0.5 truncate">{p.name}</h3>
                <p className="text-stone-400 text-xs truncate">{p.location}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                  <span>{p.plot_slots?.length || 0} plots</span>
                  <span>·</span>
                  <span className="text-green-600 font-medium">{p.plot_slots?.filter(s => s.status === 'available').length || 0} available</span>
                  <span>·</span>
                  <span>{p.images?.length || 0} images</span>
                </div>
                {p.price_range && <p className="text-vvva-orange font-semibold text-xs mt-2">{p.price_range}</p>}
              </div>

              {/* Actions */}
              <div className="border-t border-stone-100 px-4 py-3 flex items-center gap-2">
                <button
                  onClick={() => { setSelected(p); setView('detail'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 border border-stone-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faLayerGroup} className="text-xs" /> Manage
                </button>
                <button
                  onClick={() => { setSelected(p); setView('edit'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-vvva-orange hover:bg-vvva-orange/5 border border-vvva-orange/30 transition-colors"
                >
                  <FontAwesomeIcon icon={faPencil} className="text-xs" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={deleting === p.id}
                  className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 transition-colors disabled:opacity-40"
                >
                  <FontAwesomeIcon icon={deleting === p.id ? faSpinner : faTrash} className={`text-xs ${deleting === p.id ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
