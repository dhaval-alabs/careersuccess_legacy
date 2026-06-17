const fs = require('fs');

async function main() {
  const url = 'https://masterclass.analytixlabs.co.in/_next/static/chunks/0wnmygeshnk8x.js?dpl=dpl_Hh5u7XNLAzdnV5t4j6qrQ1rRWQFf';
  const res = await global.fetch(url);
  const text = await res.text();
  
  // Find where C=[ is defined
  const indexC = text.indexOf('C=["Quick one');
  if (indexC !== -1) {
    console.log('--- Questions and Options ---');
    console.log(text.substring(indexC, indexC + 1500));
  } else {
    console.log('Not found C=[');
  }
}

main();
