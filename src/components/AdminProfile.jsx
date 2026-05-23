import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera, faCheck, faXmark, faUser, faPhone, faEnvelope,
  faPen, faTrash, faSpinner, faShield, faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {
  fetchAdminProfile, upsertAdminProfile,
  uploadAdminAvatar, deleteAdminAvatar,
} from '../lib/db';
import ConfirmDialog from './ConfirmDialog';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function AvatarUploader({ userId, currentUrl, onChanged }) {
  const inputRef = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [preview, setPreview] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [err, setErr] = useState('');
  const [hover, setHover] = useState(false);
  const uploadingRef = useRef(false);

  // Only sync preview from prop when we're not mid-upload
  useEffect(() => {
    if (!uploadingRef.current) {
      setPreview(currentUrl || '');
    }
  }, [currentUrl]);

  const handleFile = async (file) => {
    setErr('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErr('Only JPG, PNG, WebP or GIF images are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErr('File too large. Maximum size is 5 MB.');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    uploadingRef.current = true;
    setUploading(true);
    try {
      const publicUrl = await uploadAdminAvatar(userId, file);
      setPreview(publicUrl);
      onChanged(publicUrl);
    } catch (e) {
      setErr(e.message);
      setPreview(currentUrl || '');
    } finally {
      setUploading(false);
      uploadingRef.current = false;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setConfirmDialog({
      title: 'Remove Profile Photo?',
      message: 'Are you sure you want to remove your profile photo? This cannot be undone.',
      confirmLabel: 'Remove Photo',
      onConfirm: async () => {
        uploadingRef.current = true;
        setRemoving(true);
        try {
          await deleteAdminAvatar(userId);
          setPreview('');
          onChanged('');
        } catch (e) {
          setErr(e.message);
        } finally {
          setRemoving(false);
          uploadingRef.current = false;
        }
      },
    });
  };

  const initials = '';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar circle */}
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-stone-200 to-stone-300 ring-4 ring-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-4xl text-stone-400" />
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className={`absolute inset-0 rounded-full bg-stone-900/50 flex items-center justify-center transition-opacity duration-200 ${hover || uploading ? 'opacity-100' : 'opacity-0'}`}>
          {uploading ? (
            <FontAwesomeIcon icon={faSpinner} className="text-white text-xl animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
          )}
        </div>

        {/* Upload badge */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-vvva-orange rounded-full flex items-center justify-center shadow-md border-2 border-white">
          <FontAwesomeIcon icon={faCamera} className="text-white text-xs" />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
      />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-semibold text-vvva-orange border border-vvva-orange/30 hover:bg-vvva-orange/5 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faCamera} className="text-xs" />
          {uploading ? 'Uploading…' : 'Change Photo'}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon icon={removing ? faSpinner : faTrash} className={`text-xs ${removing ? 'animate-spin' : ''}`} />
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400 text-center">
        JPG, PNG, WebP or GIF · Max 5 MB<br />
        Drag &amp; drop or click to upload
      </p>

      {err && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 w-full">
          <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0" />
          {err}
        </div>
      )}
      <ConfirmDialog config={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </div>
  );
}

function InputField({ label, icon, type = 'text', value, onChange, placeholder, multiline = false }) {
  const cls = 'w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all bg-stone-50 resize-none';
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <FontAwesomeIcon icon={icon} className="absolute left-3.5 top-3 text-stone-400 text-sm" />
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={cls}
            style={{ paddingTop: '10px' }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cls}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminProfile({ session }) {
  const userId = session?.user?.id;
  const userEmail = session?.user?.email || '';

  const [profile, setProfile] = useState({ display_name: '', avatar_url: '', bio: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!userId) return;
    fetchAdminProfile(userId)
      .then((p) => {
        if (p) setProfile({ display_name: p.display_name, avatar_url: p.avatar_url, bio: p.bio, phone: p.phone });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAvatarChanged = (url) => {
    setProfile((prev) => ({ ...prev, avatar_url: url }));
    // Auto-save avatar change immediately
    upsertAdminProfile({ id: userId, ...profile, avatar_url: url }).catch(() => {});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      await upsertAdminProfile({ id: userId, ...profile });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-7 h-7 border-2 border-vvva-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-playfair font-bold text-2xl text-stone-800 mb-1">My Profile</h2>
      <p className="text-stone-400 text-sm mb-8">Manage your admin account details and profile photo.</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col items-center gap-2"
        >
          <AvatarUploader
            userId={userId}
            currentUrl={profile.avatar_url}
            onChanged={handleAvatarChanged}
          />

          <div className="mt-4 text-center w-full border-t border-stone-100 pt-4 space-y-1">
            <p className="font-semibold text-stone-800 text-sm">{profile.display_name || 'Admin User'}</p>
            <p className="text-xs text-stone-400">{userEmail}</p>
          </div>

          {/* Security info */}
          <div className="w-full mt-2 bg-stone-50 rounded-xl p-3 border border-stone-100">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faShield} className="text-xs text-green-600" />
              <span className="text-xs font-semibold text-stone-600">Account Security</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Your account is secured with OTP-based authentication. No password is stored.
            </p>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faPen} className="text-vvva-orange text-sm" />
            <h3 className="font-semibold text-stone-800">Profile Details</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300 text-sm" />
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-100 rounded-xl text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Email cannot be changed — it is tied to your authentication.</p>
            </div>

            <InputField
              label="Display Name"
              icon={faUser}
              value={profile.display_name}
              onChange={(v) => setProfile((p) => ({ ...p, display_name: v }))}
              placeholder="e.g. Rakshith Gowda"
            />

            <InputField
              label="Phone Number"
              icon={faPhone}
              type="tel"
              value={profile.phone}
              onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
              placeholder="+91 98765 43210"
            />

            <InputField
              label="Bio"
              icon={faPen}
              multiline
              value={profile.bio}
              onChange={(v) => setProfile((p) => ({ ...p, bio: v }))}
              placeholder="A short description about yourself…"
            />

            {err && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0 mt-0.5 text-sm" />
                <span>{err}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-stone-400">
                {profile.avatar_url ? 'Profile photo saved.' : 'No profile photo set yet.'}
              </p>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-vvva-orange hover:bg-vvva-orange-dark text-white disabled:opacity-60'
                }`}
              >
                {saving ? (
                  <><FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> Saving…</>
                ) : saved ? (
                  <><FontAwesomeIcon icon={faCheck} className="text-xs" /> Saved!</>
                ) : (
                  <><FontAwesomeIcon icon={faCheck} className="text-xs" /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
