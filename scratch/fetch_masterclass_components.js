const fs = require('fs');

async function main() {
  const url = 'https://masterclass.analytixlabs.co.in/_next/static/chunks/0wnmygeshnk8x.js?dpl=dpl_Hh5u7XNLAzdnV5t4j6qrQ1rRWQFf';
  const res = await global.fetch(url);
  const text = await res.text();
  
  // Find where E({registrationId: is defined
  const indexE = text.indexOf('function E({');
  if (indexE !== -1) {
    console.log('--- E Component (Chat window?) ---');
    console.log(text.substring(indexE, indexE + 2000));
  }
  
  // Find where copy:a= is defined
  const indexCopy = text.indexOf('copy:a={');
  if (indexCopy !== -1) {
    console.log('--- Initial Form / Wrapper Component ---');
    console.log(text.substring(indexCopy - 100, indexCopy + 1500));
  }
}

main();
