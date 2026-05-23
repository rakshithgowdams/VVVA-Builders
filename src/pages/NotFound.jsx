import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg w-full">
        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-8 select-none"
        >
          <span
            className="block font-black text-stone-100 leading-none"
            style={{ fontSize: 'clamp(100px, 22vw, 180px)' }}
          >
            404
          </span>
          {/* Pin icon overlaid on the 0 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-vvva-orange rounded-2xl p-4 shadow-xl shadow-orange-200">
              <MapPin className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">
            Page not found
          </h1>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on the right plot.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 shadow-sm shadow-orange-200"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
