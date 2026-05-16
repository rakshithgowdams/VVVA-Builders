import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle, X } from 'lucide-react';

function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-150"
      aria-label="Chat with VVVA Developer on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
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
      <CheckCircle size={18} className="text-green-400 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
        <X size={16} />
      </button>
    </motion.div>
  );
}

const CONTACT_INFO = [
  { icon: Phone, label: 'Phone', value: '+91 99999 99999', href: 'tel:+919999999999' },
  { icon: Mail, label: 'Email', value: 'info@vvvadeveloper.com', href: 'mailto:info@vvvadeveloper.com' },
  { icon: MapPin, label: 'Address', value: '123, MG Road, Bengaluru, Karnataka 560001', href: null },
  { icon: Clock, label: 'Office Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM', href: null },
];

export default function Contact() {
  const [showToast, setShowToast] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    reset();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <main className="pt-16 page-transition">
      {/* Page hero */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <img
          src="/bhoovanahalli-project2.jpeg"
          alt="VVVA Developer project site"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/70" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 70% 50%, #FF5500 0%, transparent 50%)` }}
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
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-vvva-orange/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-vvva-orange" />
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
