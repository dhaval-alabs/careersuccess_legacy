import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Outfit, DM_Sans } from 'next/font/google';
import ClientInit from '../components/ClientInit';
import WebAnalytics from '../components/WebAnalytics';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-outfit',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: "Data Science Specialization Course | AnalytixLabs",
  description: "Accelerate your career with our Data Science Specialization Course. NASSCOM-FutureSkills Prime Certified program with placement guarantee.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${dmSans.variable}`}>
      <head>
        {/* Preconnect hints for fonts & CDNs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://load.sgtmv1.analytixlabs.co.in" />
        <link rel="preconnect" href="https://sgtmv1.analytixlabs.co.in" />

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`!function(){"use strict";function l(e){for(var t=e,r=0,n=document.cookie.split(";");r<n.length;r++){var o=n[r].split("=");if(o[0].trim()===t)return o[1]}}function s(e){return localStorage.getItem(e)}function u(e){return window[e]}function A(e,t){e=document.querySelector(e);return t?null==e?void 0:e.getAttribute(t):null==e?void 0:e.textContent}var e=window,t=document,r="script",n="dataLayer",o="https://sgtmv1.analytixlabs.co.in",a="https://load.sgtmv1.analytixlabs.co.in",i="3x7ovfqaivmiy",c="aab=EA1QMT0sXCs3XiY8PTc%2FQA9UX1hYRxUIRAgDFwUYBQ8BBQwUGk8SCVcAAw%3D%3D",g="cookie",v="_user_id",E="",d=!1;try{var d=!!g&&(m=navigator.userAgent,!!(m=new RegExp("Version/([0-9._]+)(.*Mobile)?.*Safari.*").exec(m)))&&16.4<=parseFloat(m[1]),f="stapeUserId"===g,I=d&&!f?function(e,t,r){void 0===t&&(t="");var n={cookie:l,localStorage:s,jsVariable:u,cssSelector:A},t=Array.isArray(t)?t:[t];if(e&&n[e])for(var o=n[e],a=0,i=t;a<i.length;a++){var c=i[a],c=r?o(c,r):o(c);if(c)return c}else console.warn("invalid uid source",e)}(g,v,E):void 0;d=d&&(!!I||f)}catch(e){console.error(e)}var m=e,g=(m[n]=m[n]||[],m[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"}),t.getElementsByTagName(r)[0]),v=I?"&bi="+encodeURIComponent(I):"",E=t.createElement(r),f=(d&&(i=8<i.length?i.replace(/([a-z]{8}$)/,"kp$1"):"kp"+i),!d&&a?a:o);E.async=!0,E.src=f+"/"+i+".js?"+c+v,null!=(e=g.parentNode)&&e.insertBefore(E,g)}();`}
        </Script>
        {/* End Google Tag Manager */}
        {/* Google Tag Manager (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-783236209"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('set', 'conversion_linker', true);
            gtag('config', 'AW-783236209');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            /* 1a. Click ID recovery. Meta writes _fbc ONLY when it sees ?fbclid on that
            exact landing, so clicks that arrive via a redirect, load with the pixel
            slow to boot, or return in a later session lose it entirely. Rebuild the
            envelope from a persisted fbclid. Must run BEFORE init. */
            (function () {
              try {
                var q = new URLSearchParams(window.location.search);
                var fbclid = q.get('fbclid') || localStorage.getItem('fbclid');
                if (!fbclid) return;
                localStorage.setItem('fbclid', fbclid);
                if (!localStorage.getItem('fbclid_ts')) {
                  localStorage.setItem('fbclid_ts', String(Date.now()));
                }
                if (document.cookie.indexOf('_fbc=') !== -1) return; // Meta already set it
                if (fbclid.indexOf('fb.') === 0) return; // already an envelope
                var ts = Number(localStorage.getItem('fbclid_ts')) || Date.now();
                // Version digit tracks the click-id FORMAT, not the API version:
                // encrypted 'PA…' ids are v2, classic fbclids are v1.
                var ver = fbclid.indexOf('PA') === 0 ? '2' : '1';
                document.cookie = '_fbc=fb.' + ver + '.' + ts + '.' + fbclid +
                  ';max-age=7776000;path=/;SameSite=Lax';
              } catch (e) {}
            })();
            /* 1b. Manual Advanced Matching. Replays a known visitor's identity so every
            later PageView is matched instead of anonymous. */
            var am = {};
            try {
              var raw = localStorage.getItem('al_am');
              if (raw) {
                var d = JSON.parse(raw);
                ['em','ph','fn','ln','ct','st','zp','country'].forEach(function (k) {
                  if (d && typeof d[k] === 'string' && d[k]) am[k] = d[k];
                });
              }
            } catch (e) {}
            fbq('init', '1266998543986581', am);
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://load.sgtmv1.analytixlabs.co.in/ns.html?id=GTM-MN7KJTVN"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1266998543986581&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}
        <ClientInit />
        <WebAnalytics />
        {children}
      </body>
    </html>
  );
}
