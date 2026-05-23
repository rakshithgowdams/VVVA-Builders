import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLocation } from 'react-router-dom';

export default function WhatsAppFab() {
  const location = useLocation();
  const pageContext = encodeURIComponent(`Hi, I'm interested in VVVA Developer residential plots in Hassan. (Page: ${location.pathname})`);

  return (
    <a
      href={`https://wa.me/919845659193?text=${pageContext}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      aria-label="Chat with VVVA Developer on WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
    </a>
  );
}
