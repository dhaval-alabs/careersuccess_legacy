const fs = require('fs');

async function main() {
  const url = 'https://masterclass.analytixlabs.co.in/';
  const res = await global.fetch(url);
  const html = await res.text();

  // Find all script tags
  const scriptRegex = /<script\b[^>]*src="([^"]+)"/g;
  let match;
  const scripts = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }

  console.log('Found scripts:', scripts);

  for (const src of scripts) {
    const scriptUrl = src.startsWith('http') ? src : new URL(src, url).href;
    console.log('Fetching', scriptUrl);
    try {
      const sRes = await global.fetch(scriptUrl);
      const text = await sRes.text();
      const lower = text.toLowerCase();
      if (lower.includes('hear') || lower.includes('working') || lower.includes('student') || lower.includes('masterclass')) {
        console.log('MATCH in script:', scriptUrl);
        // Look for occurrences of "hear about"
        const index = lower.indexOf('hear');
        if (index !== -1) {
          console.log('Excerpt around hear:', text.substring(Math.max(0, index - 200), index + 500));
        }
        const indexW = lower.indexOf('working');
        if (indexW !== -1) {
          console.log('Excerpt around working:', text.substring(Math.max(0, indexW - 200), indexW + 500));
        }
      }
    } catch (e) {
      console.error('Error fetching', scriptUrl, e.message);
    }
  }
}

main();
