import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // Sanitize environment variables (remove surrounding quotes if present)
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/"/g, '').trim() : '';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/"/g, '').trim() : '';
  
  console.log('Creating email transporter with user:', user);
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass
    },
    // Cloud provider fixes
    connectionTimeout: 10000, // 10 seconds
    socketTimeout: 15000, // 15 seconds
    greetingTimeout: 10000,
    dnsTimeout: 5000,
    // Force IPv4 to avoid IPv6 issues on cloud providers
    family: 4
  });
};

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email for password reset
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} username - User's username
 * @returns {Promise<boolean>} Success status
 */
export const sendOtpEmail = async (email, otp, username = 'User') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Nova AI <noreply@novaai.com>',
      to: email,
      subject: '🔐 Nova AI - Password Reset OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="500" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid #334155; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="margin: 0; font-size: 28px; background: linear-gradient(90deg, #22d3ee, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Nova AI</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 16px; color: #f1f5f9; font-size: 22px; font-weight: 600;">Password Reset Request</h2>
                      <p style="margin: 0 0 24px; color: #94a3b8; font-size: 16px; line-height: 1.6;">
                        Hi ${username},<br><br>
                        We received a request to reset your password. Use the OTP below to proceed:
                      </p>
                      
                      <!-- OTP Box -->
                      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${otp}</span>
                      </div>
                      
                      <p style="margin: 24px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        ⏰ This OTP is valid for <strong style="color: #22d3ee;">10 minutes</strong>.<br><br>
                        If you didn't request this, please ignore this email or contact support if you have concerns.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #334155; margin-top: 20px;">
                      <p style="margin: 0; color: #64748b; font-size: 12px;">
                        © ${new Date().getFullYear()} Nova AI. All rights reserved.
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

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    console.error('Full error:', error);
    throw new Error('Failed to send OTP email: ' + error.message);
  }
};

export default { generateOtp, sendOtpEmail };
