import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { submitEnquiry } from '../lib/db';

function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-vvva-black text-white px-5 py-3 rounded-card flex items-center gap-3 shadow-xl"
    >
      <CheckCircle size={18} className="text-green-400 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
        <X size={16} />
      </button>
    </motion.div>
  );
}

export default function EnquiryForm({ projectName = '', projectId = null }) {
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
        project_id: projectId,
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        message: data.message || '',
      });
      reset();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      setSubmitError('Failed to send enquiry. Please try again.');
    }
  };

  return (
    <>
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
          <label className="block text-sm font-medium text-vvva-black mb-1.5">Email</label>
          <input
            type="email"
            placeholder="your@email.com (optional)"
            {...register('email')}
            className="w-full border border-vvva-sand rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-vvva-orange focus:ring-2 focus:ring-vvva-orange/25 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-vvva-black mb-1.5">Message</label>
          <textarea
            rows={3}
            placeholder={projectName ? `I'm interested in ${projectName}...` : 'Your message...'}
            {...register('message')}
            className="w-full border border-vvva-sand rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-vvva-orange focus:ring-2 focus:ring-vvva-orange/25 transition-all resize-none"
          />
        </div>

        {submitError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-btn px-3 py-2">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-vvva-orange hover:bg-vvva-orange-dark disabled:opacity-60 text-white font-semibold py-3 rounded-btn transition-colors duration-150 text-sm"
        >
          {isSubmitting ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>

      <AnimatePresence>
        {showToast && (
          <Toast
            message="Enquiry sent! Our team will reach out soon."
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
