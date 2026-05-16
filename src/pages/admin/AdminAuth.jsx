import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ArrowRight, RefreshCw, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { sendOtp, verifyOtp } from '../../lib/adminAuth';
import { supabase } from '../../lib/supabase';


export default function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const startCountdown = () => {
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    const res = await sendOtp(email.trim(), mode);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    setStep('otp');
    startCountdown();
  };

  const handleOtpInput = (val, idx) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setError('');
    setLoading(true);
    const res = await verifyOtp(email.trim(), code, mode);
    setLoading(false);
    if (res.error) { setError(res.error); return; }

    // Use the magic link to establish a session
    if (res.action_link) {
      const urlObj = new URL(res.action_link);
      const token = urlObj.searchParams.get('token');
      const type = urlObj.searchParams.get('type');
      if (token && type) {
        const { error: verifyErr } = await supabase.auth.verifyOtp({ token_hash: token, type: 'magiclink' });
        if (verifyErr) { setError(verifyErr.message); return; }
      }
    }

    navigate('/admin/dashboard');
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    const res = await sendOtp(email.trim(), mode);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    startCountdown();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep('email');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-700 px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/WhatsApp_Image_2026-05-03_at_22.45.12_1.png"
                alt="VVVA Developer"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-sm mt-1">Secure admin portal</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-100">
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? 'text-vvva-orange border-b-2 border-vvva-orange bg-orange-50/50'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 'email' && (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSendOtp}
                  className="space-y-5"
                >
                  <div>
                    <p className="text-stone-600 text-sm mb-5">
                      {mode === 'signin'
                        ? 'Enter your admin email and we\'ll send you a one-time password.'
                        : 'Create your admin account. We\'ll send a one-time password to verify your email.'}
                    </p>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all bg-stone-50"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && <ErrorBox message={error} />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-vvva-orange hover:bg-vvva-orange-dark disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? <Spinner /> : <>Send OTP <ArrowRight size={15} /></>}
                  </button>
                </motion.form>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <KeyRound size={22} className="text-vvva-orange" />
                    </div>
                    <p className="text-stone-700 text-sm font-medium">OTP sent to</p>
                    <p className="text-vvva-orange font-semibold text-sm mt-0.5">{email}</p>
                    <p className="text-stone-400 text-xs mt-2">Check your inbox and enter the 6-digit code</p>
                  </div>

                  {/* OTP boxes */}
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        className={`w-11 h-13 text-center text-xl font-bold border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-vvva-orange/30 ${
                          digit
                            ? 'border-vvva-orange bg-orange-50 text-vvva-orange'
                            : 'border-stone-200 bg-stone-50 text-stone-700'
                        }`}
                        style={{ height: '52px' }}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {error && <ErrorBox message={error} />}

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="w-full bg-vvva-orange hover:bg-vvva-orange-dark disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? <Spinner /> : <><CheckCircle size={15} /> Verify & {mode === 'signin' ? 'Sign In' : 'Create Account'}</>}
                  </button>

                  <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                    <button
                      type="button"
                      onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); }}
                      className="hover:text-stone-600 transition-colors"
                    >
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCountdown > 0}
                      className="flex items-center gap-1 disabled:opacity-50 hover:text-vvva-orange transition-colors"
                    >
                      <RefreshCw size={11} />
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          VVVA Developer Admin Portal &mdash; Authorized access only
        </p>
      </motion.div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
      <AlertCircle size={15} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}
