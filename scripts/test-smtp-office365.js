const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'info@srirambroadband.com',
    pass: 'Airselva@2026#!',
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

async function runTest() {
  try {
    console.log('Testing Office 365 SMTP...');
    await transporter.verify();
    console.log('✅ Office 365 SMTP is WORKING!');
    
    await transporter.sendMail({
      from: '"Airlink Test" <info@srirambroadband.com>',
      to: 'sales@srirambroadband.com',
      subject: 'SMTP Diagnostic Test (Office 365)',
      text: 'Working!',
    });
    console.log('✅ Test email sent!');
  } catch (error) {
    console.error('❌ Office 365 SMTP FAILED:');
    console.error(error);
  }
}

runTest();
