'use client';
import ThankYouPage from '@/components/ThankYouPage';
import { Suspense } from 'react';

function ThankYouWrapper() {
  return (
    <ThankYouPage
      heading="Demo Seat Confirmed!"
      subCopy="You've successfully registered for the demo session. Our team will send you the session details shortly."
      conversionId="AW-783236209/VXQtCOvzhf4aEPH4vPUC"
      verifiedConversionId="AW-783236209/_P91CJCu-KEcEPH4vPUC"
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
