// blog-assets/components/BlogLeadForm.tsx
'use client';

import { useState } from 'react';
import { recordFirstField, getAdvancedBehaviourSnapshot } from '../utils/trackAdvancedBehaviour';
import { getStoredUtm } from '../utils/captureUtm';

/**
 * Simplified Lead Form for Blog Project
 * - No brochure downloads
 * - Advanced behavioral tracking integrated
 * - Placeholder for Thank You URL
 */

const THANK_YOU_PATH = '/thankyou-placeholder'; // [DEVELOPER]: Update this to your actual thank you page path

const inputCls = `
  w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
  text-[#09263F] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500
  transition-all duration-200 disabled:opacity-60
`.trim();

const labelCls = 'block text-xs font-bold text-[#09263F] mb-1.5 tracking-wide';

export default function BlogLeadForm({ sourceName = 'Blog Lead Form' }) {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [city, setCity]               = useState('');
  const [mobile, setMobile]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !city || mobile.length !== 10) {
      setErrorHeader('Please fill all fields correctly.');
      return;
    }

    setIsSubmitting(true);
    setErrorHeader('');

    // Gather tracking snapshots
    const utms = getStoredUtm();
    const behaviour = getAdvancedBehaviourSnapshot();

    try {
      // NOTE: Ensure your API URL matches your blog's domain or use a relative path
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          city,
          mobile,
          countryCode: '+91', // Defaulting to India as per alabs-lp setup
          form_source: sourceName,
          typeFilter: 'Blog_Subscriber',
          ...utms,
          ...behaviour,
          submission_timestamp: new Date().toISOString(),
          landing_page_url: window.location.href,
          referrer_url: document.referrer,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setIsSubmitting(false);
        setErrorHeader(data.error || 'Submission failed. Please try again.');
        return;
      }

      // Success! Redirect to Thank You Page
      const params = new URLSearchParams({ email, name });
      window.location.href = `${THANK_YOU_PATH}?${params.toString()}`;
    } catch (err) {
      setIsSubmitting(false);
      setErrorHeader('Connection error. Please check your internet.');
    }
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="font-bold text-[#09263F] text-xl">Get Expert Guidance</h2>
        <p className="text-gray-500 text-sm">Fill in your details and our team will get back to you.</p>
      </div>

      {errorHeader && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorHeader}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            type="text" required className={inputCls} placeholder="Rahul Sharma"
            value={name} onChange={e => { setName(e.target.value); recordFirstField('name'); }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email" required className={inputCls} placeholder="rahul@email.com"
              value={email} onChange={e => { setEmail(e.target.value); recordFirstField('email'); }}
            />
          </div>
          <div>
            <label className={labelCls}>Current City</label>
            <input
              type="text" required className={inputCls} placeholder="e.g. Bangalore"
              value={city} onChange={e => { setCity(e.target.value); recordFirstField('city'); }}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Mobile Number</label>
          <div className="flex gap-2">
            <span className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-500">+91</span>
            <input
              type="tel" required maxLength={10} className={inputCls} placeholder="10-digit mobile"
              value={mobile} onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); recordFirstField('mobile'); }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-teal-400 hover:bg-teal-500 text-[#09263F] font-bold rounded-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Connect with Experts →'}
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          By submitting, you agree to our Privacy Policy and consent to be contacted.
        </p>
      </form>
    </div>
  );
}
