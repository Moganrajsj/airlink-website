const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Basic .env loader
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
      process.env[key.trim()] = value;
    }
  });
}

console.log('Testing SMTP Connection with settings:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Pass Length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);
console.log('Pass Start:', process.env.SMTP_PASS ? process.env.SMTP_PASS[0] : 'N/A');
console.log('Pass End:', process.env.SMTP_PASS ? process.env.SMTP_PASS[process.env.SMTP_PASS.length-1] : 'N/A');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function runTest() {
  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection is WORKING!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Airlink Test" <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: 'SMTP Diagnostic Test – Airlink Broadband',
      text: 'This is a test email to verify that the SMTP configuration is working correctly.',
      html: '<b>This is a test email to verify that the SMTP configuration is working correctly.</b>',
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Test FAILED:');
    console.error(error);
  }
}

runTest();
