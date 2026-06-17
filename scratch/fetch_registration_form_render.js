const fs = require('fs');

async function main() {
  const url = 'https://masterclass.analytixlabs.co.in/_next/static/chunks/0wnmygeshnk8x.js?dpl=dpl_Hh5u7XNLAzdnV5t4j6qrQ1rRWQFf';
  const res = await global.fetch(url);
  const text = await res.text();
  
  // Find where RegistrationForm is defined and search for JSX rendering
  const index = text.indexOf('RegistrationForm');
  if (index !== -1) {
    console.log('--- RegistrationForm render excerpt ---');
    // search for return( or return (
    const returnIndex = text.indexOf('return(', index);
    if (returnIndex !== -1) {
      console.log(text.substring(returnIndex, returnIndex + 3000));
    }
  }
}

main();
