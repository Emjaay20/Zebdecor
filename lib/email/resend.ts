import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Zebdecor Concierge <onboarding@resend.dev>';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003';

export const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

interface SendPasswordResetParams {
  to: string;
  name?: string;
  resetLink: string;
}

interface SendWelcomeParams {
  to: string;
  name?: string;
}

/**
 * Sends a luxury-branded password reset email via Resend.
 * Falls back to console logging in development if RESEND_API_KEY is not yet configured.
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetLink,
}: SendPasswordResetParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const recipientName = name || 'Valued Collector';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset Your Zebdecor Atelier Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0b09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0b09; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #14110e; border: 1px solid rgba(212, 180, 131, 0.25); border-radius: 12px; overflow: hidden; max-width: 600px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 36px 40px 20px; text-align: center; border-bottom: 1px solid rgba(212, 180, 131, 0.15);">
              <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase; color: #d4b483; font-weight: 600;">ZEBDECOR</span>
              <p style="margin: 6px 0 0; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #a39580;">Bespoke Luxury Interiors &bull; Abuja Atelier</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #ffffff; margin: 0 0 16px; font-weight: 500;">Password Reset Request</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #c4beb5; margin: 0 0 24px;">
                Hello ${recipientName},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #c4beb5; margin: 0 0 24px;">
                We received a request to reset the password for your private Zebdecor Atelier account. Click the button below to establish your new confidential credentials:
              </p>
              
              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #d4b483; color: #0a0807; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 15px 36px; border-radius: 6px; box-shadow: 0 4px 14px rgba(212, 180, 131, 0.35);">
                      Reset Atelier Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; line-height: 1.6; color: #8a8275; margin: 0 0 16px;">
                This secure token will expire in 2 hours. If you did not initiate this request, no action is required and your account remains protected.
              </p>
              <p style="font-size: 11px; color: #6b6459; word-break: break-all; margin: 16px 0 0;">
                Direct link: <a href="${resetLink}" style="color: #d4b483; text-decoration: none;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #0d0b09; border-top: 1px solid rgba(212, 180, 131, 0.1); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #736c61; letter-spacing: 0.05em;">
                &copy; ${new Date().getFullYear()} Zebdecor Atelier. Maitama &bull; Guzape &bull; Abuja, Nigeria.
              </p>
              <p style="margin: 6px 0 0; font-size: 10px; color: #524c44;">
                Private client concierge: concierge@zebdecor.com &bull; +234 800 932 33267
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  if (!resendClient) {
    console.log('\n========================================');
    console.log('[Resend Mock Mode] RESEND_API_KEY is not set.');
    console.log(`[To]: ${to}`);
    console.log(`[Subject]: Reset Your Zebdecor Atelier Password`);
    console.log(`[Reset Link]: ${resetLink}`);
    console.log('========================================\n');
    return { success: true, id: `mock-${Date.now()}` };
  }

  try {
    const data = await resendClient.emails.send({
      from: resendFromEmail,
      to,
      subject: 'Reset Your Zebdecor Atelier Password',
      html,
    });

    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error('[sendPasswordResetEmail] Error sending email via Resend:', error);
    return { success: false, error: error?.message || 'Failed to send reset email' };
  }
}

/**
 * Sends a welcome email upon registration.
 */
export async function sendWelcomeEmail({
  to,
  name,
}: SendWelcomeParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const recipientName = name || 'Valued Collector';

  const html = `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; background-color: #0d0b09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #14110e; border: 1px solid rgba(212, 180, 131, 0.25); border-radius: 12px; padding: 40px; text-align: center;">
          <tr>
            <td>
              <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase; color: #d4b483; font-weight: 600;">ZEBDECOR</span>
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #ffffff; margin: 24px 0 16px;">Welcome to the Atelier, ${recipientName}</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #c4beb5; margin: 0 0 24px;">
                Your private client account is active. You now have privileged access to bespoke commissions, 1:1 Augmented Reality room trials, and white-glove logistics in Abuja and Lagos.
              </p>
              <a href="${siteUrl}/collections" style="display: inline-block; background-color: #d4b483; color: #0a0807; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 6px;">
                Explore Masterpiece Collections
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  if (!resendClient) {
    console.log('\n========================================');
    console.log('[Resend Mock Mode] RESEND_API_KEY is not set.');
    console.log(`[To]: ${to}`);
    console.log(`[Subject]: Welcome to Zebdecor Atelier`);
    console.log('========================================\n');
    return { success: true, id: `mock-${Date.now()}` };
  }

  try {
    const data = await resendClient.emails.send({
      from: resendFromEmail,
      to,
      subject: 'Welcome to Zebdecor Atelier',
      html,
    });

    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error('[sendWelcomeEmail] Error sending welcome email via Resend:', error);
    return { success: false, error: error?.message || 'Failed to send welcome email' };
  }
}
