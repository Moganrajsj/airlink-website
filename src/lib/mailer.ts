import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'localhost';

/**
 * Some shared hosts (GoDaddy/cPanel) serve mail on a customer hostname whose
 * TLS certificate is issued for the underlying provider name, e.g.
 * `mail.example.com` presenting a `*.prod.sin2.secureserver.net` certificate.
 * That provider name often has no public DNS, so it cannot be used as the
 * connection host.
 *
 * `SMTP_TLS_SERVERNAME` lets us validate the certificate that is actually
 * served (port + auth unchanged) instead of disabling TLS verification.
 * When unset, nodemailer's default behaviour (validate against SMTP_HOST) wins.
 */
const tlsServername = process.env.SMTP_TLS_SERVERNAME?.trim() || undefined;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
  tls: tlsServername ? { servername: tlsServername } : undefined,
});

export interface LeadNotificationData {
  id?: string;
  name: string;
  mobile: string;
  email?: string | null;
  company?: string | null;
  city: string;
  pincode?: string | null;
  interest?: string | null;
  source?: string | null;
  message?: string | null;
  aiScore?: number | null;
  aiTier?: string | null;
  aiSummary?: string | null;
  aiIntent?: string | null;
  aiRecommendedPlan?: string | null;
  aiNextAction?: string | null;
  aiReasons?: string | null;
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function singleLine(value: unknown): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

/** LEAD_NOTIFY_EMAILS (comma separated) → MAIL_TO → info@srirambroadband.com */
function getRecipients(): string[] {
  const configured = `${process.env.LEAD_NOTIFY_EMAILS || ''},${process.env.MAIL_TO || ''}`;
  const list = configured
    .split(/[,;]/)
    .map((address) => address.trim())
    .filter((address) => address.includes('@'));
  return list.length > 0 ? Array.from(new Set(list)) : ['info@srirambroadband.com'];
}

const TIER_STYLES: Record<string, { label: string; color: string }> = {
  hot: { label: 'HOT', color: '#dc2626' },
  warm: { label: 'WARM', color: '#d97706' },
  cold: { label: 'COLD', color: '#64748b' },
};

/**
 * Builds the notification email. Exported separately from sending so the
 * template can be previewed/tested without delivering mail.
 */
export function buildLeadNotification(lead: LeadNotificationData): {
  subject: string;
  html: string;
  to: string[];
} {
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const score = typeof lead.aiScore === 'number' ? lead.aiScore : null;
  const tier = lead.aiTier || (score !== null ? (score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold') : null);
  const isHot = tier === 'hot';
  const isPopup = lead.source === 'popup_lead';
  const safeName = singleLine(lead.name) || 'Unknown customer';

  const subject = isHot && score !== null
    ? `🔥 Hot lead (${score}/100): ${safeName} — ${singleLine(lead.city) || 'no city'}`
    : score !== null
      ? `🔔 New lead (${score}/100): ${safeName} — ${singleLine(lead.city) || 'no city'}`
      : isPopup
        ? `⚡ New Popup Lead — ${safeName}`
        : `🔔 New Website Lead — ${safeName}`;

  const headerTitle = isHot
    ? '🔥 Hot Lead — Call Now'
    : isPopup
      ? '⚡ New Instant Popup Lead'
      : '🔔 New Website Inquiry';

  const headerBackground = isHot ? '#7f1d1d' : '#0A192F';
  const tierStyle = TIER_STYLES[tier || 'cold'] || TIER_STYLES.cold;

  const digits = String(lead.mobile || '').replace(/\D/g, '');
  const last10 = digits.slice(-10);
  const appUrl = (process.env.APP_URL || 'https://www.srirambroadband.com').replace(/\/+$/, '');
  const leadLink = `${appUrl}/admin/leads?search=${encodeURIComponent(last10 || safeName)}`;

  const booleanRows = (value: string | null | undefined) =>
    value ? escapeHtml(value) : '—';

  const aiBlock = score === null ? '' : `
          <div style="margin-top: 24px; background: #0A192F; border-radius: 8px; padding: 20px; color: #e2e8f0;">
            <div style="margin-bottom: 12px;">
              <span style="display: inline-block; background: ${tierStyle.color}; color: #ffffff; font-size: 10px; font-weight: bold; letter-spacing: 1px; padding: 4px 10px; border-radius: 999px;">${tierStyle.label} ${score}/100</span>
              <span style="color: #94a3b8; font-size: 11px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">AI lead intelligence</span>
            </div>
            ${lead.aiSummary ? `<p style="margin: 0 0 14px; font-size: 14px; line-height: 1.5; color: #ffffff;">${escapeHtml(lead.aiSummary)}</p>` : ''}
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              ${lead.aiIntent ? `<tr><td style="padding: 5px 0; color: #94a3b8; width: 130px;">Intent</td><td style="padding: 5px 0; color: #e2e8f0;">${escapeHtml(lead.aiIntent.replace(/_/g, ' '))}</td></tr>` : ''}
              ${lead.aiRecommendedPlan ? `<tr><td style="padding: 5px 0; color: #94a3b8;">Recommended plan</td><td style="padding: 5px 0; color: #FBBF24; font-weight: bold;">${escapeHtml(lead.aiRecommendedPlan)}</td></tr>` : ''}
              ${lead.aiNextAction ? `<tr><td style="padding: 5px 0; color: #94a3b8;">Next action</td><td style="padding: 5px 0; color: #e2e8f0;">${escapeHtml(lead.aiNextAction)}</td></tr>` : ''}
            </table>
            ${lead.aiReasons ? `<p style="margin: 12px 0 0; font-size: 11px; line-height: 1.5; color: #64748b;">Why this score: ${escapeHtml(lead.aiReasons)}</p>` : ''}
          </div>`;

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="background: ${headerBackground}; padding: 20px 24px; border-radius: 8px 8px 0 0; margin-bottom: 24px;">
            <h2 style="color: #FBBF24; margin: 0; font-size: 18px;">${headerTitle}</h2>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">Airlink Broadband Network</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px; width: 120px;">Name</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px; font-weight: 600;">${escapeHtml(safeName)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Mobile</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px; font-weight: 600;">${escapeHtml(last10 || lead.mobile)}</td>
            </tr>
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Email</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${booleanRows(lead.email)}</td>
            </tr>
            ${lead.company ? `
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Company</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${escapeHtml(lead.company)}</td>
            </tr>` : ''}
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Interest</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${booleanRows(lead.interest)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">City/Area</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${booleanRows(lead.city)}</td>
            </tr>
            ${lead.pincode ? `
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Pincode</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${escapeHtml(lead.pincode)}</td>
            </tr>
            ` : ''}
            <tr style="background: ${lead.pincode ? 'white' : '#f1f5f9'}">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Source</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px; text-transform: capitalize;">${escapeHtml((lead.source || 'contact_form').replace(/_/g, ' '))}</td>
            </tr>
            ${lead.message ? `
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(lead.message)}</td>
            </tr>` : ''}
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: bold; color: #0A192F; font-size: 13px;">Submitted At</td>
              <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${escapeHtml(submittedAt)} IST</td>
            </tr>
          </table>
          ${aiBlock}
          <div style="margin-top: 24px; text-align: center;">
            ${last10 ? `<a href="tel:+91${escapeHtml(last10)}" style="display: inline-block; margin: 0 4px 8px; padding: 12px 22px; background: #0A192F; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">📞 Call ${escapeHtml(last10)}</a>` : ''}
            ${last10 ? `<a href="https://wa.me/91${escapeHtml(last10)}" style="display: inline-block; margin: 0 4px 8px; padding: 12px 22px; background: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">💬 WhatsApp</a>` : ''}
            <a href="${escapeHtml(leadLink)}" style="display: inline-block; margin: 0 4px 8px; padding: 12px 22px; background: #FBBF24; color: #0A192F; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">Open in admin</a>
          </div>
          <div style="margin-top: 20px; padding: 16px; background: #FEF3C7; border-radius: 8px; border-left: 4px solid #FBBF24;">
            <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 600;">⚡ Action Required: Contact this lead within 30 minutes for best conversion rates.</p>
          </div>
          <p style="margin-top: 24px; color: #94a3b8; font-size: 12px; text-align: center;">This is an automated notification from the Airlink Broadband website.</p>
        </div>
    `;

  return { subject, html, to: getRecipients() };
}

/** Sends the notification built by buildLeadNotification. */
export async function sendLeadNotification(lead: LeadNotificationData) {
  const { subject, html, to } = buildLeadNotification(lead);
  await transporter.sendMail({
    from: `"Airlink Broadband" <${process.env.MAIL_FROM || 'info@srirambroadband.com'}>`,
    to,
    subject,
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
    from: `"Airlink Broadband" <${process.env.MAIL_FROM || 'info@srirambroadband.com'}>`,
    to: email,
    subject: 'Password Reset — Airlink Broadband',
    html,
  });
}
