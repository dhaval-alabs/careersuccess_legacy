// blog-assets/utils/trackAdvancedBehaviour.ts

/**
 * Advanced Behavioral Tracking for alabs-blog
 * Captures: Rage clicks, Section engagement, Scroll %, TOC usage, and Time on Page.
 */

let pageLoadTime: number = Date.now();
let maxScrollPct: number = 0;
let firstFieldTime: number | null = null;
let firstFieldName: string = '';
let interactionLog: string[] = []; // Stores sequence of events (e.g. "Entered Section 1", "Clicked TOC")
let sectionEntryTimes: Record<string, number> = {};
let lastClickTime: number = 0;
let clickCount: number = 0;

// Helper to get device type
const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'Desktop';
  const w = window.innerWidth;
  if (w < 768)  return 'Mobile';
  if (w < 1024) return 'Tablet';
  return 'Desktop';
};

// Log a sequence event
const logEvent = (msg: string) => {
  const time = Math.round((Date.now() - pageLoadTime) / 1000);
  interactionLog.push(`[${time}s] ${msg}`);
  // Keep log concise (last 20 events)
  if (interactionLog.length > 20) interactionLog.shift();
};

export const initAdvancedTracking = (): void => {
  if (typeof window === 'undefined') return;

  // Reset counters
  pageLoadTime = Date.now();
  maxScrollPct = 0;
  interactionLog = ["Page Loaded"];
  
  // 1. Scroll Depth tracking
  const onScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total    = document.body.scrollHeight;
    const pct      = Math.round((scrolled / total) * 100);
    if (pct > maxScrollPct) maxScrollPct = pct;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // 2. Section Entry tracking (IntersectionObserver)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id || entry.target.textContent?.slice(0, 20) || 'Unknown Section';
        logEvent(`Entered: ${id}`);
      }
    });
  }, { threshold: 0.5 });

  // Watch all H2 and H3 tags as "sections"
  document.querySelectorAll('h2, h3, section').forEach(el => observer.observe(el));

  // 3. Rage Click Detection
  window.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastClickTime < 500) {
      clickCount++;
    } else {
      clickCount = 1;
    }
    lastClickTime = now;

    if (clickCount >= 3) {
      logEvent(`RAGE CLICK detected on <${(e.target as HTMLElement).tagName.toLowerCase()}>`);
      clickCount = 0; // Reset after detection
    }

    // 4. TOC Usage Detection
    const target = e.target as HTMLElement;
    const tocLink = target.closest('a[href^="#"]');
    if (tocLink) {
      logEvent(`TOC/Anchor Click: ${tocLink.getAttribute('href')}`);
    }
  });
};

export const recordFirstField = (fieldName: string): void => {
  if (firstFieldTime !== null) return;
  firstFieldTime = Date.now();
  firstFieldName = fieldName;
  logEvent(`Started filling: ${fieldName}`);
};

export const getAdvancedBehaviourSnapshot = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    time_on_page_seconds:    Math.round((Date.now() - pageLoadTime) / 1000),
    max_scroll_pct:          maxScrollPct,
    form_completion_seconds: firstFieldTime ? Math.round((Date.now() - firstFieldTime) / 1000) : null,
    first_field_touched:     firstFieldName || null,
    device_type:             getDeviceType(),
    viewport_width:          window.innerWidth,
    browser_info:            navigator.userAgent.substring(0, 150),
    referrer_url:            document.referrer || 'Direct',
    landing_page_url:        window.location.href,
    submission_timestamp:    new Date().toISOString(),
    behaviour_log:           interactionLog.join(' > ')
  };
};
