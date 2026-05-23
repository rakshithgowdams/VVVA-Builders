import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { fetchPopupVideo } from '../lib/db';

const MAIN_PHONE = '+919845659193';
const SUB_PHONES = [
  { display: '+91 72044 01456', tel: '+917204401456', wa: '917204401456' },
  { display: '+91 93536 40323', tel: '+919353640323', wa: '919353640323' },
];
const WA_PHONE = '919845659193';
const SHOW_AFTER_MS = 2000;

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = null;
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1).split('?')[0];
    } else if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v');
    }
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

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

    const timer = setTimeout(() => {
      if (!cancelled) setShow(true);
    }, SHOW_AFTER_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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

  const hasVideo = videoConfig?.is_active && videoConfig?.youtube_url;
  const embedUrl = hasVideo ? getYouTubeEmbedUrl(videoConfig.youtube_url) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className={`relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp ${embedUrl ? 'max-w-lg' : 'max-w-sm'}`}
      >
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-700 bg-white rounded-full shadow-sm hover:shadow transition-all"
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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        )}

        <div className="px-6 pt-5 pb-6 text-center">
          {!embedUrl && (
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
