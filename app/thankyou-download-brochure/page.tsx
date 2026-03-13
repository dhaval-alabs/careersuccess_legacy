'use client';
import ThankYouPage from '@/components/ThankYouPage';
import { Suspense } from 'react';

function ThankYouWrapper() {
  return (
    <ThankYouPage
      heading="Your Brochure is On Its Way!"
      subCopy="We've sent the programme brochure to your email. Check your inbox (and spam folder, just in case)."
      conversionId="AW-783236209/389QCJfKlv4aEPH4vPUC"
      isBrochureDownload={true}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouWrapper />
    </Suspense>
  );
}
