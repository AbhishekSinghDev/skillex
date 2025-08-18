interface LoginEmailTemplateProps {
  firstName?: string;
  email: string;
  otp: string;
}

const LoginEmailTemplate = ({
  firstName,
  email,
  otp,
}: LoginEmailTemplateProps): string => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header -->
      <div style="background-color: #1a1a1a; padding: 32px 24px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 12px; color: #ffffff;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 3h5v5"/>
            <path d="M8 3H3v5"/>
            <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
            <path d="m15 9 6-6"/>
          </svg>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
            Skillex
          </h1>
        </div>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 24px;">
        <!-- Greeting -->
        <h2 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px; margin-top: 0;">
          ${firstName ? `Hello ${firstName}!` : "Hello!"}
        </h2>

        <p style="font-size: 16px; color: #6b7280; margin-bottom: 32px; margin-top: 0;">
          We received a login request for your Skillex account (${email}). Use
          the verification code below to complete your sign-in.
        </p>

        <!-- OTP Code Box -->
        <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #64748b; margin-bottom: 12px; margin-top: 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
            Your Verification Code
          </p>
          <div style="font-size: 36px; font-weight: 800; color: #6366f1; letter-spacing: 8px; font-family: Monaco, Consolas, 'Courier New', monospace;">
            ${otp}
          </div>
        </div>

        <!-- Instructions -->
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
          <h3 style="font-size: 16px; font-weight: 600; color: #92400e; margin-top: 0; margin-bottom: 8px;">
            Important:
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
            <li style="margin-bottom: 4px;">
              This code expires in 10 minutes
            </li>
            <li style="margin-bottom: 4px;">
              Don't share this code with anyone
            </li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>

        <!-- Support -->
        <p style="font-size: 14px; color: #9ca3af; margin-bottom: 0; text-align: center;">
          Need help? Contact our support team at
          <a href="mailto:support@skillex.com" style="color: #6366f1; text-decoration: none;">
            support@skillex.com
          </a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #6b7280; margin: 0; margin-bottom: 8px;">
          © 2024 Skillex. All rights reserved.
        </p>
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          This email was sent to ${email} because you requested a login
          verification code.
        </p>
      </div>
    </div>
  `;
};

export default LoginEmailTemplate;
