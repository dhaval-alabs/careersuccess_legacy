const fs = require('fs');

async function main() {
  const url = 'https://masterclass.analytixlabs.co.in/_next/static/chunks/0wnmygeshnk8x.js?dpl=dpl_Hh5u7XNLAzdnV5t4j6qrQ1rRWQFf';
  const res = await global.fetch(url);
  const text = await res.text();
  
  const index = text.indexOf('RegistrationForm');
  if (index !== -1) {
    const chunk = text.substring(index, index + 15000);
    // Find all JSX returns or conditions inside RegistrationForm
    console.log('--- Inside RegistrationForm ---');
    
    // Let's find conditions like: if (ee) or if (er) or similar state variables
    // E.g., Q, ee, en, ea, etc.
    // Let's see what these states do:
    // [Q, X] = useState(false)
    // [ee, et] = useState(false)
    // [en, er] = useState(false)
    // [ea, ei] = useState(false)
    
    // Let's search for "otpStep" or "chatStep" or similar tags or returns
    const lastReturn = chunk.lastIndexOf('return');
    console.log('Last return from RegistrationForm:');
    console.log(chunk.substring(lastReturn - 500, lastReturn + 1500));
  }
}

main();
