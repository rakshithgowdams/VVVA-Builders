import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { fetchPopupVideo } from '../lib/db';

const PHONE = '+919353241308';
const WA_PHONE = '919353241308';
const DELAY_MS = 2000;

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = null;
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
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
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [videoConfig, setVideoConfig] = useState(null);

  useEffect(() => {
    fetchPopupVideo()
      .then(cfg => setVideoConfig(cfg))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('inquiryPopupDismissed')) {
        setVisible(true);
      }
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('inquiryPopupDismissed', '1');
  };

  if (!visible || dismissed) return null;

  const hasVideo = videoConfig?.is_active && videoConfig?.youtube_url;
  const embedUrl = hasVideo ? getYouTubeEmbedUrl(videoConfig.youtube_url) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className={`relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp ${embedUrl ? 'max-w-lg' : 'max-w-sm'}`}>
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 bg-white/80 backdrop-blur-sm"
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
              href={`tel:${PHONE}`}
              onClick={dismiss}
              className="flex items-center justify-center gap-2 bg-vvva-orange text-white font-semibold py-3 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <FontAwesomeIcon icon={faPhone} />
              Call Us Now
            </a>
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
