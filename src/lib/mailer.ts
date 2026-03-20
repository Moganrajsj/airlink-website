import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

interface LeadData {
  name: string;
  mobile: string;
  email?: string;
  city: string;
  pincode?: string;
  interest?: string;
  source?: string;
}

export async function sendLeadNotification(lead: LeadData) {
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="background: #0A192F; padding: 20px 24px; border-radius: 8px 8px 0 0; margin-bottom: 24px;">
            <h2 style="color: #FBBF24; margin: 0; font-size: 18px;">🔔 New Website Lead — Airlink Broadband</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px; width: 120px;">Name</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Mobile</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${lead.mobile}</td>
            </tr>
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Email</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${lead.email || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Interest</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${lead.interest || '—'}</td>
            </tr>
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Source</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${lead.source || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Submitted At</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${submittedAt} IST</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #FEF3C7; border-radius: 8px; border-left: 4px solid #FBBF24;">
            <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 600;">⚡ Action Required: Contact this lead within 30 minutes for best conversion rates.</p>
          </div>
          <p style="margin-top: 24px; color: #94a3b8; font-size: 12px; text-align: center;">This is an automated notification from the Airlink Broadband website.</p>
        </div>
    `;

  await transporter.sendMail({
    from: `"Airlink Broadband" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_TO || 'info@srirambroadband.com',
    subject: 'New Website Lead – Airlink Broadband',
    html,
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.APP_URL || 'https://www.srirambroadband.com'}/reset-password?token=${resetToken}`;

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A192F; padding: 40px 24px; border-radius: 12px;">
          <h2 style="color: #FBBF24; margin: 0 0 16px;">Reset Your Password</h2>
          <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">You requested a password reset for your Airlink Broadband account. Click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #FBBF24; color: #0A192F; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 14px;">Reset Password</a>
          <p style="color: #94a3b8; font-size: 13px;">This link expires in <strong style="color: #FBBF24;">30 minutes</strong>. If you did not request this, please ignore this email.</p>
          <hr style="border: 1px solid #1e3a5f; margin: 24px 0;" />
          <p style="color: #64748b; font-size: 12px;">Airlink Broadband — Sriram Broadband Services Pvt. Ltd. | <a href="https://www.srirambroadband.com" style="color: #FBBF24;">srirambroadband.com</a></p>
        </div>
    `;

  await transporter.sendMail({
    from: `"Airlink Broadband" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: 'Password Reset — Airlink Broadband',
    html,
  });
}
