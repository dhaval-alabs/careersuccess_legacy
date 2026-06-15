'use client';

import { useState, useEffect, useRef } from 'react';
import { recordFirstField, getBehaviourSnapshot } from '../utils/trackBehaviour';
import { getStoredUtm } from '../utils/captureUtm';
import SearchableCitySelect from './SearchableCitySelect';
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

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  isTyping?: boolean;
}

export default function HeroLeadCaptureForm({
  sourceName   = 'Hero Section',
  buttonText   = 'Request Free Counselling →',
  title        = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
  onSuccess,
  debug = false,
  qualificationConfigKey = 'data-science-ai',
}: HeroLeadCaptureFormProps) {
  // Conversational Form States
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0); // 0 to 8: status -> interest -> timeline -> name -> email -> city -> callback -> mobile -> OTP
  const [showInputs, setShowInputs] = useState(false);

  // Form Fields Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [interest, setInterest] = useState('');
  const [timeline, setTimeline] = useState('');
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [preferredCallbackTime, setPreferredCallbackTime] = useState('');

  // OTP and Verification States
  const [otpValue, setOtpValue] = useState('');
  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formError, setFormError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Chat/History Helper States
  const [conversation, setConversation] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Ref for Auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  // Course configuration lookup
  const configInfo = QUALIFICATION_CONFIG[qualificationConfigKey] || QUALIFICATION_CONFIG['data-science-ai'];
  const courseSubject = configInfo.subject;

  // Auto scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showInputs, showTimePicker]);

  // Resend Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Conversation sequence initiator
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: `Hi! 👋 Let's customize your learning plan for ${courseSubject}. To start, are you working, studying, or just starting out?`
      }
    ]);
    setShowInputs(true);
  }, []);

  // Helper to add bot messages with a natural typing delay (default 1800ms for natural feel)
  const addBotMessage = (text: string, delay = 1800) => {
    setShowInputs(false);
    const id = Math.random().toString();
    setMessages(prev => [...prev, { id, sender: 'bot', text: '...', isTyping: true }]);
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text, isTyping: false } : m));
      setShowInputs(true);
    }, delay);
  };

  // Progression handler
  const handleUserSelection = async (val: string) => {
    // 1. Render User Bubble
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: val }]);
    
    // 2. State & Question Mapping
    if (step === 0) {
      setStatus(val);
      recordFirstField('status');
      setConversation(prev => [...prev, `Q: Quick one — are you working, studying, or just starting out?\nA: ${val}`]);
      setStep(1);
      addBotMessage(`Got it. What's drawing you toward ${courseSubject} right now?`, 1800);
    } 
    else if (step === 1) {
      setInterest(val);
      setConversation(prev => [...prev, `Q: What's drawing you toward ${courseSubject} right now?\nA: ${val}`]);
      setStep(2);
      addBotMessage("Makes sense. When are you hoping to get started?", 1800);
    } 
    else if (step === 2) {
      setTimeline(val);
      setConversation(prev => [...prev, `Q: When are you hoping to get started?\nA: ${val}`]);
      setStep(3);
      addBotMessage("Understood. Could you share your full name?", 1800);
    }
  };

  // Handler for custom typed responses (Name, Email)
  const handleTypedSubmit = async (val: string) => {
    if (!val.trim()) return;

    // Render user bubble
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: val }]);

    if (step === 3) {
      setName(val);
      recordFirstField('name');
      setConversation(prev => [...prev, `Q: Could you share your full name?\nA: ${val}`]);
      setStep(4);
      addBotMessage(`Nice to meet you, ${val.split(' ')[0]}! What is your email address?`, 1800);
    } 
    else if (step === 4) {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) {
        setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'bot', text: "Hmm, that email doesn't look quite right. Please try entering a valid email address." }]);
        return;
      }
      setEmail(val.trim());
      recordFirstField('email');
      setConversation(prev => [...prev, `Q: What is your email address?\nA: ${val.trim()}`]);
      setStep(5);
      addBotMessage("Perfect. Which city are you currently in?", 1800);
    }
  };

  // City selection handler (transitions to Callback step)
  const handleCitySubmit = (selectedCity: string) => {
    setCity(selectedCity);
    recordFirstField('city');
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: selectedCity }]);
    setConversation(prev => [...prev, `Q: Which city are you currently in?\nA: ${selectedCity}`]);
    setStep(6);
    addBotMessage("Thanks! When works best for a learning advisor to call you?", 1800);
  };

  // Preferred callback handler (transitions to Phone step)
  const handleCallbackSubmit = async (timeVal: string) => {
    setPreferredCallbackTime(timeVal);
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: timeVal }]);
    setConversation(prev => [...prev, `Q: When works best for a learning advisor to call you?\nA: ${timeVal}`]);
    setStep(7);
    addBotMessage("Almost there! What is your WhatsApp number?", 1800);
  };

  // WhatsApp and OTP trigger logic (runs after Step 7 is submitted)
  const handlePhoneSubmit = async (phoneVal: string) => {
    if (phoneVal.length !== 10) return;
    
    setMobile(phoneVal);
    recordFirstField('mobile');
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: `${countryCode} ${phoneVal}` }]);
    setConversation(prev => [...prev, `Q: What is your WhatsApp number?\nA: ${countryCode}${phoneVal}`]);
    
    setStep(8);
    setShowInputs(false);
    
    // Add bot explanation and trigger lead capture + OTP send APIs
    const verificationText = "To send you the customized plan, we need to first verify your details.";
    const id = Math.random().toString();
    setMessages(prev => [...prev, { id, sender: 'bot', text: '...', isTyping: true }]);
    
    setTimeout(async () => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: verificationText, isTyping: false } : m));
      await processLeadSubmissionAndSendOtp(phoneVal, preferredCallbackTime);
    }, 1800);
  };

  // Performs initial lead capture API followed by OTP sending API
  const processLeadSubmissionAndSendOtp = async (targetPhone: string, targetCallback: string) => {
    setIsSendingOtp(true);
    setFormError('');
    setErrorMsg('');

    const utms = getStoredUtm();
    const behaviour = getBehaviourSnapshot();

    // 1. Submit lead details as Unverified (so they are registered in Sheets and CRM immediately)
    try {
      await fetch('https://lp-vercel.analytixlabs.co.in/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          city,
          status,
          countryCode,
          mobile: targetPhone,
          form_source: sourceName,
          typeFilter: typeFilter || 'PPC_HeroForm_Conversational',
          ...utms,
          ...behaviour,
          submission_timestamp: new Date().toISOString(),
          landing_page_url: typeof window !== 'undefined' ? window.location.href : '',
          referrer_url: typeof document !== 'undefined' ? document.referrer : '',
          debug,
        })
      });
    } catch (err) {
      console.error('[ConversationalForm] submit-lead error:', err);
    }

    // 2. Send OTP with skipSheets: true (since the lead row already got appended above)
    try {
      const res = await fetch('https://lp-vercel.analytixlabs.co.in/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          city,
          status,
          countryCode,
          mobile: targetPhone,
          form_source: sourceName,
          typeFilter: typeFilter || 'PPC_HeroForm_Conversational',
          ...utms,
          ...behaviour,
          submission_timestamp: new Date().toISOString(),
          landing_page_url: typeof window !== 'undefined' ? window.location.href : '',
          referrer_url: typeof document !== 'undefined' ? document.referrer : '',
          debug,
          skipSheets: true,
        }),
      });

      const data = await res.json();
      setIsSendingOtp(false);

      if (!data.success) {
        setFormError(data.error || 'Something went wrong while sending the verification code. Please try again.');
        return;
      }

      if (data.fallback) {
        if (debug && data.debugInfo) {
          setFormError(`[DEBUG] OTP Delivery Failed: ${data.debugInfo}`);
          return;
        }
        // WhatsApp API failed -> fallback silently to success immediately (no block)
        onSuccess?.(email);
        const params = new URLSearchParams({ email, name, phone: targetPhone });
        window.location.href = `${thankYouPath}?${params.toString()}`;
        return;
      }

      // OTP sent successfully
      setToken(data.token);
      setResendTimer(30);
      setShowInputs(true); // show OTP verification inputs inside the chat area
    } catch (err) {
      setIsSendingOtp(false);
      setFormError('Connection error. Please check your internet and try again.');
    }
  };

  // OTP Verification Handler
  const handleOtpVerify = async () => {
    if (otpValue.length !== 4) return;

    setIsVerifying(true);
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
      setIsVerifying(false);

      if (!data.success) {
        setErrorMsg(data.error || 'Incorrect OTP code. Please check and try again.');
        setOtpValue('');
        return;
      }

      // If debug info returned during verification
      if (debug && data.debugInfo) {
        setFormError(`[VERIFY DEBUG] ${data.debugInfo}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Submit qualification answers to CRM and sheets
      const qualConfigKey = qualificationConfigKey || 'data-science-ai';
      if (QUALIFICATION_CONFIG[qualConfigKey]) {
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
      setIsVerifying(false);
      setErrorMsg('Verification failed. Server is currently unreachable.');
    }
  };

  // Resend OTP logic inside the chat UI
  const handleResendOtp = async () => {
    setOtpValue('');
    setErrorMsg('');
    setToken('');
    await processLeadSubmissionAndSendOtp(mobile, preferredCallbackTime);
  };

  const handleSpecificTimePickerSubmit = () => {
    if (selectedDate && selectedTime) {
      const dt = new Date(selectedDate);
      const day = dt.getDay(); // 0 is Sunday
      if (day === 0) {
        alert("Advisors are not available on Sundays. Please pick Monday to Saturday.");
        return;
      }
      const [hh, mm] = selectedTime.split(':').map(Number);
      if (hh < 10 || hh > 18 || (hh === 18 && mm > 0)) {
        alert("Please pick a time between 10 AM and 6 PM.");
        return;
      }
      setShowTimePicker(false);
      handleCallbackSubmit(`${selectedDate} at ${selectedTime}`);
    }
  };

  return (
    <div className="px-5 py-6 bg-white/55 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl relative overflow-hidden flex flex-col h-[620px] w-full" id="hero-lead-capture">
      {/* Title / Header */}
      <div className="mb-4 relative z-10 border-b border-[#D6ECEB]/40 pb-3">
        <h2 className="font-display font-bold text-[#09263F] text-xl mb-0.5">{title}</h2>
        <p className="text-[#4A6275] text-sm">Chat with our AI advisor to customize your learning path.</p>
      </div>

      {/* Global Error Banner */}
      {formError && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {formError}
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3.5 pr-1 scroll-smooth" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-base ${
              m.sender === 'user'
                ? 'bg-[#09263F] text-white rounded-br-none animate-in slide-in-from-right-2 duration-200'
                : 'bg-white text-[#09263F] border border-[#D6ECEB] rounded-bl-none shadow-sm animate-in slide-in-from-left-2 duration-200'
            }`}>
              {m.isTyping ? (
                <div className="flex items-center gap-1 h-4">
                  <div className="w-1.5 h-1.5 bg-[#4A6275] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#4A6275] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#4A6275] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Options / Controls Area */}
      <div className="relative z-30 bg-white/70 backdrop-blur-md border-t border-[#D6ECEB] pt-3 -mx-5 px-5 pb-1">
        {showInputs && (
          <div className="space-y-3 animate-in slide-in-from-bottom-3 duration-300">
            {/* Step 0: Status Selection */}
            {step === 0 && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {['Working professional', 'Fresher / recent graduate', 'Student', 'Between jobs right now'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleUserSelection(opt)}
                    className="px-4 py-2 bg-white text-[#09263F] text-base font-semibold rounded-full border border-[#29E8A4] hover:bg-[#29E8A4] hover:text-[#09263F] active:scale-[0.97] transition-all duration-150"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Interest */}
            {step === 1 && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {['Start my career in data / AI', 'Switch into a data / AI role', 'Upskill or get promoted', 'Just exploring for now'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleUserSelection(opt)}
                    className="px-4 py-2 bg-white text-[#09263F] text-base font-semibold rounded-full border border-[#29E8A4] hover:bg-[#29E8A4] hover:text-[#09263F] active:scale-[0.97] transition-all duration-150"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Timeline */}
            {step === 2 && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {['This month', 'In the next month or two', 'Still figuring it out'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleUserSelection(opt)}
                    className="px-4 py-2 bg-white text-[#09263F] text-base font-semibold rounded-full border border-[#29E8A4] hover:bg-[#29E8A4] hover:text-[#09263F] active:scale-[0.97] transition-all duration-150"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Name Input */}
            {step === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const val = new FormData(form).get('custom_name') as string;
                  if (val.trim()) {
                    handleTypedSubmit(val);
                    form.reset();
                  }
                }}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  name="custom_name"
                  required
                  placeholder="Enter your full name..."
                  className="flex-1 px-4 py-2.5 text-base border border-[#D6ECEB] rounded-full focus:outline-none focus:border-[#29E8A4] focus:ring-1 focus:ring-[#29E8A4]"
                />
                <button type="submit" className="px-5 py-2.5 bg-[#09263F] text-white text-base font-semibold rounded-full hover:bg-[#153e5e] active:scale-95 transition-all">
                  Send
                </button>
              </form>
            )}

            {/* Step 4: Email Input */}
            {step === 4 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const val = new FormData(form).get('custom_email') as string;
                  if (val.trim()) {
                    handleTypedSubmit(val);
                    form.reset();
                  }
                }}
                className="flex gap-2 items-center"
              >
                <input
                  type="email"
                  name="custom_email"
                  required
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-2.5 text-base border border-[#D6ECEB] rounded-full focus:outline-none focus:border-[#29E8A4] focus:ring-1 focus:ring-[#29E8A4]"
                />
                <button type="submit" className="px-5 py-2.5 bg-[#09263F] text-white text-base font-semibold rounded-full hover:bg-[#153e5e] active:scale-95 transition-all">
                  Send
                </button>
              </form>
            )}

            {/* Step 5: City Selector */}
            {step === 5 && (
              <div className="pb-1">
                <SearchableCitySelect
                  name="city"
                  value={city}
                  onChange={handleCitySubmit}
                  placeholder="Search and select city..."
                  openUpward={true}
                />
              </div>
            )}

            {/* Step 6: Callback Time */}
            {step === 6 && !showTimePicker && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {['As soon as possible', 'Later today (before 6 PM)', 'Tomorrow morning (10 AM–1 PM)', 'Tomorrow afternoon (1–6 PM)', 'Let me pick a specific time'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (opt === 'Let me pick a specific time') {
                        setShowTimePicker(true);
                      } else {
                        handleCallbackSubmit(opt);
                      }
                    }}
                    className="px-4 py-2 bg-white text-[#09263F] text-base font-semibold rounded-full border border-[#29E8A4] hover:bg-[#29E8A4] hover:text-[#09263F] active:scale-[0.97] transition-all duration-150"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 6: Time Picker Sub-View */}
            {step === 6 && showTimePicker && (
              <div className="space-y-2.5 p-2 border border-[#D6ECEB] rounded-xl bg-white animate-in zoom-in-95 duration-200">
                <p className="text-sm font-bold text-[#09263F]">Pick callback time (Mon-Sat, 10 AM - 6 PM)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    className="px-3 py-2 text-base border border-[#D6ECEB] rounded-lg focus:outline-none focus:border-[#29E8A4]"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <input 
                    type="time" 
                    className="px-3 py-2 text-base border border-[#D6ECEB] rounded-lg focus:outline-none focus:border-[#29E8A4]"
                    value={selectedTime}
                    min="10:00"
                    max="18:00"
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSpecificTimePickerSubmit}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 py-2 bg-[#29E8A4] text-[#09263F] text-sm font-bold rounded-lg disabled:opacity-50"
                  >
                    Confirm Time
                  </button>
                </div>
              </div>
            )}

            {/* Step 7: Phone Input */}
            {step === 7 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = mobile.trim();
                  if (val.length === 10) {
                    handlePhoneSubmit(val);
                  }
                }}
                className="flex gap-2 items-stretch"
              >
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="w-20 flex-shrink-0 px-2.5 py-2.5 rounded-xl border border-[#D6ECEB] bg-white text-[#09263F] text-base font-semibold focus:outline-none focus:border-[#29E8A4]"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit WhatsApp number"
                    maxLength={10}
                    className="w-full pl-3 pr-28 py-2.5 rounded-xl border border-[#D6ECEB] bg-white text-[#09263F] text-base placeholder-[#9BBAC0] focus:outline-none focus:border-[#29E8A4]"
                  />
                  <button
                    type="submit"
                    disabled={mobile.length !== 10 || isSendingOtp}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      mobile.length === 10 && !isSendingOtp
                        ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] active:scale-95'
                        : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    }`}
                  >
                    {isSendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 8: OTP Verification Code */}
            {step === 8 && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-sm font-medium text-[#29E8A4]">
                  <span>OTP code sent to {countryCode} {mobile}</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setStep(7);
                      setMobile('');
                      setShowInputs(true);
                    }} 
                    className="text-[#4A6275] hover:text-[#09263F] underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={otpValue}
                    onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    disabled={isVerifying}
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                    autoFocus
                    className="w-full pl-3 pr-28 py-2.5 rounded-xl border border-[#1DE5B5] bg-white text-[#09263F] text-base placeholder-[#9BBAC0] tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/20"
                  />
                  <button
                    type="button"
                    onClick={handleOtpVerify}
                    disabled={otpValue.length !== 4 || isVerifying}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      otpValue.length === 4 && !isVerifying
                        ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] active:scale-95'
                        : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    }`}
                  >
                    {isVerifying ? '...' : 'Verify'}
                  </button>
                </div>
                
                {errorMsg && <p className="text-sm text-red-500 font-medium">{errorMsg}</p>}
                
                <div className="flex justify-between items-center text-sm text-[#4A6275]">
                  <span>Didn't receive it?</span>
                  {resendTimer > 0 ? (
                    <span className="font-semibold">Resend in {resendTimer}s</span>
                  ) : (
                    <button type="button" onClick={handleResendOtp} className="text-[#239bf5] font-bold hover:underline">
                      Resend Now
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compliance / Privacy Consent Bar (Renders at the bottom) */}
      <div className="mt-3 flex items-start gap-2 pt-2 border-t border-[#D6ECEB]/40 relative z-10">
        <input
          type="checkbox" id="consent" name="consent" required defaultChecked
          className="mt-0.5 w-3.5 h-3.5 rounded border-[#D6ECEB] text-[#1DE5B5] focus:ring-[#1DE5B5]/40 accent-[#1DE5B5] cursor-pointer"
        />
        <label htmlFor="consent" className="text-xs text-[#4A6275] leading-relaxed cursor-pointer select-none">
          I agree to the <a href="/privacy-policy" className="text-[#239bf5] hover:underline font-semibold">Privacy Policy</a> and consent to being contacted by AnalytixLabs. <span className="text-[#1DE5B5] font-semibold">No Spam ❤️</span>
        </label>
      </div>
    </div>
  );
}
