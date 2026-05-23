import { supabase } from './supabase';

const EDGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`;
const SESSION_EXPIRY_KEY = 'vvva_admin_session_expiry';
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
};

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

export async function sendOtp(email: string, mode: 'signin' | 'signup') {
  const res = await fetch(`${EDGE_BASE}/send-otp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, mode }),
  });
  return res.json();
}

export async function verifyOtp(email: string, code: string, mode: 'signin' | 'signup') {
  const res = await fetch(`${EDGE_BASE}/verify-otp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, code, mode }),
  });
  return res.json();
}

export async function establishSession(actionLink: string) {
  const urlObj = new URL(actionLink);
  const token = urlObj.searchParams.get('token');
  const type = urlObj.searchParams.get('type');
  if (token && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: 'magiclink' });
    if (error) return { error: error.message };
  }
  return { success: true };
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
