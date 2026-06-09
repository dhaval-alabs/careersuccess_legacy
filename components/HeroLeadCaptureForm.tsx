'use client';

import { useState, useEffect } from 'react';
import { recordFirstField, getBehaviourSnapshot } from '../utils/trackBehaviour';
import { getStoredUtm } from '../utils/captureUtm';
import SearchableCitySelect from './SearchableCitySelect';
import QualificationChat from './QualificationChat';
import { QUALIFICATION_CONFIG } from '../lib/qualification-config';

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
  debug?:        boolean;
  qualificationConfigKey?: string;
}

const inputCls = `
  w-full px-4 py-3 rounded-xl border border-[#D6ECEB] bg-white
  text-[#09263F] text-sm placeholder-[#9BBAC0]
  focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
  transition-all duration-200 disabled:opacity-60
`.trim();

const labelCls = 'block text-xs font-bold text-[#09263F] mb-1.5 tracking-wide';

type OtpState = 'idle' | 'chatStep' | 'sending' | 'otp_sent' | 'verifying' | 'error';

export default function HeroLeadCaptureForm({
  sourceName   = 'Hero Section',
  buttonText   = 'Request Free Counselling →',
  title        = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
  onSuccess,
  debug = false,
  qualificationConfigKey,
}: HeroLeadCaptureFormProps) {
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
  const [formError, setFormError]     = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [preferredCallbackTime, setPreferredCallbackTime] = useState('');

  // Manage resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function handleInitialSubmit() {
    if (!name || !email || !city || mobile.length !== 10) {
      setFormError('Please fill all fields before continuing.');
      return;
    }

    setFormError('');
    if (qualificationConfigKey && QUALIFICATION_CONFIG[qualificationConfigKey]) {
      // First submit - go to chat step
      setOtpState('chatStep');
      
      try {
        const utms = getStoredUtm();
        const behaviour = getBehaviourSnapshot();
        await fetch('https://lp-vercel.analytixlabs.co.in/api/submit-lead', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             name, email, city, countryCode, mobile,
             form_source: sourceName,
             typeFilter: typeFilter || 'PPC_HeroForm',
             ...utms,
             ...behaviour,
             submission_timestamp: new Date().toISOString(),
             landing_page_url: typeof window !== 'undefined' ? window.location.href : '',
             referrer_url: typeof document !== 'undefined' ? document.referrer : '',
             debug,
           })
        });
      } catch (err) {
        // ignore
      }
    } else {
      await handleSendOtp();
    }
  }

  const handleChatComplete = (conv: string[], callbackTime: string) => {
    setConversation(conv);
    setPreferredCallbackTime(callbackTime);
    handleSendOtp();
  };

  async function handleSendOtp() {
    if (!name || !email || !city || mobile.length !== 10) {
      setFormError('Please fill all fields before requesting OTP.');
      return;
    }

    setOtpState('sending');
    setErrorMsg('');
    setFormError('');

    const utms = getStoredUtm();
    const behaviour = getBehaviourSnapshot();

    try {
      const res = await fetch('https://lp-vercel.analytixlabs.co.in/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, city, countryCode, mobile,
          form_source: sourceName,
          typeFilter: typeFilter || 'PPC_HeroForm',
          ...utms,
          ...behaviour,
          submission_timestamp: new Date().toISOString(),
          landing_page_url: typeof window !== 'undefined' ? window.location.href : '',
          referrer_url: typeof document !== 'undefined' ? document.referrer : '',
          debug,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setOtpState('idle');
        setFormError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      if (data.fallback) {
        if (debug && data.debugInfo) {
          setOtpState('idle');
          setFormError(`[DEBUG] OTP Delivery Failed: ${data.debugInfo}`);
          return;
        }
        // WhatsApp delivery failed - proceed as normal Lead submission (Fallback)
        onSuccess?.(email);
        const params = new URLSearchParams({ email, name, phone: mobile });
        window.location.href = `${thankYouPath}?${params.toString()}`;
        return;
      }

      // OTP sent successfully
      setToken(data.token);
      setOtpState('otp_sent');
      setResendTimer(30);
    } catch (err) {
      setOtpState('idle');
      setFormError('Connection error. Please check your internet and try again.');
    }
  }

  async function handleVerify() {
    if (otpValue.length !== 4) return;

    setOtpState('verifying');
    setErrorMsg('');

    try {
      const res = await fetch('https://lp-vercel.analytixlabs.co.in/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          otp_entered: otpValue,
          mobile,
          countryCode,
          name,
          email,
          debug,
          preferredCallbackTime,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setOtpState('error');
        setErrorMsg(data.error || 'Verification failed. Please try again.');
        setOtpValue('');
        return;
      }

      // If debug info returned during verification, briefly show it or log it
      if (debug && data.debugInfo) {
        setFormError(`[VERIFY DEBUG] ${data.debugInfo}`);
        // Give the user a moment to see the debug info before redirecting
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Verified successfully!
      if (qualificationConfigKey && QUALIFICATION_CONFIG[qualificationConfigKey]) {
         fetch('/api/qualify', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             phone: `${countryCode}${mobile}`,
             email,
             conversation,
             preferredCallbackTime
           }),
           keepalive: true
         }).catch(console.error);
      }

      onSuccess?.(email);
      const params = new URLSearchParams({ email, name, phone: mobile });
      const redirectUrl = data.verified 
        ? `${thankYouPath}?${params.toString()}&verified=true`
        : `${thankYouPath}?${params.toString()}`;
      window.location.href = redirectUrl;
    } catch (err) {
      setOtpState('error');
      setErrorMsg('Verification failed. Server is unreachable.');
    }
  }

  async function handleResend() {
    setOtpValue('');
    setErrorMsg('');
    setToken('');
    setOtpState('idle');
    await handleSendOtp();
  }

  return (
    <div className="px-7 py-8 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl relative overflow-hidden" id="hero-lead-capture">
      <div className="mb-6 relative z-10">
        <h2 className="font-display font-bold text-[#09263F] text-xl mb-1">{title}</h2>
        <p className="text-[#4A6275] text-sm">Verify your WhatsApp to connect with our experts.</p>
      </div>

      {formError && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {formError}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 relative z-10">
        <div>
          <label htmlFor="name" className={labelCls}>Full Name</label>
          <input
            type="text" name="name" id="name"
            required maxLength={50}
            placeholder="e.g. Rahul Sharma"
            className={inputCls}
            value={name} onChange={e => setName(e.target.value)}
            disabled={otpState !== 'idle' && otpState !== 'sending'}
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
              disabled={otpState !== 'idle' && otpState !== 'sending'}
              onFocus={() => recordFirstField('email')}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelCls}>Current City</label>
            <SearchableCitySelect
              name="city"
              required
              value={city}
              onChange={(val) => {
                setCity(val);
                recordFirstField('city');
              }}
              disabled={otpState !== 'idle' && otpState !== 'sending'}
              placeholder="Select City..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="mobile" className={labelCls}>Whatsapp Number (for OTP)</label>
          
          {(otpState === 'idle' || otpState === 'sending') ? (
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
                  placeholder="10-digit mobile"
                  maxLength={10}
                  onFocus={() => recordFirstField('mobile')}
                  className="w-full pl-4 pr-28 py-3 rounded-xl border border-[#D6ECEB] bg-white
                             text-[#09263F] text-sm placeholder-[#9BBAC0]
                             focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                             transition-all duration-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={handleInitialSubmit}
                  disabled={mobile.length !== 10 || otpState === 'sending'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2
                              px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                              ${mobile.length === 10 && otpState !== 'sending'
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
          ) : otpState === 'chatStep' && qualificationConfigKey ? (
            <div className="animate-in fade-in zoom-in-95 duration-300 relative z-20">
              <QualificationChat 
                firstName={name.split(' ')[0]}
                courseSubject={QUALIFICATION_CONFIG[qualificationConfigKey].subject}
                questions={QUALIFICATION_CONFIG[qualificationConfigKey].questions}
                options={QUALIFICATION_CONFIG[qualificationConfigKey].options}
                onComplete={handleChatComplete}
              />
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#29E8A4]">WhatsApp OTP sent to {countryCode} {mobile}</span>
                <button 
                  type="button" 
                  onClick={() => setOtpState('idle')} 
                  className="text-[#4A6275] hover:text-[#09263F] underline"
                >
                  Change
                </button>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={otpState === 'verifying'}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  autoFocus
                  className="w-full pl-4 pr-28 py-3 rounded-xl border border-[#1DE5B5] bg-white
                             text-[#09263F] text-sm placeholder-[#9BBAC0] tracking-[0.5em] font-bold
                             focus:outline-none focus:ring-4 focus:ring-[#1DE5B5]/20
                             transition-all duration-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={otpValue.length !== 4 || otpState === 'verifying'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2
                              px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                              ${otpValue.length === 4 && otpState !== 'verifying'
                                ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer shadow-lg shadow-[#29E8A4]/20'
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
              
              {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#4A6275]">Didn't receive it?</span>
                {resendTimer > 0 ? (
                  <span className="text-[#4A6275] font-semibold">Resend in {resendTimer}s</span>
                ) : (
                  <button type="button" onClick={handleResend} className="text-[#239bf5] font-bold hover:underline">
                    Resend Now
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {(otpState === 'idle' || otpState === 'sending') && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleInitialSubmit}
              disabled={otpState === 'sending'}
              className="w-full py-4 bg-[#29E8A4] text-[#09263F] font-bold rounded-2xl text-base 
                         shadow-[0_8px_30px_rgba(41,232,164,0.3)] hover:bg-[#1DE5B5] 
                         active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {otpState === 'sending' ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>
                  {buttonText}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
            <p className="mt-3 text-[10px] text-[#4A6275] leading-relaxed text-center px-4">
              By clicking, you agree to receive career updates and verification codes on WhatsApp.
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 pt-1 border-t border-white/40 mt-6">
          <div className="mt-0.5 flex-shrink-0">
            <input
              type="checkbox" id="consent" name="consent" required defaultChecked
              className="w-4 h-4 rounded border-[#D6ECEB] text-[#1DE5B5]
                         focus:ring-[#1DE5B5]/40 accent-[#1DE5B5] cursor-pointer"
            />
          </div>
          <label htmlFor="consent" className="text-[0.72rem] text-[#4A6275] leading-relaxed cursor-pointer">
            I agree to the <a href="/privacy-policy" className="text-[#239bf5] hover:underline font-medium">Privacy Policy</a> and consent to being contacted by AnalytixLabs. <span className="text-[#1DE5B5] font-semibold">No Spam ❤️</span>
          </label>
        </div>
      </form>
    </div>
  );
}
