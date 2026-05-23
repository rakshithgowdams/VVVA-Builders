import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faClock, faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { submitEnquiry } from '../lib/db';

function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-150"
      aria-label="Chat with VVVA Developer on WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
    </a>
  );
}

function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-700 text-white px-5 py-3 rounded-card flex items-center gap-3 shadow-xl"
    >
      <FontAwesomeIcon icon={faCircleCheck} className="text-green-400 shrink-0 text-lg" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </motion.div>
  );
}

const CONTACT_INFO = [
  { icon: faPhone, label: 'Phone', value: '+91 99999 99999', href: 'tel:+919999999999' },
  { icon: faEnvelope, label: 'Email', value: 'info@vvvadeveloper.com', href: 'mailto:info@vvvadeveloper.com' },
  { icon: faLocationDot, label: 'Address', value: '123, MG Road, Bengaluru, Karnataka 560001', href: null },
  { icon: faClock, label: 'Office Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM', href: null },
];

export default function Contact() {
  const [showToast, setShowToast] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      await submitEnquiry({
        project_id: null,
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        message: data.message || '',
      });
      reset();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch {
      setSubmitError('Failed to send message. Please try again.');
    }
  };

  return (
    <main className="pt-16 page-transition">
      {/* Page hero */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <img
          src="/hero-real-estate-bg.webp"
          alt="VVVA Developer real estate development"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-900/60 to-stone-950/50" />
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `radial-gradient(circle at 70% 50%, #FF5500 0%, transparent 55%)` }}
        />
        <div className="relative z-10">
          <span className="text-vvva-orange text-xs font-semibold tracking-widest uppercase">Reach Us</span>
          <h1 className="font-playfair font-bold text-white mt-3"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
          >
            Get In Touch
          </h1>
          <p className="text-white/60 text-sm mt-3 max-w-sm mx-auto">
            We'd love to hear from you. Fill the form or reach out directly.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-16 px-4 bg-vvva-warm-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="font-playfair font-bold text-2xl text-vvva-black mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-vvva-black mb-1.5">
                  Full Name <span className="text-vvva-orange">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full border rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 transition-all ${
                    errors.name ? 'border-red-400' : 'border-vvva-sand focus:border-vvva-orange'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-vvva-black mb-1.5">
                  Email Address <span className="text-vvva-orange">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                  className={`w-full border rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 transition-all ${
                    errors.email ? 'border-red-400' : 'border-vvva-sand focus:border-vvva-orange'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-vvva-black mb-1.5">
                  Phone Number <span className="text-vvva-orange">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                  })}
                  className={`w-full border rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 transition-all ${
                    errors.phone ? 'border-red-400' : 'border-vvva-sand focus:border-vvva-orange'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-vvva-black mb-1.5">
                  Message <span className="text-vvva-orange">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your requirements..."
                  {...register('message', { required: 'Message is required' })}
                  className={`w-full border rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 transition-all resize-none ${
                    errors.message ? 'border-red-400' : 'border-vvva-sand focus:border-vvva-orange'
                  }`}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>

              {submitError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-btn px-3 py-2">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-vvva-orange hover:bg-vvva-orange-dark disabled:opacity-60 text-white font-semibold py-3 rounded-btn transition-colors duration-150 text-sm"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="font-playfair font-bold text-2xl text-vvva-black mb-6">Contact Information</h2>
            <div className="space-y-5 mb-8">
              {CONTACT_INFO.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-vvva-orange/10 rounded-full flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={icon} className="text-vvva-orange text-base" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-vvva-black hover:text-vvva-orange transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm text-vvva-black">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="rounded-card overflow-hidden border border-vvva-sand" style={{ height: '220px' }}>
              <iframe
                title="VVVA Developer office location on Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.4567!2d77.5945!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFab />

      <AnimatePresence>
        {showToast && (
          <Toast
            message="Message sent! We'll get back to you within 24 hours."
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
