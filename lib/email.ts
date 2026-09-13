// Email Dispatch Service with Resend, SMTP, and Local Dev Fallback

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const primaryFrom = process.env.EMAIL_FROM || 'SealedVibe <notifications@sealedvibe.in>';
      
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: primaryFrom,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>?/gm, '')
        })
      });

      let data = await res.json();
      
      // If primary sender failed (e.g. unverified domain in Resend), auto-retry with Resend default sandbox sender
      if (!res.ok) {
        console.warn('Primary sender failed, retrying with onboarding@resend.dev fallback... Details:', data);
        res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'SealedVibe <onboarding@resend.dev>',
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>?/gm, '')
          })
        });
        data = await res.json();
      }

      if (!res.ok) {
        console.warn('Resend API dispatch error:', data);
        return { success: false, error: data.message || 'Failed to dispatch email via Resend' };
      }
      console.log('✅ Real email successfully sent via Resend to:', to, '| Message ID:', data.id);
      return { success: true, messageId: data.id };
    }

    // Development fallback logger
    console.log('\n================== [TRANSACTIONAL EMAIL] ==================');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body Preview:', text || html.replace(/<[^>]*>?/gm, '').slice(0, 200));
    console.log('===========================================================\n');

    return { success: true, messageId: 'dev-mock-' + Date.now() };
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return { success: false, error: error.message };
  }
}

export function generatePasswordResetEmail(resetUrl: string, name: string): { subject: string; html: string } {
  return {
    subject: '🔐 Reset your SealedVibe password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #06050e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #06050e; padding: 40px 16px;">
          <tr>
            <td align="center">
              
              <!-- Container Card -->
              <table role="presentation" width="100%" style="max-width: 540px; background: linear-gradient(180deg, #121024 0%, #0a0815 100%); border-radius: 28px; border: 1px solid rgba(245, 158, 11, 0.25); overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);" cellspacing="0" cellpadding="0">
                
                <!-- Glowing Top Gold Accent Bar -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, #f59e0b 0%, #fef08a 50%, #f59e0b 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px 32px 32px 32px; text-align: center;">
                    
                    <!-- Monogram Logo -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 16px auto;">
                      <tr>
                        <td align="center" style="padding: 10px 18px; border-radius: 16px; background-color: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3);">
                          <span style="font-size: 20px; vertical-align: middle;">👑</span>
                          <span style="font-size: 22px; font-weight: 900; color: #fef08a; font-family: Georgia, serif; vertical-align: middle; margin-left: 6px; letter-spacing: 0.5px;">SealedVibe</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Headline -->
                    <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 16px 0 8px 0; font-family: Georgia, serif; font-style: italic;">Set New Password</h1>
                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 28px 0; font-weight: 300;">
                      Hello <strong style="color: #ffffff; font-weight: 600;">${name || 'there'}</strong>, we received a request to securely reset your SealedVibe password.
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 28px auto;">
                      <tr>
                        <td align="center" style="border-radius: 16px; background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%); box-shadow: 0 10px 25px rgba(245, 158, 11, 0.35);">
                          <a href="${resetUrl}" style="display: inline-block; padding: 15px 36px; font-size: 14px; font-weight: 900; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                            Reset Password &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Notice Badge -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 14px 16px; margin-bottom: 24px;">
                      <tr>
                        <td style="color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: left;">
                          <span style="color: #fbbf24; font-weight: bold;">🔒 Security Note:</span> This reset link is active for <strong style="color: #ffffff;">1 hour</strong>. If you didn't request this reset, your account is safe and no changes have been made.
                        </td>
                      </tr>
                    </table>

                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.4;">
                      Button not working? Copy and paste this link into your browser:<br>
                      <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
                    </p>

                  </td>
                </tr>

                <!-- Card Footer -->
                <tr>
                  <td style="padding: 16px 24px; background-color: rgba(0, 0, 0, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                    <p style="color: #64748b; font-size: 11px; margin: 0; font-family: Georgia, serif; font-style: italic;">
                      &copy; ${new Date().getFullYear()} SealedVibe • For the feelings too big for a text message.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}

export function generateWelcomeEmail(name: string, homeUrl: string = 'https://sealedvibe.in'): { subject: string; html: string } {
  const firstName = name ? name.split(' ')[0] : 'there';
  return {
    subject: `✨ Welcome to SealedVibe, ${firstName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #06050e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #06050e; padding: 40px 16px;">
          <tr>
            <td align="center">
              
              <!-- Container Card -->
              <table role="presentation" width="100%" style="max-width: 560px; background: linear-gradient(180deg, #121024 0%, #0a0815 100%); border-radius: 28px; border: 1px solid rgba(245, 158, 11, 0.25); overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);" cellspacing="0" cellpadding="0">
                
                <!-- Glowing Gold Accent Bar -->
                <tr>
                  <td style="height: 4px; background: linear-gradient(90deg, #f59e0b 0%, #fef08a 50%, #f59e0b 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 40px 32px 32px 32px; text-align: center;">
                    
                    <!-- Monogram Logo -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 20px auto;">
                      <tr>
                        <td align="center" style="padding: 10px 20px; border-radius: 18px; background-color: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35);">
                          <span style="font-size: 20px; vertical-align: middle;">👑</span>
                          <span style="font-size: 22px; font-weight: 900; color: #fef08a; font-family: Georgia, serif; vertical-align: middle; margin-left: 6px; letter-spacing: 0.5px;">SealedVibe</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Subtitle Tag -->
                    <div style="display: inline-block; padding: 4px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); color: #fcd34d; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                      ✦ Welcome to the Inner Circle ✦
                    </div>

                    <!-- Headline -->
                    <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 8px 0 14px 0; font-family: Georgia, serif; font-style: italic; line-height: 1.3;">
                      For feelings too deep for a simple message.
                    </h1>
                    
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; font-weight: 300;">
                      Hello <strong style="color: #ffffff; font-weight: 600;">${firstName}</strong>, your account is now ready! You can craft mesmerizing, interactive 3D digital experiences for the people who matter most.
                    </p>

                    <!-- Features Highlight Box -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(0, 0, 0, 0.45); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 20px 20px; margin-bottom: 30px; text-align: left;">
                      <tr>
                        <td style="padding-bottom: 14px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size: 20px; padding-right: 12px; vertical-align: top;">🌌</td>
                              <td style="color: #e2e8f0; font-size: 13px; line-height: 1.5;">
                                <strong style="color: #fef08a;">Cinematic 3D Universes:</strong> Floating compliments, glowing stars, and AI-tailored emotional narratives.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 14px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size: 20px; padding-right: 12px; vertical-align: top;">🎵</td>
                              <td style="color: #e2e8f0; font-size: 13px; line-height: 1.5;">
                                <strong style="color: #fef08a;">Music & Surprises:</strong> Custom background soundtracks, interactive scratch cards, and polaroid reveals.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size: 20px; padding-right: 12px; vertical-align: top;">🔒</td>
                              <td style="color: #e2e8f0; font-size: 13px; line-height: 1.5;">
                                <strong style="color: #fef08a;">100% Private & Permanent:</strong> Passcode protected with live open-tracking alerts.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px auto;">
                      <tr>
                        <td align="center" style="border-radius: 16px; background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%); box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);">
                          <a href="${homeUrl}" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: 900; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 1.2px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                            Explore Showroom & Create &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Social Touchpoint -->
                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">
                      Follow our creations on Instagram: 
                      <a href="https://instagram.com/sealedvibe" style="color: #fbbf24; text-decoration: underline; font-weight: 600;">@sealedvibe</a>
                    </p>

                  </td>
                </tr>

                <!-- Card Footer -->
                <tr>
                  <td style="padding: 18px 24px; background-color: rgba(0, 0, 0, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                    <p style="color: #64748b; font-size: 11px; margin: 0; font-family: Georgia, serif; font-style: italic;">
                      &copy; ${new Date().getFullYear()} SealedVibe • sealedvibe.in
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}
