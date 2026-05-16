import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingEnquireBtn({ heroRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!heroRef?.current) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [heroRef]);

  const handleClick = () => {
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-40 bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold text-sm px-5 py-3 rounded-pill flex items-center gap-2 shadow-lg shadow-vvva-orange/30 transition-colors duration-150 md:hidden"
          aria-label="Enquire Now"
        >
          <MessageCircle size={16} />
          Enquire Now
        </motion.button>
      )}
    </AnimatePresence>
  );
}
