const nodemailer = require('nodemailer');

// Test using mail.srirambroadband.com (GoDaddy cPanel webmail)
async function testCpanel() {
  const t = nodemailer.createTransport({
    host: 'mail.srirambroadband.com',
    port: 465,
    secure: true,
    auth: {
      user: 'info@srirambroadband.com',
      pass: 'Airselva@2026#!',
    },
    tls: { rejectUnauthorized: false }
  });
  try {
    await t.verify();
    console.log('✅ mail.srirambroadband.com port 465 WORKS!');
    return true;
  } catch (e) {
    console.log('❌ port 465 failed:', e.message);
  }

  // Try port 587
  const t2 = nodemailer.createTransport({
    host: 'mail.srirambroadband.com',
    port: 587,
    secure: false,
    auth: {
      user: 'info@srirambroadband.com',
      pass: 'Airselva@2026#!',
    },
    tls: { rejectUnauthorized: false }
  });
  try {
    await t2.verify();
    console.log('✅ mail.srirambroadband.com port 587 WORKS!');
    return true;
  } catch (e) {
    console.log('❌ port 587 failed:', e.message);
  }

  return false;
}

(async () => {
  await testCpanel();
  process.exit(0);
})();
