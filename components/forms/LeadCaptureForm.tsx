'use client';

import { useState, useTransition, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLeadAction } from '../../app/actions/leads';
import { initBehaviourTracking, recordFirstField, getBehaviourSnapshot } from '../../utils/trackBehaviour';
import { getStoredUtm } from '../../utils/captureUtm';

const INDIA_CITIES = [
  'Ahmedabad', 'Bangalore', 'Chennai', 'Delhi', 'Faridabad',
  'Gurgaon', 'Hyderabad', 'Jaipur', 'Kochi', 'Kolkata',
  'Mumbai', 'Navi Mumbai', 'Noida', 'Pune', 'Trivandrum',
];

const COUNTRY_CODES = [
  { code: '+91', label: '+91' },
  { code: '+1',  label: '+1'  },
  { code: '+44', label: '+44' },
  { code: '+61', label: '+61' },
];

interface LeadCaptureFormProps {
  sourceName?:    string;
  buttonText?:    string;
  title?:         string;
  typeFilter?:    string;
  thankYouPath?: string; // Path to redirect to after success
}

/* Shared input className */
const inputCls = `
  w-full px-4 py-3 rounded-xl border border-[#D6ECEB] bg-white
  text-[#09263F] text-sm placeholder-[#9BBAC0]
  focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
  transition-all duration-200
`.trim();

const labelCls = 'block text-xs font-bold text-[#09263F] mb-1.5 tracking-wide';

export default function LeadCaptureForm({
  sourceName  = 'Hero Section',
  buttonText  = 'Request Free Counselling →',
  title       = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
}: LeadCaptureFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({ success: false, error: '' });

  useEffect(() => {
    initBehaviourTracking();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ success: false, error: '' });

    const formData = new FormData(e.currentTarget);
    const utms = getStoredUtm();
    const behaviour = getBehaviourSnapshot();

    const data = {
      name:           formData.get('name')        as string,
      email:          formData.get('email')       as string,
      countryCode:    formData.get('countryCode') as string,
      mobile:         formData.get('mobile')      as string,
      city:           formData.get('city')        as string,
      form_source:    sourceName,
      session_id:     typeof window !== 'undefined'
                        ? sessionStorage.getItem('alabs_session_id') || undefined
                        : undefined,
      page_url:       typeof window !== 'undefined' ? window.location.href : undefined,
      typeFilter,
      ...utms,
      ...behaviour,
    };

    startTransition(async () => {
      const result = await createLeadAction(data);
      if (result.success) {
        if (thankYouPath) {
          const params = new URLSearchParams({
            email: data.email,
            name:  data.name,
            phone: data.mobile,
          });
          router.push(`${thankYouPath}?${params.toString()}`);
        } else {
          setFormState({ success: true, error: '' });
        }
      } else {
        setFormState({ success: false, error: result.error || 'Something went wrong. Please try again.' });
      }
    });
  }

  /* ── Success state ── */
  if (formState.success) {
    return (
      <div className="px-8 py-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#E6F7F6] flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#1DE5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-[#09263F] text-xl mb-2">Inquiry Received!</h3>
        <p className="text-[#4A6275] text-sm leading-relaxed max-w-xs">
          Our career advisor will contact you within 24 hours to discuss your goals.
        </p>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="px-7 py-8" id="lead-capture-module">

      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-[#09263F] text-xl mb-1">{title}</h2>
        <p className="text-[#4A6275] text-sm">Fill the form below to connect with our experts.</p>
      </div>

      {/* Error */}
      {formState.error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {formState.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label htmlFor="name" className={labelCls}>Full Name</label>
          <input
            type="text" name="name" id="name"
            required maxLength={50}
            placeholder="e.g. Rahul Sharma"
            className={inputCls}
            onFocus={() => recordFirstField('name')}
          />
        </div>

        {/* Email + City — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="email" className={labelCls}>Email Address</label>
            <input
              type="email" name="email" id="email"
              required maxLength={75}
              placeholder="you@email.com"
              className={inputCls}
              onFocus={() => recordFirstField('email')}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelCls}>Current City</label>
            <select
              name="city" id="city"
              required defaultValue=""
              className={inputCls + ' cursor-pointer'}
              onFocus={() => recordFirstField('city')}
            >
              <option value="" disabled>Select City...</option>
              {INDIA_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="mobile" className={labelCls}>Mobile Number</label>
          <div className="flex gap-2">
            <select
              name="countryCode" id="countryCode"
              defaultValue="+91"
              aria-label="Country code"
               className="w-20 flex-shrink-0 px-2 py-3 rounded-xl border border-[#D6ECEB] bg-white
                          text-[#09263F] text-sm font-semibold
                          focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                          transition-all duration-200 cursor-pointer"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel" name="mobile" id="mobile"
              required pattern="[0-9]{10}" maxLength={10}
              placeholder="10-digit mobile number"
              className={inputCls + ' flex-1'}
              onFocus={() => recordFirstField('mobile')}
            />
          </div>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3 pt-1">
          <div className="mt-0.5 flex-shrink-0">
            <input
              type="checkbox" id="consent" name="consent" required
              className="w-4 h-4 rounded border-[#D6ECEB] text-[#1DE5B5]
                         focus:ring-[#1DE5B5]/40 accent-[#1DE5B5] cursor-pointer"
            />
          </div>
          <label htmlFor="consent" className="text-[0.72rem] text-[#4A6275] leading-relaxed cursor-pointer">
            I agree to the{' '}
            <a href="/privacy-policy" className="text-[#239bf5] hover:underline font-medium">
              Privacy Policy
            </a>{' '}
            and consent to being contacted by AnalytixLabs.{' '}
            <span className="text-[#1DE5B5] font-semibold">No Spam ❤️ We promise.</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#1DE5B5] hover:bg-[#19cf9e] disabled:opacity-60
                     text-[#09263F] font-bold px-8 py-4 rounded-xl text-base
                     transition-all duration-200 shadow-[0_8px_30px_rgba(29,229,181,0.3)]
                     hover:shadow-[0_8px_40px_rgba(29,229,181,0.45)]
                     hover:-translate-y-px active:translate-y-0
                     flex items-center justify-center gap-2 active:scale-95"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : buttonText}
        </button>

      </form>
    </div>
  );
}
