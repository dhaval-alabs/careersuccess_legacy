// blog-assets/utils/captureUtm.ts

export const captureUtmParams = (): void => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
  ];

  keys.forEach((key) => {
    const value = params.get(key);
    // Only write if present in URL — never overwrite with empty string
    if (value) sessionStorage.setItem(`alabs_blog_${key}`, value);
  });
};

export const getStoredUtm = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  return Object.fromEntries(
    keys.map((k) => [k, sessionStorage.getItem(`alabs_blog_${k}`) || ''])
  );
};
