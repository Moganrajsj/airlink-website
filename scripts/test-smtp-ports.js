const nodemailer = require('nodemailer');

// Test 1: GoDaddy port 587
async function test587() {
  const t = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587,
    secure: false,
    auth: {
      user: 'info@srirambroadband.com',
      pass: 'Airselva@2026#!',
    },
    tls: { rejectUnauthorized: false }
  });
  try {
    await t.verify();
    console.log('✅ GoDaddy port 587 (STARTTLS) WORKS!');
    return t;
  } catch (e) {
    console.log('❌ GoDaddy 587 failed:', e.message);
    return null;
  }
}

// Test 2: GoDaddy port 465 (SSL)
async function test465() {
  const t = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
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
    console.log('✅ GoDaddy port 465 (SSL) WORKS!');
    return t;
  } catch (e) {
    console.log('❌ GoDaddy 465 failed:', e.message);
    return null;
  }
}

// Test 3: GoDaddy port 25
async function test25() {
  const t = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 25,
    secure: false,
    auth: {
      user: 'info@srirambroadband.com',
      pass: 'Airselva@2026#!',
    },
    tls: { rejectUnauthorized: false }
  });
  try {
    await t.verify();
    console.log('✅ GoDaddy port 25 WORKS!');
    return t;
  } catch (e) {
    console.log('❌ GoDaddy 25 failed:', e.message);
    return null;
  }
}

(async () => {
  await test587();
  await test465();
  await test25();
})();
