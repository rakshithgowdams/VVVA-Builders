import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCompass, faIndianRupeeSign, faRulerCombined, faFileLines, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ADMIN_PHONE = '919845659193';

export default function SlotInfoPanel({ slot, projectName, onClose }) {
  const buildWhatsAppMessage = () => {
    const lines = [
      `Hello VVVA Developer, I'm interested in the following plot:`,
      ``,
      `Project - ${projectName || 'N/A'}`,
      `Plot No (Bite) - ${slot.biteNo}`,
      `Dimensions - ${slot.dimensions} ft`,
      `Measurement - ${slot.measurement}`,
      `Direction - ${slot.direction}`,
      `Price - ${slot.price}`,
      ``,
      `Please share more details. Thank you!`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  return (
    <AnimatePresence>
      {slot && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="mt-4 bg-white border border-vvva-orange/30 rounded-card p-5 relative">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-vvva-orange transition-colors"
              aria-label="Close slot details"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h4 className="font-playfair font-semibold text-lg text-vvva-black mb-4">
              Plot Details — Bite No. {slot.biteNo}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faCompass} className="text-xs" /> Direction
                </div>
                <p className="text-sm font-semibold text-vvva-black">{slot.direction}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faIndianRupeeSign} className="text-xs" /> Price
                </div>
                <p className="text-sm font-semibold text-vvva-orange">{slot.price}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faRulerCombined} className="text-xs" /> Measurement
                </div>
                <p className="text-sm font-semibold text-vvva-black">{slot.measurement}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faFileLines} className="text-xs" /> Dimensions
                </div>
                <p className="text-sm font-semibold text-vvva-black">{slot.dimensions} ft</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-5 bg-vvva-sand/50 rounded-btn p-3">
              {slot.details}
            </p>

            <div className="flex flex-wrap gap-3">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${ADMIN_PHONE}?text=${buildWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-5 py-2.5 rounded-btn transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                WhatsApp Us
              </a>

              {/* Call */}
              <a
                href={`tel:+${ADMIN_PHONE}`}
                className="inline-flex items-center gap-2 bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold text-sm px-5 py-2.5 rounded-btn transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faPhone} />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
