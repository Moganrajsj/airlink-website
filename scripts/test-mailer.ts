import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendLeadNotification } from '../src/lib/mailer';

async function test() {
  console.log('Sending test lead notification...');
  try {
    const lead = {
      name: 'Test Setup User',
      mobile: '9876543210',
      email: 'test@example.com',
      city: 'Chennai',
      pincode: '600001',
      interest: 'Home Broadband',
      source: 'test_script'
    };
    await sendLeadNotification(lead);
    console.log('✅ Lead notification email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

test();
