import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fetchSiteImageByKey } from '../lib/db';

function CountUp({ target, suffix = '', duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const [heroImg, setHeroImg] = useState({ url: '', alt: '' });

  useEffect(() => {
    fetchSiteImageByKey('hero_background')
      .then(img => { if (img) setHeroImg({ url: img.url, alt: img.alt }); })
      .catch(() => {});
  }, []);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero background image */}
      {heroImg.url && (
        <img
          src={heroImg.url}
          alt={heroImg.alt || ''}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/60 to-stone-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="font-playfair font-bold text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(32px, 6vw, 64px)', lineHeight: '1.15' }}
        >
          Build Your Future with{' '}
          <span className="text-vvva-orange relative">
            VVVA Developer
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-vvva-orange/50 rounded-full" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-white/80 font-inter text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Premium Residential Plots in Bengaluru — where your dream home begins.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToProjects}
            className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold text-base px-8 py-3.5 rounded-btn transition-all duration-200 shadow-lg shadow-vvva-orange/30 hover:shadow-vvva-orange/50 hover:scale-105"
          >
            Explore Projects
          </button>
          <a
            href="/about"
            className="text-white/80 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors border border-white/30 hover:border-white/60 px-6 py-3.5 rounded-btn backdrop-blur-sm"
          >
            Learn About Us
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { target: 10, suffix: '+', label: 'Years Experience' },
            { target: 50, suffix: '+', label: 'Projects Done' },
            { target: 500, suffix: '+', label: 'Happy Families' },
          ].map(({ target, suffix, label }) => (
            <div key={label} className="text-center">
              <p className="font-playfair font-bold text-4xl sm:text-5xl text-vvva-orange drop-shadow-lg">
                <CountUp target={target} suffix={suffix} duration={1600} />
              </p>
              <p className="text-white/70 text-xs mt-2 font-inter tracking-wide uppercase">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToProjects}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors"
        aria-label="Scroll to projects"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.button>
    </section>
  );
}
