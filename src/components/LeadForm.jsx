import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { submitLead } from '../lib/db';

function getUtmParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  };
}

export default function LeadForm({
  title = 'Get a Free Site Visit',
  subtitle = 'Leave your details and our team will call you within 2 hours.',
  projectInterest = '',
  buttonText = 'Request Site Visit',
  compact = false,
  className = '',
}) {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      const utm = getUtmParams();
      await submitLead({
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        project_interest: projectInterest || data.project_interest || '',
        source_page: location.pathname,
        message: data.message || '',
        ...utm,
      });
      reset();
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please call us directly at +91-98456-59193.');
    }
  };

  if (submitted) {
    return (
      <div className={`bg-white border border-vvva-sand rounded-card p-8 text-center ${className}`}>
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-playfair font-bold text-xl text-vvva-black mb-2">Thank You!</h3>
        <p className="text-sm text-gray-500">Our team will call you within 2 hours. For urgent queries, call <a href="tel:+919845659193" className="text-vvva-orange font-semibold">+91 98456 59193</a>.</p>
        <button onClick={() => setSubmitted(false)} className="mt-5 text-xs text-gray-400 hover:text-gray-600 underline">Submit another enquiry</button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-vvva-sand rounded-card ${compact ? 'p-5' : 'p-8'} ${className}`}>
      {!compact && (
        <div className="mb-6">
          <h3 className="font-playfair font-bold text-xl text-vvva-black">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-${compact ? '3' : '4'}`}>
        <div>
          <input
            type="text"
            placeholder="Your full name *"
            {...register('name', { required: 'Name is required' })}
            className={`w-full border rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 transition-all ${errors.name ? 'border-red-400' : 'border-vvva-sand focus:border-vvva-orange'}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Mobile number *"
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' },
            })}
            className={`w-full border rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 transition-all ${errors.phone ? 'border-red-400' : 'border-vvva-sand focus:border-vvva-orange'}`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
        {!compact && (
          <div>
            <input
              type="email"
              placeholder="Email address (optional)"
              {...register('email')}
              className="w-full border border-vvva-sand rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all"
            />
          </div>
        )}
        {!compact && !projectInterest && (
          <div>
            <input
              type="text"
              placeholder="Project you're interested in (optional)"
              {...register('project_interest')}
              className="w-full border border-vvva-sand rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all"
            />
          </div>
        )}
        {!compact && (
          <div>
            <textarea
              rows={3}
              placeholder="Any specific requirements? (optional)"
              {...register('message')}
              className="w-full border border-vvva-sand rounded-btn px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vvva-orange/25 focus:border-vvva-orange transition-all resize-none"
            />
          </div>
        )}
        {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-btn px-3 py-2">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-vvva-orange hover:bg-vvva-orange-dark disabled:opacity-60 text-white font-semibold py-3 rounded-btn transition-colors duration-150 text-sm"
        >
          {isSubmitting ? 'Sending...' : buttonText}
        </button>
        <p className="text-[11px] text-gray-400 text-center">We respect your privacy. No spam, ever.</p>
      </form>
    </div>
  );
}
