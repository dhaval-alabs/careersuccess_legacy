// blog-assets/components/ClientInit.tsx
'use client';

import { useEffect } from 'react';
import { captureUtmParams } from '../utils/captureUtm';
import { initAdvancedTracking } from '../utils/trackAdvancedBehaviour';

/**
 * Add this component to your blog's layout.tsx (inside the body)
 * to initialize first-party tracking on every page load.
 */
export default function ClientInit() {
  useEffect(() => {
    // 1. Store marketing parameters (UTM, GCLID)
    captureUtmParams();
    
    // 2. Start behavioral monitoring (Scroll, Rage clicks, etc.)
    initAdvancedTracking();
  }, []);

  return null;
}
