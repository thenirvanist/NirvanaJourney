import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'The Nirvanist <noreply@thenirvanist.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://thenirvanist.com';

if (!RESEND_API_KEY) {
  console.warn('Warning: RESEND_API_KEY is not set. Email functionality will not work.');
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const emailService = {
  async sendNewsletterConfirmation(email: string, token: string): Promise<boolean> {
    const confirmUrl = `${FRONTEND_URL}/confirm-newsletter?token=${token}`;

    if (!resend) {
      console.error('Resend client not initialized - RESEND_API_KEY is missing');
      return false;
    }

    console.log('Sending newsletter confirmation email to:', email);
    console.log('Confirmation URL:', confirmUrl);

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Welcome to The Nirvanist! Please Confirm Your Subscription',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #70c92e, #4f8638); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to The Nirvanist!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Spiritual Insights & Sacred Journeys</p>
            </div>
            
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #253e1a; margin-bottom: 20px;">Confirm Your Subscription</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Thank you for subscribing to The Nirvanist newsletter! Please click the button below to confirm your subscription and start receiving spiritual insights, journey updates, and exclusive content.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${confirmUrl}" style="background: #70c92e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Confirm Subscription
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                If you didn't subscribe to our newsletter, you can safely ignore this email.
              </p>
              
              <p style="color: #999; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmUrl}" style="color: #70c92e;">${confirmUrl}</a>
              </p>
            </div>
            
            <div style="background: #f7f2e8; padding: 20px 30px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2025 The Nirvanist. Connecting souls with sacred journeys.
              </p>
            </div>
          </div>
        `,
      });
      console.log('Newsletter confirmation email sent successfully:', result);
      return true;
    } catch (error: any) {
      console.error('Failed to send newsletter confirmation email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  },

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    if (!resend) {
      console.error('Resend client not initialized - RESEND_API_KEY is missing');
      return false;
    }
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify Your Email - The Nirvanist',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #70c92e, #4f8638); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to The Nirvanist</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your spiritual journey begins here</p>
            </div>
            
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #253e1a; margin-bottom: 20px;">Verify Your Email Address</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Thank you for joining The Nirvanist community! Please click the button below to verify your email address and complete your registration.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" style="background: #70c92e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                If you didn't create an account with The Nirvanist, you can safely ignore this email.
              </p>
              
              <p style="color: #999; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #70c92e;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="background: #f7f2e8; padding: 20px 30px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2025 The Nirvanist. Connecting souls with sacred journeys.
              </p>
            </div>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  },

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    if (!resend) {
      console.error('Resend client not initialized - RESEND_API_KEY is missing');
      return false;
    }
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset Your Password - The Nirvanist',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #70c92e, #4f8638); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">The Nirvanist</p>
            </div>
            
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #253e1a; margin-bottom: 20px;">Reset Your Password</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" style="background: #70c92e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              
              <p style="color: #999; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #70c92e;">${resetUrl}</a>
              </p>
            </div>
            
            <div style="background: #f7f2e8; padding: 20px 30px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2025 The Nirvanist. Connecting souls with sacred journeys.
              </p>
            </div>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  },
};
