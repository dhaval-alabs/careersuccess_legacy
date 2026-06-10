'use client';

import { useState } from 'react';
import HeroLeadCaptureForm from '../../components/HeroLeadCaptureForm';
import Image from 'next/image';

export default function OtpTestPage() {
  const [debug, setDebug] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-[#F4FAFA] relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1DE5B5]/10 -translate-y-1/3 translate-x-1/3 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#239bf5]/5 translate-y-1/3 -translate-x-1/3 blur-[80px]" />
      </div>

      {/* Header / Logo */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/lp/images/analytixlabs-logo.webp"
            alt="AnalytixLabs"
            width={180}
            height={40}
            className="w-auto h-12"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="text-[#09263F] text-2xl font-bold mb-2">Internal OTP Verification Test</h1>
          <p className="text-[#4A6275] text-sm max-w-sm">
            This is a <strong>private dummy page</strong> for testing the WhatsApp OTP delivery and verification flow. 
            All submissions will be logged as test data.
          </p>
        </div>
      </div>

      {/* Debug Toggle */}
      <div className="relative z-10 mb-6">
        <label className="flex items-center gap-3 cursor-pointer group bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D6ECEB] hover:border-[#1DE5B5] transition-all">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${debug ? 'bg-[#1DE5B5]' : 'bg-gray-300'}`} />
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${debug ? 'translate-x-4' : ''}`} />
          </div>
          <span className="text-xs font-bold text-[#09263F] tracking-tight">ENABLE DIAGNOSTIC (DEBUG) MODE</span>
        </label>
      </div>

      {/* Debug Status Banner */}
      {debug && (
        <div className="relative z-10 mb-4 px-4 py-2 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-2">
          <span>🐛</span>
          <span>Debug mode ON — API errors will be shown instead of silent fallback</span>
        </div>
      )}

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-[0_32px_100px_rgba(0,0,0,0.12)] border border-[#D6ECEB] overflow-hidden">
          <HeroLeadCaptureForm 
            title="Test WhatsApp Integration"
            sourceName="Internal_OTP_Test_Page"
            typeFilter="OTP_TEST_INTERNAL"
            buttonText="Send Test OTP"
            thankYouPath="/thankyou-check-your-eligibility"
            debug={debug}
          />
        </div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 mt-12">
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-[10px] font-bold uppercase tracking-wider">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Index Protected: No-Index / No-Follow Enabled
        </div>
      </div>
    </div>
  );
}
