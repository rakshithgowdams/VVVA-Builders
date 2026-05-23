import { useEffect, useState } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

const PHONE = '+919353241308';
const WA_PHONE = '919353241308';
const DELAY_MS = 3000;

export default function InquiryPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-5 pb-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3">
            <Phone size={22} className="text-vvva-orange" />
          </div>
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
              <Phone size={16} />
              Call Us Now
            </a>
            <a
              href={`https://wa.me/${WA_PHONE}?text=Hello%2C%20I%20am%20interested%20in%20your%20properties.%20Please%20guide%20me.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <MessageCircle size={16} />
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
