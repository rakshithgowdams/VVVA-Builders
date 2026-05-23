import { supabase } from './supabase';

export type ProjectStatus = 'open' | 'future' | 'closed';
export type PlotStatus = 'available' | 'booked' | 'sold';
export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export interface Project {
  id: number;
  name: string;
  location: string;
  status: ProjectStatus;
  description: string;
  card_image_url: string;
  site_layout_image_url: string;
  hero_image_url: string;
  price_range: string;
  rera_number: string;
  total_area_acres: number;
  launch_date: string | null;
  map_lat: number;
  map_lng: number;
  google_maps_url: string;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
  plot_slots?: PlotSlot[];
}

export interface ProjectImage {
  id: number;
  project_id: number;
  url: string;
  caption: string;
  display_order: number;
  created_at: string;
}

export interface PlotSlot {
  id: number;
  project_id: number;
  bite_no: number;
  dimensions: string;
  sqft: number;
  direction: string;
  status: PlotStatus;
  price_lakhs: number;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: number;
  project_id: number | null;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  projects?: { name: string } | null;
}

// ── Projects ──────────────────────────────────────────────────────────────────

const PROJECT_SELECT = `
  *,
  images:project_images ( id, project_id, url, caption, display_order, created_at ),
  plot_slots ( id, project_id, bite_no, dimensions, sqft, direction, status, price_lakhs, details, created_at, updated_at )
`;

const CACHE_KEY = 'vvva_projects_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory cache — survives component re-renders within the same page session
let _memCache: { data: Project[]; ts: number } | null = null;

// In-flight promise — deduplicates concurrent calls (e.g. StrictMode double-invoke)
let _inflight: Promise<Project[]> | null = null;

function readSessionCache(): Project[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: Project[]; ts: number };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeSessionCache(data: Project[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // sessionStorage full or unavailable — not critical
  }
}

export function getCachedProjects(): Project[] | null {
  if (_memCache && Date.now() - _memCache.ts < CACHE_TTL_MS) return _memCache.data;
  return readSessionCache();
}

export function invalidateProjectsCache() {
  _memCache = null;
  _inflight = null;
  try { sessionStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

function isTransientError(msg: string) {
  const lower = msg.toLowerCase();
  return lower.includes('schema cache') || lower.includes('fetching') || lower.includes('network');
}

async function _doFetch(): Promise<Project[]> {
  let { data, error } = await supabase.from('projects').select(PROJECT_SELECT).order('id');

  // Retry up to 3 times on transient errors (schema cache, network blips on cold start)
  for (let attempt = 1; attempt <= 3 && error && isTransientError(error.message); attempt++) {
    await new Promise((r) => setTimeout(r, attempt * 1000));
    ({ data, error } = await supabase.from('projects').select(PROJECT_SELECT).order('id'));
  }

  if (error) {
    console.error('[db] fetchAllProjectsWithDetails error:', error);
    throw new Error(error.message);
  }

  const result = (data ?? []).map((p: any) => ({
    ...p,
    images: (p.images ?? []).sort((a: ProjectImage, b: ProjectImage) => a.display_order - b.display_order),
    plot_slots: (p.plot_slots ?? []).sort((a: PlotSlot, b: PlotSlot) => a.bite_no - b.bite_no),
  }));

  _memCache = { data: result, ts: Date.now() };
  writeSessionCache(result);
  _inflight = null;
  return result;
}

export async function fetchAllProjectsWithDetails(): Promise<Project[]> {
  // Return memory cache instantly if fresh
  if (_memCache && Date.now() - _memCache.ts < CACHE_TTL_MS) return _memCache.data;

  // Deduplicate concurrent fetches — only one network call at a time
  if (_inflight) return _inflight;

  _inflight = _doFetch();
  return _inflight;
}

// Kick off a background prefetch immediately when this module loads —
// so by the time the user's browser renders ProjectsSection, the data
// may already be in-flight or done.
if (typeof window !== 'undefined') {
  const cached = readSessionCache();
  if (cached) {
    _memCache = { data: cached, ts: Date.now() };
  } else {
    // Fire and forget — errors handled inside _doFetch
    fetchAllProjectsWithDetails().catch(() => {});
  }
}

export async function fetchProjectWithDetails(id: number): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      images:project_images ( id, project_id, url, caption, display_order, created_at ),
      plot_slots ( id, project_id, bite_no, dimensions, sqft, direction, status, price_lakhs, details, created_at, updated_at )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[db] fetchProjectWithDetails error:', error);
    throw new Error(error.message);
  }
  if (!data) return null;

  return {
    ...data,
    images: (data.images ?? []).sort((a: ProjectImage, b: ProjectImage) => a.display_order - b.display_order),
    plot_slots: (data.plot_slots ?? []).sort((a: PlotSlot, b: PlotSlot) => a.bite_no - b.bite_no),
  };
}

// ── Plot Slots ─────────────────────────────────────────────────────────────────

export async function updatePlotStatus(slotId: number, status: PlotStatus): Promise<void> {
  const { error } = await supabase
    .from('plot_slots')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', slotId);
  if (error) throw new Error(error.message);
}

// ── Enquiries ──────────────────────────────────────────────────────────────────

export async function submitEnquiry(data: {
  project_id?: number | null;
  name: string;
  phone: string;
  email?: string;
  message?: string;
}): Promise<void> {
  const { error } = await supabase.from('enquiries').insert({
    project_id: data.project_id ?? null,
    name: data.name,
    phone: data.phone,
    email: data.email ?? '',
    message: data.message ?? '',
  });
  if (error) throw new Error(error.message);
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*, projects ( name )')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateEnquiryStatus(id: number, status: EnquiryStatus): Promise<void> {
  const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Admin: project images ──────────────────────────────────────────────────────

export async function addProjectImage(projectId: number, url: string, caption?: string): Promise<void> {
  const { data: maxRow } = await supabase
    .from('project_images')
    .select('display_order')
    .eq('project_id', projectId)
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from('project_images').insert({
    project_id: projectId,
    url,
    caption: caption ?? '',
    display_order: (maxRow?.display_order ?? 0) + 1,
  });
  if (error) throw new Error(error.message);
}

export async function deleteProjectImage(imageId: number): Promise<void> {
  const { error } = await supabase.from('project_images').delete().eq('id', imageId);
  if (error) throw new Error(error.message);
}

export interface ProjectInput {
  name: string;
  location: string;
  status: ProjectStatus;
  description: string;
  card_image_url: string;
  site_layout_image_url: string;
  hero_image_url: string;
  price_range: string;
  rera_number: string;
  total_area_acres: number;
  launch_date: string | null;
  map_lat: number | null;
  map_lng: number | null;
  google_maps_url: string;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
  return data;
}

export async function updateProject(id: number, input: Partial<ProjectInput>): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
}

export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
}

export interface PlotSlotInput {
  project_id: number;
  bite_no: number;
  dimensions: string;
  sqft: number;
  direction: string;
  status: PlotStatus;
  price_lakhs: number;
  details: string;
}

export async function addPlotSlot(input: PlotSlotInput): Promise<void> {
  const { error } = await supabase.from('plot_slots').insert(input);
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
}

export async function deletePlotSlot(slotId: number): Promise<void> {
  const { error } = await supabase.from('plot_slots').delete().eq('id', slotId);
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
}

export async function updatePlotSlot(slotId: number, input: Partial<Omit<PlotSlotInput, 'project_id'>>): Promise<void> {
  const { error } = await supabase
    .from('plot_slots')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', slotId);
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
}

export async function updateProjectGoogleMapsUrl(projectId: number, google_maps_url: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ google_maps_url, updated_at: new Date().toISOString() })
    .eq('id', projectId);
  if (error) throw new Error(error.message);
  invalidateProjectsCache();
}

// ── Popup Video ────────────────────────────────────────────────────────────────

export interface PopupVideo {
  id: number;
  youtube_url: string;
  is_active: boolean;
  video_type: 'youtube' | 'upload';
  uploaded_video_url: string;
  updated_at: string;
}

export async function fetchPopupVideo(): Promise<PopupVideo | null> {
  const { data, error } = await supabase
    .from('popup_video')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePopupVideo(
  fields: { youtube_url?: string; is_active?: boolean; video_type?: 'youtube' | 'upload'; uploaded_video_url?: string }
): Promise<void> {
  const { error } = await supabase
    .from('popup_video')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw new Error(error.message);
}

export async function uploadPopupVideo(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const path = `popup-${Date.now()}.${ext}`;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be signed in to upload videos. Please refresh and try again.');

  const { error } = await supabase.storage
    .from('popup-videos')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error('[db] uploadPopupVideo error:', error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('popup-videos').getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePopupVideoFile(url: string): Promise<void> {
  const parts = url.split('/popup-videos/');
  if (parts.length < 2) return;
  const path = parts[1].split('?')[0];
  await supabase.storage.from('popup-videos').remove([path]);
}

// ── Leads ──────────────────────────────────────────────────────────────────────

export async function submitLead(data: {
  name: string;
  phone: string;
  email?: string;
  project_interest?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  message?: string;
}): Promise<void> {
  const { error } = await supabase.from('leads').insert({
    name: data.name,
    phone: data.phone,
    email: data.email ?? '',
    project_interest: data.project_interest ?? '',
    source_page: data.source_page ?? '',
    utm_source: data.utm_source ?? '',
    utm_medium: data.utm_medium ?? '',
    utm_campaign: data.utm_campaign ?? '',
    message: data.message ?? '',
  });
  if (error) throw new Error(error.message);
}

// ── Admin Profiles ─────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  phone: string;
  updated_at: string;
}

export async function fetchAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertAdminProfile(profile: Omit<AdminProfile, 'updated_at'>): Promise<void> {
  const { error } = await supabase
    .from('admin_profiles')
    .upsert({ ...profile, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw new Error(error.message);
}

export async function uploadAdminAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be signed in to upload your avatar. Please refresh and try again.');

  const { error: uploadError } = await supabase.storage
    .from('admin-avatars')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error('[db] uploadAdminAvatar error:', uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from('admin-avatars').getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteAdminAvatar(userId: string): Promise<void> {
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  for (const ext of extensions) {
    await supabase.storage.from('admin-avatars').remove([`${userId}/avatar.${ext}`]);
  }
}

// ── Image URL helpers ──────────────────────────────────────────────────────────

export function imgUrl(url: string | null | undefined, width: number, quality = 75): string {
  if (!url) return '';
  if (!url.includes('/storage/v1/object/public/')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}width=${width}&quality=${quality}&resize=cover`;
}

// ── Site Images ────────────────────────────────────────────────────────────────

export interface SiteImage {
  id: number;
  key: string;
  url: string;
  alt: string;
  section: string;
  display_order: number;
}

export async function fetchSiteImages(): Promise<SiteImage[]> {
  const { data, error } = await supabase
    .from('site_images')
    .select('id, key, url, alt, section, display_order')
    .order('display_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchSiteImageByKey(key: string): Promise<SiteImage | null> {
  const { data, error } = await supabase
    .from('site_images')
    .select('id, key, url, alt, section, display_order')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// ── Project Image Upload ───────────────────────────────────────────────────────

export async function uploadProjectImage(file: File, folder: string = 'gallery'): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be signed in to upload images. Please refresh and try again.');

  const { error } = await supabase.storage
    .from('project-images')
    .upload(filename, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error('[db] uploadProjectImage error:', error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('project-images').getPublicUrl(filename);
  return data.publicUrl;
}
