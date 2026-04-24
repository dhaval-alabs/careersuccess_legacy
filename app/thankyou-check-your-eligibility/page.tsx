'use client';
import ThankYouPage from '@/components/ThankYouPage';
import { Suspense } from 'react';

function ThankYouWrapper() {
  return (
    <ThankYouPage
      heading="We've Received Your Request!"
      subCopy="Our learning advisor will call you shortly to walk you through your eligibility and next steps."
      conversionId="AW-783236209/wuuECKD9hv4aEPH4vPUC"
      verifiedConversionId="AW-783236209/5pttCN-d-qEcEPH4vPUC"
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
