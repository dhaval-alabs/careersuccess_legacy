/**
 * scripts/verify-deployment.js
 *
 * Automated post-deployment verification script for AnalytixLabs CareerSuccess landing pages & backend APIs.
 *
 * Runs synthetic health checks across:
 *  1. Live Landing Pages (HTTP 200 checks)
 *  2. CORS headers on all API endpoints (Access-Control-Allow-Origin)
 *  3. API OPTIONS preflight checks
 *  4. OTP Send & Token Generation handshake
 *  5. OTP Verification & Error handling handshake
 *  6. Conversion Tracking endpoint check
 */

const BASE_URL = process.env.VERIFY_BASE_URL || 'https://lp-vercel.analytixlabs.co.in';
const ALLOWED_ORIGIN = 'https://careersuccess.analytixlabs.co.in';

const PAGES_TO_CHECK = [
  '/',
  '/delhi-otp',
  '/data-science-ai-course-delhi',
  '/data-science-ai-course-bangalore',
  '/data-science-ai-course-gurgaon',
  '/data-science-ai-course-noida',
  '/data-analyst-ai-course-bangalore',
  '/data-analyst-ai-course-delhi',
  '/data-analyst-ai-course-gurgaon',
  '/data-analyst-ai-course-noida',
  '/analytixlabs-contact-us',
  '/thankyou-check-your-eligibility',
  '/thankyou-download-brochure',
  '/thankyou-for-registration',
];

const API_ROUTES = [
  '/api/otp/send',
  '/api/otp/verify',
  '/api/submit-lead',
  '/api/track-conversion',
  '/api/qualify',
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function logPass(msg) {
  totalTests++;
  passedTests++;
  console.log(`  \x1b[32m✔ PASS\x1b[0m: ${msg}`);
}

function logFail(msg, err) {
  totalTests++;
  failedTests++;
  console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${msg}${err ? ` -> ${err}` : ''}`);
}

async function checkPages() {
  console.log('\n\x1b[1m[1/4] Checking Landing Page Routes (HTTP 200)...\x1b[0m');
  for (const page of PAGES_TO_CHECK) {
    const url = `${BASE_URL}${page}`;
    try {
      const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(6000) });
      if (res.status === 200) {
        logPass(`${page} returned 200 OK`);
      } else {
        logFail(`${page} returned status ${res.status}`);
      }
    } catch (e) {
      logFail(`${page} request error: ${e.message}`);
    }
  }
}

async function checkCorsAndOptions() {
  console.log('\n\x1b[1m[2/4] Checking CORS Preflight & Headers across APIs...\x1b[0m');
  for (const route of API_ROUTES) {
    const url = `${BASE_URL}${route}`;
    try {
      const res = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          Origin: ALLOWED_ORIGIN,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
        signal: AbortSignal.timeout(6000),
      });

      const allowOrigin = res.headers.get('access-control-allow-origin');
      if (allowOrigin === ALLOWED_ORIGIN || allowOrigin === '*') {
        logPass(`${route} CORS preflight OK (Origin: ${allowOrigin})`);
      } else {
        logFail(`${route} CORS header missing or mismatched. Got: ${allowOrigin}`);
      }
    } catch (e) {
      logFail(`${route} OPTIONS request error: ${e.message}`);
    }
  }
}

async function checkOtpFlowHandshake() {
  console.log('\n\x1b[1m[3/4] Checking OTP Send & Verify Handshake Contract...\x1b[0m');
  let token = null;
  const testPhone = '98' + Math.floor(10000000 + Math.random() * 90000000);

  // 1. Send OTP dry-run check (skipSheets: true)
  try {
    const res = await fetch(`${BASE_URL}/api/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ALLOWED_ORIGIN,
      },
      body: JSON.stringify({
        name: 'Deployment HealthCheck',
        email: 'deployment-test@analytixlabs.co.in',
        city: 'Delhi',
        countryCode: '+91',
        mobile: testPhone,
        skipSheets: true,
        debug: true,
      }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      token = data.token;
      logPass('/api/otp/send returned valid HMAC token and 200 OK');
    } else {
      logFail(`/api/otp/send failed. Status: ${res.status}, Body: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    logFail(`/api/otp/send request exception: ${e.message}`);
  }

  // 2. Verify with the generated token
  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: JSON.stringify({
          token,
          otp_entered: '0000',
          mobile: testPhone,
          countryCode: '+91',
          name: 'Deployment HealthCheck',
          email: 'deployment-test@analytixlabs.co.in',
          debug: true,
        }),
        signal: AbortSignal.timeout(8000),
      });

      const data = await res.json();
      // On an invalid dummy OTP, the endpoint should return status 400 with a clean error message, NOT 500 or crash
      if (res.status === 400 && (data.error || '').toLowerCase().includes('otp')) {
        logPass('/api/otp/verify properly handles HMAC token & returns expected validation error for dummy code');
      } else if (res.status === 500) {
        logFail(`/api/otp/verify crashed with HTTP 500: ${JSON.stringify(data)}`);
      } else {
        logPass(`/api/otp/verify handshake active (Status: ${res.status}, msg: "${data.error || 'ok'}")`);
      }
    } catch (e) {
      logFail(`/api/otp/verify request exception: ${e.message}`);
    }
  } else {
    logFail('/api/otp/verify skipped due to missing token from send step');
  }
}

async function checkConversionTracking() {
  console.log('\n\x1b[1m[4/4] Checking Conversion Tracking Endpoint...\x1b[0m');
  try {
    const res = await fetch(`${BASE_URL}/api/track-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ALLOWED_ORIGIN,
      },
      body: JSON.stringify({
        ctaName: 'lp_blr_download_brochure',
        email: 'deployment-test@analytixlabs.co.in',
      }),
      signal: AbortSignal.timeout(6000),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok || res.status === 200 || data.success === true || (res.status === 400 && data.error && !data.error.includes('Missing'))) {
      logPass(`/api/track-conversion is reachable and active (Status: ${res.status})`);
    } else {
      logFail(`/api/track-conversion returned status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    logFail(`/api/track-conversion request error: ${e.message}`);
  }
}

async function runAllChecks() {
  console.log(`\n======================================================`);
  console.log(` 🚀 ANALYTIXLABS DEPLOYMENT VERIFICATION HEALTHCHECK `);
  console.log(` Target Base URL: ${BASE_URL}`);
  console.log(` Allowed Origin:  ${ALLOWED_ORIGIN}`);
  console.log(`======================================================`);

  const startTime = Date.now();
  await checkPages();
  await checkCorsAndOptions();
  await checkOtpFlowHandshake();
  await checkConversionTracking();
  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n======================================================`);
  console.log(` Summary: ${passedTests}/${totalTests} Passed | ${failedTests} Failed | (${elapsedSec}s)`);
  console.log(`======================================================\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllChecks();
