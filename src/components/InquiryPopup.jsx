import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark, faPhone, faPlay, faPause, faVolumeHigh, faVolumeLow,
  faVolumeXmark, faExpand, faCompress, faGear, faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { fetchPopupVideo } from '../lib/db';

const MAIN_PHONE = '+919845659193';
const SUB_PHONES = [
  { display: '+91 72044 01456', tel: '+917204401456' },
  { display: '+91 93536 40323', tel: '+919353640323' },
];
const WA_PHONE = '919845659193';
const SHOW_AFTER_MS = 2000;

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = null;
    if (u.hostname.includes('youtu.be')) videoId = u.pathname.slice(1).split('?')[0];
    else if (u.hostname.includes('youtube.com')) videoId = u.searchParams.get('v');
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1`;
  } catch {
    return null;
  }
}

function formatTime(s) {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ── Custom video player for uploaded videos ──────────────────────────────────
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const seekRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);
  const [ended, setEnded] = useState(false);

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2800);
  }, [playing]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => {});
    return () => clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => {
    scheduleHide();
  }, [playing, scheduleHide]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); setEnded(false); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newMuted = !v.muted;
    v.muted = newMuted;
    setMuted(newMuted);
    if (!newMuted && volume === 0) { v.volume = 0.5; setVolume(0.5); }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = seekRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
  };

  const changeRate = (rate) => {
    const v = videoRef.current;
    if (v) v.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
    setEnded(false);
  };

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumeIcon = muted || volume === 0 ? faVolumeXmark : volume < 0.5 ? faVolumeLow : faVolumeHigh;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      onClick={(e) => { if (e.target === e.currentTarget) togglePlay(); }}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        onTimeUpdate={(e) => {
          setCurrentTime(e.target.currentTime);
          const b = e.target.buffered;
          if (b.length) setBuffered((b.end(b.length - 1) / e.target.duration) * 100);
        }}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onPlay={() => { setPlaying(true); setEnded(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setEnded(true); setShowControls(true); }}
      />

      {/* Click-to-play overlay (center) */}
      {!playing && !ended && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30">
            <FontAwesomeIcon icon={faPlay} className="text-white text-xl ml-1" />
          </div>
        </button>
      )}

      {/* Replay overlay */}
      {ended && (
        <button
          onClick={replay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Replay"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30">
            <FontAwesomeIcon icon={faRotateRight} className="text-white text-xl" />
          </div>
        </button>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
      >
        {/* Seek bar */}
        <div
          ref={seekRef}
          className="mx-3 mb-1 h-1 rounded-full bg-white/25 cursor-pointer relative group"
          onClick={handleSeek}
        >
          {/* Buffered */}
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${buffered}%` }} />
          {/* Played */}
          <div className="absolute inset-y-0 left-0 rounded-full bg-vvva-orange transition-all" style={{ width: `${progressPercent}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 translate-x-1/2 transition-opacity" />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-2 px-3 pb-2 pt-0.5">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white hover:text-vvva-orange transition-colors w-6 text-center" aria-label={playing ? 'Pause' : 'Play'}>
            <FontAwesomeIcon icon={playing ? faPause : faPlay} className="text-sm" />
          </button>

          {/* Replay */}
          <button onClick={replay} className="text-white/70 hover:text-white transition-colors w-5 text-center" aria-label="Replay">
            <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
          </button>

          {/* Time */}
          <span className="text-white/70 text-[10px] font-mono tabular-nums ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5 group/vol">
            <button onClick={toggleMute} className="text-white hover:text-vvva-orange transition-colors w-5 text-center" aria-label="Mute/Unmute">
              <FontAwesomeIcon icon={volumeIcon} className="text-xs" />
            </button>
            <input
              type="range"
              min="0" max="1" step="0.02"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-0 group-hover/vol:w-14 overflow-hidden transition-all duration-200 accent-vvva-orange h-1 cursor-pointer"
              aria-label="Volume"
            />
          </div>

          {/* Settings (playback speed) */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(s => !s)}
              className={`text-white hover:text-vvva-orange transition-colors w-5 text-center ${showSettings ? 'text-vvva-orange' : ''}`}
              aria-label="Settings"
            >
              <FontAwesomeIcon icon={faGear} className="text-xs" />
            </button>
            {showSettings && (
              <div className="absolute bottom-7 right-0 bg-stone-900/95 border border-white/10 rounded-lg overflow-hidden shadow-xl w-36 z-20">
                <p className="text-[10px] text-white/40 uppercase tracking-wider px-3 pt-2 pb-1 font-semibold">Playback Speed</p>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => changeRate(rate)}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${playbackRate === rate ? 'text-vvva-orange bg-white/5 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
                  >
                    {rate === 1 ? 'Normal' : `${rate}x`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-vvva-orange transition-colors w-5 text-center" aria-label="Fullscreen">
            <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main popup ────────────────────────────────────────────────────────────────
export default function InquiryPopup() {
  const [show, setShow] = useState(false);
  const [videoConfig, setVideoConfig] = useState(null);
  const videoFetched = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('inquiryPopupDismissed')) return;
    let cancelled = false;

    if (!videoFetched.current) {
      videoFetched.current = true;
      fetchPopupVideo()
        .then(cfg => { if (!cancelled) setVideoConfig(cfg); })
        .catch(() => { if (!cancelled) setVideoConfig(null); });
    }

    const timer = setTimeout(() => { if (!cancelled) setShow(true); }, SHOW_AFTER_MS);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('inquiryPopupDismissed', '1');
  };

  if (!show) return null;

  const isActive = videoConfig?.is_active;
  const videoType = videoConfig?.video_type || 'youtube';
  const hasYoutube = isActive && videoType === 'youtube' && videoConfig?.youtube_url;
  const hasUpload = isActive && videoType === 'upload' && videoConfig?.uploaded_video_url;
  const embedUrl = hasYoutube ? getYouTubeEmbedUrl(videoConfig.youtube_url) : null;
  const hasVideo = !!embedUrl || hasUpload;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className={`relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp ${hasVideo ? 'max-w-xl' : 'max-w-sm'}`}
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-700 bg-white rounded-full shadow-sm hover:shadow transition-all"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* YouTube embed */}
        {embedUrl && (
          <div className="w-full" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={embedUrl}
              title="Property Inquiry Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        )}

        {/* Uploaded video — custom player with full controls */}
        {hasUpload && !embedUrl && (
          <VideoPlayer src={videoConfig.uploaded_video_url} />
        )}

        <div className="px-6 pt-5 pb-6 text-center">
          {!hasVideo && (
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faPhone} className="text-vvva-orange text-xl" />
            </div>
          )}

          <h3 className="font-playfair font-bold text-xl text-vvva-black mb-1">
            Property Inquiry?
          </h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Speak directly with our property advisor for personalized guidance on plots and projects.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={`tel:${MAIN_PHONE}`}
              onClick={dismiss}
              className="flex items-center justify-center gap-2 bg-vvva-orange text-white font-semibold py-3 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <FontAwesomeIcon icon={faPhone} />
              Call Us Now
            </a>
            <div className="grid grid-cols-2 gap-2">
              {SUB_PHONES.map(({ display, tel }) => (
                <a
                  key={tel}
                  href={`tel:${tel}`}
                  onClick={dismiss}
                  className="flex items-center justify-center gap-1.5 border border-vvva-orange/30 text-vvva-orange text-xs font-semibold py-2.5 rounded-xl hover:bg-vvva-orange/5 active:scale-[0.98] transition-all duration-150"
                >
                  <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                  {display}
                </a>
              ))}
            </div>
            <a
              href={`https://wa.me/${WA_PHONE}?text=Hello%2C%20I%20am%20interested%20in%20your%20properties.%20Please%20guide%20me.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              WhatsApp Us
            </a>
            <button
              onClick={dismiss}
              className="text-xs text-gray-400 hover:text-gray-500 transition-colors mt-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
