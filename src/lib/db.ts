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

export async function fetchAllProjectsWithDetails(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      images:project_images ( id, project_id, url, caption, display_order, created_at ),
      plot_slots ( id, project_id, bite_no, dimensions, sqft, direction, status, price_lakhs, details, created_at, updated_at )
    `)
    .order('id');

  if (error) {
    console.error('[db] fetchAllProjectsWithDetails error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    images: (p.images ?? []).sort((a: ProjectImage, b: ProjectImage) => a.display_order - b.display_order),
    plot_slots: (p.plot_slots ?? []).sort((a: PlotSlot, b: PlotSlot) => a.bite_no - b.bite_no),
  }));
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

export async function updateProjectGoogleMapsUrl(projectId: number, google_maps_url: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ google_maps_url, updated_at: new Date().toISOString() })
    .eq('id', projectId);
  if (error) throw new Error(error.message);
}

// ── Popup Video ────────────────────────────────────────────────────────────────

export interface PopupVideo {
  id: number;
  youtube_url: string;
  is_active: boolean;
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

export async function updatePopupVideo(youtube_url: string, is_active: boolean): Promise<void> {
  const { error } = await supabase
    .from('popup_video')
    .update({ youtube_url, is_active, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw new Error(error.message);
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
