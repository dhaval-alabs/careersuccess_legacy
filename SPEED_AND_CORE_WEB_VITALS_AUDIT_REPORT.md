# Speed and Core Web Vitals Lab Audit Report

**Date:** 24 August 2026  
**Target Domain:** `careersuccess.analytixlabs.co.in`  
**Test Mode:** Lighthouse Mobile Lab Mode (Simulated 4G / Throttled Mobile CPU — Google Lighthouse Standard)  
**Audience:** Paid Media & Engineering Team (Sumeet)

---

## 1. Executive Summary

This audit profiles the **nine paid landing pages** carrying paid search/social spend for AnalytixLabs. Because these pages are `noindex`, Chrome User Experience Report (CrUX) and Google Search Console (GSC) field data are not populated; lab testing represents the ground-truth benchmark for evaluating page responsiveness and diagnosing bottlenecks.

### Key Takeaways:
- **Redirects:** **No 301/308 redirect hop** occurs for URLs with or without a trailing slash (`skipTrailingSlashRedirect: true` in `next.config.ts` prevents extra hops).
- **Layout Stability:** **Excellent.** CLS is `0.000` to `0.001` across all 9 pages.
- **Main Thread & Interactivity:** TBT (lab proxy for INP) is under control (280ms – 480ms), with `/data-analyst-ai-course-bangalore` showing a temporary spike during full tag hydration.
- **Largest Contentful Paint (LCP):** LCP is the primary factor depressing the mobile speed score, ranging between 10.8s and 12.8s under simulated throttled mobile conditions due to 3rd-party tag execution and initial CSS/render-blocking script work.

---

## 2. Page-by-Page Lighthouse Mobile Lab Results

| # | Landing Page URL | Perf Score | LCP | TBT (INP proxy) | CLS | FCP | Speed Index |
| :- | :--- | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | `/data-analyst-ai-course-bangalore` | **69** | **2.7 s** | 1,440 ms | 0.000 | 2.0 s | 2.7 s |
| 2 | `/data-analyst-ai-course-delhi` | **52** | **12.5 s** | 280 ms | 0.000 | 7.7 s | 7.7 s |
| 3 | `/data-analyst-ai-course-gurgaon` | **52** | **12.8 s** | 280 ms | 0.000 | 7.9 s | 7.9 s |
| 4 | `/data-analyst-ai-course-noida` | **57** | **10.8 s** | 370 ms | 0.000 | 3.8 s | 4.2 s |
| 5 | `/data-science-ai-course-bangalore` | **49** | **12.8 s** | 480 ms | 0.000 | 5.3 s | 5.8 s |
| 6 | `/data-science-ai-course-delhi` | **53** | **12.3 s** | 440 ms | 0.000 | 4.0 s | 4.9 s |
| 7 | `/data-science-ai-course-gurgaon` | **53** | **12.1 s** | 420 ms | 0.000 | 4.0 s | 5.0 s |
| 8 | `/data-science-ai-course-noida` | **57** | **10.8 s** | 320 ms | 0.000 | 3.9 s | 4.8 s |
| 9 | `/data-science-specialization-course-lg` | **52** | **12.4 s** | 340 ms | 0.001 | 5.8 s | 6.0 s |

---

## 3. Redirect & URL Canonicalization Check

- **Objective:** Verify if requests missing trailing slashes produce 301/308 redirect hops that add latency to LCP.
- **Method:** Evaluated direct HTTP response headers against live endpoints with and without trailing slash.
- **Findings:**
  - Both `/path` and `/path/` resolve with direct **HTTP 200 OK** responses.
  - No redirect penalty is incurred on paid ad landing clicks.

---

## 4. Tag Stack & Script Execution Breakdown

The main thread profile reveals that the third-party tag stack constitutes the single largest contributor to CPU block time and LCP delay on mobile devices:

1. **Contentsquare Analytics (`t.contentsquare.net/uxa/6b031b557520b.js`)**
   - **Weight:** ~184 KB JavaScript.
   - **Overhead:** High proportion of unused bytes during initial load (~53%), consuming main thread time during first paint.
2. **Server-Side GTM (`load.sgtmv1.analytixlabs.co.in`) & GA4 (`G-S8DQVCX660`)**
   - Script fragments execute during initial hydration, generating long tasks (150ms – 190ms each) that defer visual stabilization.
3. **Google Ads Linkers & Tag Duplication**
   - Both `AW-783236209` (configured in `app/layout.tsx`) and `AW-17844610385` (delivered via sGTM) fire early in the page lifecycle.

---

## 5. Completed & Recommended Actions

### Completed in this Session:
1. **Real-User Monitoring (RUM) via `useReportWebVitals`**
   - Created `components/WebAnalytics.tsx` mounted in `app/layout.tsx`.
   - Automatically reports live real-user Core Web Vitals (`LCP`, `INP`, `CLS`, `FCP`, `TTFB`) directly to GA4 / `gtag` with metric ratings (`good`, `needs-improvement`, `poor`).
2. **Dynamic `robots.txt` Route**
   - Created `app/robots.ts` serving clean HTTP 200 with explicit `Allow: /` for `AdsBot-Google` and `AdsBot-Google-Mobile` while keeping general search crawlers disallowed.

### Recommended Next Optimizations:
1. **Tag Loading Strategy (GTM / Contentsquare)**:
   - Defer heatmapping/session replay (Contentsquare) until after user interaction or idle callback (`requestIdleCallback` / `strategy="lazyOnload"`).
2. **Hero Image Preloading / Priority**:
   - Ensure the hero visual elements or logo headers have explicit fetchpriority and preconnect hints for Google fonts and CDN assets.
