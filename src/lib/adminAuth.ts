import { supabase } from './supabase';

const EDGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
};

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

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
