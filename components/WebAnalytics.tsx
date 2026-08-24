'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebAnalytics() {
  useReportWebVitals((metric) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        metric_rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        metric_value: metric.value,
        metric_delta: metric.delta,
        non_interaction: true,
      });
    }
  });

  return null;
}
