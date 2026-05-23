import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../seo/Seo';
import { makeBreadcrumbSchema } from '../seo/schema';

const breadcrumbs = makeBreadcrumbSchema([
  { name: 'Home', url: 'https://vvva-builders.vercel.app/' },
  { name: 'Gallery', url: 'https://vvva-builders.vercel.app/gallery' },
]);

const GALLERY_ITEMS = [
  { src: '/bhoovanahalli-project2.jpeg', alt: 'VVVA Developer Bhoovanahalli residential layout Hassan Karnataka', caption: 'Bhoovanahalli Layout — Hassan' },
  { src: '/bhoovanahalli-project3.jpeg', alt: 'VVVA Developer Bhoovanahalli plot development Hassan', caption: 'Bhoovanahalli Layout — Road Infrastructure' },
  { src: '/hero-site.jpeg', alt: 'VVVA Developer residential plot site Hassan Karnataka 2026', caption: 'VVVA Developer Plot — Hassan Bypass Corridor' },
  { src: '/hero-site2.jpeg', alt: 'VVVA Developer gated community plot Hassan district Karnataka', caption: 'VVVA Developer Layout — Developed Site' },
  { src: '/hero-site3.jpeg', alt: 'VVVA Developer residential layout entrance Hassan Karnataka', caption: 'Premium Layout Entrance — Hassan City' },
  { src: '/hero-site4.jpeg', alt: 'VVVA Developer plot road infrastructure Hassan', caption: 'BDA-width Internal Roads — DTCP Layout' },
  { src: '/files_2806306-2026-05-23T05-46-35-685Z-WhatsApp_Image_2026-05-03_at_22.45.12.jpeg', alt: 'VVVA Developer residential plot Hassan Karnataka investment', caption: 'VVVA Developer — Hassan District' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <Seo
        title="Gallery — VVVA Developer Residential Plots Hassan Karnataka"
        description="Photo gallery of VVVA Developer residential plot projects in Hassan, Karnataka. View completed layouts, road infrastructure, plot development, and site images."
        canonical="/gallery"
        schema={breadcrumbs}
      />
      <main className="pt-16 page-transition">
        <section className="py-14 px-4 text-center relative overflow-hidden">
          <img src="/hero-real-estate-bg.webp" alt="VVVA Developer project gallery"
            className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/65 to-stone-950/50" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Our Projects</span>
            <h1 className="font-playfair font-bold text-white mt-3 mb-4" style={{ fontSize: 'clamp(24px, 4.5vw, 46px)' }}>
              VVVA Developer Gallery
            </h1>
            <p className="text-white/70 text-base">See our completed residential layouts, developed plots, and infrastructure across Hassan district.</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-vvva-warm-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {GALLERY_ITEMS.map((img, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => setLightbox(i)}
                  className="group relative rounded-card overflow-hidden bg-vvva-sand aspect-square"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors duration-200 flex items-end">
                    <p className="text-white text-xs font-medium px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {img.caption}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-stone-950/95 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
              >✕</button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_ITEMS[lightbox].src}
                  alt={GALLERY_ITEMS[lightbox].alt}
                  className="w-full rounded-card max-h-[80vh] object-contain"
                />
                <p className="text-white/60 text-sm text-center mt-3">{GALLERY_ITEMS[lightbox].caption}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setLightbox(l => l > 0 ? l - 1 : GALLERY_ITEMS.length - 1)}
                    className="text-white/60 hover:text-white px-4 py-2 border border-white/20 rounded-btn text-sm"
                  >← Prev</button>
                  <button
                    onClick={() => setLightbox(l => l < GALLERY_ITEMS.length - 1 ? l + 1 : 0)}
                    className="text-white/60 hover:text-white px-4 py-2 border border-white/20 rounded-btn text-sm"
                  >Next →</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
