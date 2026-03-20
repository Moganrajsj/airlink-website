const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true, 
  auth: {
    user: 'info@srirambroadband.com',
    pass: 'Airselva@2026#!',
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function runTest() {
  try {
    console.log('Testing Titan SMTP...');
    await transporter.verify();
    console.log('✅ Titan SMTP is WORKING!');
  } catch (error) {
    console.error('❌ Titan SMTP FAILED:');
    console.error(error);
  }
}

runTest();
