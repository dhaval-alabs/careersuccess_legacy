'use client';

import { useEffect } from 'react';
import { captureUtmParams } from '../utils/captureUtm';

export default function ClientInit() {
  useEffect(() => {
    captureUtmParams();
  }, []);
  return null;
}
