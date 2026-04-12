'use client';

import { useState, useTransition, FormEvent } from 'react';
import { recordFirstField, getBehaviourSnapshot } from '../utils/trackBehaviour';
import { getStoredUtm } from '../utils/captureUtm';

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

interface HeroLeadCaptureFormProps {
  sourceName?:   string;
  buttonText?:   string;
  title?:        string;
  typeFilter?:   string;
  thankYouPath?: string;
  onSuccess?:    (email: string) => void;
}

const inputCls = `
  w-full px-4 py-3 rounded-xl border border-[#D6ECEB] bg-white
  text-[#09263F] text-sm placeholder-[#9BBAC0]
  focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
  transition-all duration-200
`.trim();

const labelCls = 'block text-xs font-bold text-[#09263F] mb-1.5 tracking-wide';

type OtpState = 'idle' | 'sending' | 'otp_sent' | 'verifying' | 'error';

export default function HeroLeadCaptureForm({
  sourceName  = 'Hero Section',
  buttonText  = 'Request Free Counselling →',
  title       = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
  onSuccess,
}: HeroLeadCaptureFormProps) {
  const [isPending, startTransition] = useTransition(); // Actually might not need this if we don't have standard form action
  const [formState, setFormState] = useState({ success: false, error: '' });

  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [city, setCity]               = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile]           = useState('');

  const [otpState, setOtpState]       = useState<OtpState>('idle');
  const [otpValue, setOtpValue]       = useState('');
  const [token, setToken]             = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  async function handleSendOtp() {
    // Basic validation before sending
    if (!name || !email || !city || mobile.length !== 10) {
      setFormState({ success: false, error: 'Please fill out all fields before requesting OTP.' });
      return;
    }

    setOtpState('sending');
    setErrorMsg('');
    setFormState({ success: false, error: '' });

    const utms = getStoredUtm();
    const behaviour = getBehaviourSnapshot();

    const res = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, city, countryCode, mobile,
        form_source: sourceName,
        typeFilter,
        ...utms,
        ...behaviour,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setOtpState('idle');
      setFormState({ success: false, error: data.error || 'Something went wrong. Please try again.' });
      return;
    }

    if (data.fallback) {
      onSuccess?.(email);
      const params = new URLSearchParams({ email, name, phone: mobile });
      window.location.href = `${thankYouPath}?${params.toString()}`;
      return;
    }

    setToken(data.token);
    setOtpState('otp_sent');

    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleVerify() {
    setOtpState('verifying');
    setErrorMsg('');

    const res = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        otp_entered: otpValue,
        mobile,
        countryCode,
        name,
        email,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setOtpState('error');
      setErrorMsg(data.error || 'Verification failed. Please try again.');
      setOtpValue('');
      return;
    }

    onSuccess?.(email);
    const params = new URLSearchParams({ email, name, phone: mobile });
    window.location.href = `${thankYouPath}?${params.toString()}`;
  }

  async function handleResend() {
    setOtpValue('');
    setErrorMsg('');
    setOtpState('idle');
    setToken('');
    await handleSendOtp();
  }

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

  return (
    <div className="px-7 py-8" id="lead-capture-module">
      <div className="mb-6">
        <h2 className="font-display font-bold text-[#09263F] text-xl mb-1">{title}</h2>
        <p className="text-[#4A6275] text-sm">Fill the form below to connect with our experts.</p>
      </div>

      {formState.error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {formState.error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelCls}>Full Name</label>
          <input
            type="text" name="name" id="name"
            required maxLength={50}
            placeholder="e.g. Rahul Sharma"
            className={inputCls}
            value={name} onChange={e => setName(e.target.value)}
            disabled={otpState === 'sending' || otpState === 'otp_sent' || otpState === 'verifying' || otpState === 'error'}
            onFocus={() => recordFirstField('name')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="email" className={labelCls}>Email Address</label>
            <input
              type="email" name="email" id="email"
              required maxLength={75}
              placeholder="you@email.com"
              className={inputCls}
              value={email} onChange={e => setEmail(e.target.value)}
              disabled={otpState === 'sending' || otpState === 'otp_sent' || otpState === 'verifying' || otpState === 'error'}
              onFocus={() => recordFirstField('email')}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelCls}>Current City</label>
            <select
              name="city" id="city"
              required
              className={inputCls + ' cursor-pointer'}
              value={city} onChange={e => setCity(e.target.value)}
              disabled={otpState === 'sending' || otpState === 'otp_sent' || otpState === 'verifying' || otpState === 'error'}
              onFocus={() => recordFirstField('city')}
            >
              <option value="" disabled>Select City...</option>
              {INDIA_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="mobile" className={labelCls}>Mobile Number / OTP</label>
          
          {otpState === 'idle' || otpState === 'sending' ? (
            <div className="flex gap-2 items-stretch">
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                disabled={otpState === 'sending'}
                className="w-20 flex-shrink-0 px-2 py-3 rounded-xl border border-[#D6ECEB] bg-white
                           text-[#09263F] text-sm font-semibold
                           focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                           transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={otpState === 'sending'}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  onFocus={() => recordFirstField('mobile')}
                  className="w-full pl-4 pr-28 py-3 rounded-xl border border-[#D6ECEB] bg-white
                             text-[#09263F] text-sm placeholder-[#9BBAC0]
                             focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                             transition-all duration-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={mobile.length !== 10 || !name || !email || !city || otpState === 'sending'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2
                              px-3 py-1.5 rounded-lg text-xs font-bold
                              transition-all duration-200
                              ${mobile.length === 10 && name && email && city && otpState !== 'sending'
                                ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                              }`}
                >
                  {otpState === 'sending' ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending
                    </span>
                  ) : 'Send OTP'}
                </button>
              </div>
            </div>
          ) : null}

          {(otpState === 'otp_sent' || otpState === 'verifying' || otpState === 'error') ? (
            <div className="space-y-2 mt-1">
              <p className="text-xs text-[#29E8A4] font-semibold">
                OTP sent to your WhatsApp (+{countryCode.replace('+','')} {mobile})
              </p>
              <div className="relative">
                <input
                  type="tel"
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={otpState === 'verifying'}
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  autoFocus
                  className="w-full pl-4 pr-28 py-3 rounded-xl border border-[#D6ECEB] bg-white
                             text-[#09263F] text-sm placeholder-[#9BBAC0] tracking-widest
                             focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                             transition-all duration-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={otpValue.length !== 4 || otpState === 'verifying'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2
                              px-3 py-1.5 rounded-lg text-xs font-bold
                              transition-all duration-200
                              ${otpValue.length === 4 && otpState !== 'verifying'
                                ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                              }`}
                >
                  {otpState === 'verifying' ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      ...
                    </span>
                  ) : 'Verify'}
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
              )}

              <p className="text-xs text-[#4A6275]">
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-[#239bf5] font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  )
                }
              </p>
            </div>
          ) : null}
        </div>

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

        {(otpState === 'idle' || otpState === 'sending') && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpState === 'sending' || mobile.length !== 10 || !name || !email || !city}
            className="w-full bg-[#1DE5B5] hover:bg-[#19cf9e] disabled:opacity-60
                       text-[#09263F] font-bold px-8 py-4 rounded-xl text-base
                       transition-all duration-200 shadow-[0_8px_30px_rgba(29,229,181,0.3)]
                       hover:shadow-[0_8px_40px_rgba(29,229,181,0.45)]
                       flex items-center justify-center gap-2 active:scale-95"
          >
            {otpState === 'sending' ? 'Sending OTP...' : buttonText}
          </button>
        )}

      </form>
    </div>
  );
}
