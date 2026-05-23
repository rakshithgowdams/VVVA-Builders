import { supabase } from './supabase';

const SESSION_EXPIRY_KEY = 'vvva_admin_session_expiry';
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export function setSessionExpiry() {
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
}

export function getSessionExpiry(): number | null {
  const val = localStorage.getItem(SESSION_EXPIRY_KEY);
  return val ? Number(val) : null;
}

export function clearSessionExpiry() {
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

export function isSessionExpired(): boolean {
  const expiry = getSessionExpiry();
  if (!expiry) return true;
  return Date.now() >= expiry;
}

export async function sendOtp(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: { shouldCreateUser: true },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.toLowerCase().trim(),
    token,
    type: 'email',
  });
  if (error) return { error: error.message };
  return { success: true, session: data.session };
}

export async function signOut() {
  clearSessionExpiry();
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  if (isSessionExpired()) {
    clearSessionExpiry();
    await supabase.auth.signOut();
    return null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}
