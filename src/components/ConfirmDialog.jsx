import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

/**
 * Usage:
 *   const [dialog, setDialog] = useState(null);
 *
 *   // to open:
 *   setDialog({ title: '...', message: '...', onConfirm: () => { ... } });
 *
 *   // render:
 *   <ConfirmDialog config={dialog} onClose={() => setDialog(null)} />
 */
export default function ConfirmDialog({ config, onClose }) {
  useEffect(() => {
    if (!config) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [config, onClose]);

  return (
    <AnimatePresence>
      {config && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-stone-900/60 backdrop-blur-[2px]"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
          >
            {/* Icon + close */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-lg" />
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-stone-800 text-base mb-1">
              {config.title || 'Are you sure?'}
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              {config.message || 'This action cannot be undone.'}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { config.onConfirm(); onClose(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                {config.confirmLabel || 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
