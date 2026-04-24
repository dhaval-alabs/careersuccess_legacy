'use client';

import { useState, useEffect } from 'react';
import { recordFirstField, getBehaviourSnapshot } from '../../utils/trackBehaviour';
import { getStoredUtm } from '../../utils/captureUtm';
import SearchableCitySelect from '../SearchableCitySelect';

const COUNTRY_CODES = [
  { code: '+91', label: '+91' },
  { code: '+1',  label: '+1'  },
  { code: '+44', label: '+44' },
  { code: '+61', label: '+61' },
];

interface LeadCaptureFormProps {
  sourceName?:   string;
  buttonText?:   string;
  title?:        string;
  typeFilter?:   string;
  thankYouPath?: string;
  onSuccess?:    (email: string) => void;
  debug?:        boolean;
}

const inputCls = `
  w-full px-4 py-3 rounded-xl border border-[#D6ECEB] bg-white
  text-[#09263F] text-sm placeholder-[#9BBAC0]
  focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
  transition-all duration-200 disabled:opacity-60
`.trim();

const labelCls = 'block text-xs font-bold text-[#09263F] mb-1.5 tracking-wide';

type OtpState = 'idle' | 'sending' | 'otp_sent' | 'verifying' | 'error';

export default function LeadCaptureForm({
  sourceName   = 'Modal Form',
  buttonText   = 'Submit →',
  title        = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
  onSuccess,
  debug = false,
}: LeadCaptureFormProps) {
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
          typeFilter: typeFilter || 'PPC_ModalForm',
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
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setOtpState('error');
        setErrorMsg(data.error || 'Verification failed. Please try again.');
        setOtpValue('');
        return;
      }

      // If debug info returned during verification, briefly show it 
      if (debug && data.debugInfo) {
        setFormError(`[VERIFY DEBUG] ${data.debugInfo}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Verified successfully!
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
    <div className="px-7 py-8 relative overflow-hidden" id="lead-capture-modal-form">
      <div className="mb-6 relative z-10">
        <h2 className="font-display font-bold text-[#09263F] text-xl mb-1">{title}</h2>
        <p className="text-[#4A6275] text-sm">Verify your WhatsApp to connect with our experts.</p>
      </div>

      {formError && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
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
                  onClick={handleSendOtp}
                  disabled={mobile.length !== 10 || otpState === 'sending'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2
                              px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                              ${mobile.length === 10 && otpState !== 'sending'
                                ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                              }`}
                >
                  {otpState === 'sending' ? '...' : 'OTP'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#29E8A4]">OTP sent to {countryCode} {mobile}</span>
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
                  placeholder="4-digit code"
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
                                ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                              }`}
                >
                  {otpState === 'verifying' ? '...' : 'Verify'}
                </button>
              </div>
              
              {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}
              
              <div className="flex justify-between items-center text-xs">
                {resendTimer > 0 ? (
                  <span className="text-[#4A6275]">Resend in {resendTimer}s</span>
                ) : (
                  <button type="button" onClick={handleResend} className="text-[#239bf5] font-bold hover:underline">
                    Resend OTP
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
              onClick={handleSendOtp}
              disabled={otpState === 'sending'}
              className="w-full py-4 bg-[#29E8A4] text-[#09263F] font-bold rounded-2xl text-base 
                         shadow-[0_8px_30px_rgba(41,232,164,0.3)] hover:bg-[#1DE5B5] 
                         active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {otpState === 'sending' ? 'Sending...' : buttonText}
            </button>
          </div>
        )}

        <div className="flex items-start gap-3 pt-1 border-t border-[#D6ECEB] mt-6">
          <div className="mt-0.5 flex-shrink-0">
            <input
              type="checkbox" id="consent" name="consent" required defaultChecked
              className="w-4 h-4 rounded border-[#D6ECEB] text-[#1DE5B5]
                         focus:ring-[#1DE5B5]/40 accent-[#1DE5B5] cursor-pointer"
            />
          </div>
          <label htmlFor="consent" className="text-[0.72rem] text-[#4A6275] leading-relaxed cursor-pointer">
            I agree to the <a href="/privacy-policy" className="text-[#239bf5] hover:underline font-medium">Privacy Policy</a> and consent to being contacted by AnalytixLabs.
          </label>
        </div>
      </form>
    </div>
  );
}
