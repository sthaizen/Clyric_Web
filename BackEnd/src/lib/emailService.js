import nodemailer from "nodemailer";
import { ENV } from "./env.js";

/**
 * emailService.js
 *
 * SMTP-based email utility for the admin authentication system.
 * All secrets come from environment variables — never hardcoded.
 * This service is ONLY used for admin auth flows.
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465, // true for port 465 (SSL), false for 587 (TLS)
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
    tls: {
      // Do not fail on self-signed certs in development
      rejectUnauthorized: ENV.NODE_ENV === "production",
    },
  });
};

/**
 * Base send helper — all email functions use this.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Clyric Admin System" <${ENV.SMTP_FROM}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${subject} (ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}:`, error.message);
    // Do not throw — email failure should not crash the request.
    // The caller can check the return value.
    return false;
  }
};

// ─── Email Templates (Modern Monochromatic Theme) ───────────

const templateOuterStart = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; padding: 60px 20px; margin: 0; text-align: center;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; text-align: left;">
    <tr>
      <td style="height: 4px; background: linear-gradient(90deg, #52525b, #d4d4d8); width: 100%;"></td>
    </tr>
    <tr>
      <td style="padding: 40px 40px 32px;">`;

const templateOuterEnd = `      </td>
    </tr>
  </table>
  <div style="margin-top: 24px; text-align: center;">
     <p style="font-size: 11px; color: #52525b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">&copy; ${new Date().getFullYear()} Clyric Admin System. All rights reserved.</p>
  </div>
</div>`;

const getBrandHeader = (label) => `
        <div style="margin-bottom: 24px;">
          <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-right: 12px; vertical-align: middle;">CLYRIC</span>
          <span style="display: inline-block; background-color: #18181b; border: 1px solid #27272a; border-radius: 999px; padding: 4px 10px; font-size: 10px; font-weight: 600; color: #a1a1aa; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: middle;">${label}</span>
        </div>`;

/**
 * Send OTP verification code to a new admin applicant.
 */
export const sendVerificationEmail = async (email, code, name) => {
  return sendEmail({
    to: email,
    subject: "Clyric Admin — Verify Your Email",
    html: `${templateOuterStart}${getBrandHeader('Verification')}
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Verify your identity</h1>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Hi <strong style="color: #ffffff; font-weight: 500;">${name}</strong>,<br><br>
          We received your request for admin access. To proceed, please verify your email address by entering the temporary authorization code below.
        </p>
        <div style="background: #000000; border: 1px dashed #3f3f46; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
          <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 500; color: #ffffff; letter-spacing: 12px; margin-left: 12px;">${code}</span>
        </div>
        <p style="margin: 0 0 12px; font-size: 14px; color: #a1a1aa;">
          <strong style="color: #ffffff; font-weight: 500;">Notice:</strong> This code securely expires in 15 minutes.
        </p>
        <p style="margin: 0 0 32px; font-size: 14px; color: #a1a1aa;">
          Upon successful verification, your application will be routed to the master administrator for final approval.
        </p>
        <div style="border-top: 1px solid #27272a; padding-top: 24px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #71717a;">
            If you did not initiate this request, you may securely ignore this message. No action is required.
          </p>
        </div>
${templateOuterEnd}`,
  });
};

/**
 * Send approval notification to an approved admin.
 */
export const sendApprovalEmail = async (email, name) => {
  return sendEmail({
    to: email,
    subject: "Clyric Admin — Your Access Has Been Approved",
    html: `${templateOuterStart}${getBrandHeader('Access Granted')}
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Welcome to the Platform</h1>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Hi <strong style="color: #ffffff; font-weight: 500;">${name}</strong>,<br><br>
          Your request for administrative access has been successfully reviewed and approved by the master administrator.
        </p>
        <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Your credentials are now active. You may log in to the Clyric Admin Portal to begin managing the platform.
        </p>
        <div style="margin: 32px 0;">
          <a href="${ENV.CLIENT_URL}/admin/login" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 6px;">
            Sign in to Portal
          </a>
        </div>
        <div style="border-top: 1px solid #27272a; padding-top: 24px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #71717a;">
            As an administrator, please ensure you use strong operational security and keep your credentials private at all times.
          </p>
        </div>
${templateOuterEnd}`,
  });
};

/**
 * Send rejection notification to a rejected applicant.
 */
export const sendRejectionEmail = async (email, name, reason = "") => {
  return sendEmail({
    to: email,
    subject: "Clyric Admin — Access Request Update",
    html: `${templateOuterStart}${getBrandHeader('Status Update')}
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Request Unsuccessful</h1>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Hi <strong style="color: #ffffff; font-weight: 500;">${name}</strong>,<br><br>
          We have carefully reviewed your request for administrative access. After evaluation, we are unable to grant you access to the platform at this time.
        </p>
        ${reason ? `
        <div style="background: #18181b; border-left: 3px solid #52525b; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; color: #d4d4d8; text-transform: uppercase; letter-spacing: 0.5px;">Administrator Note</p>
          <p style="margin: 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">${reason}</p>
        </div>
        ` : ""}
        <div style="border-top: 1px solid #27272a; padding-top: 24px; margin-top: 32px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #71717a;">
            If you believe this decision requires further context or was made in error, please interface directly with your platform administrator.
          </p>
        </div>
${templateOuterEnd}`,
  });
};

/**
 * Send password reset email with a secure token link.
 */
export const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${ENV.CLIENT_URL}/admin/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: "Clyric Admin — Password Reset Request",
    html: `${templateOuterStart}${getBrandHeader('Security')}
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Reset your password</h1>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Hi <strong style="color: #ffffff; font-weight: 500;">${name}</strong>,<br><br>
          We received a security request to reset the password associated with your Clyric administrator account.
        </p>
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 6px;">
            Set New Password
          </a>
        </div>
        <p style="margin: 0 0 32px; font-size: 14px; color: #a1a1aa;">
          This secure link is uniquely tied to your session and will automatically expire in <strong style="color: #ffffff; font-weight: 500;">1 hour</strong>.
        </p>
        <div style="border-top: 1px solid #27272a; padding-top: 24px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #71717a;">
            If you did not initiate a password reset, you may safely ignore this email. Your system access remains securely protected.
          </p>
        </div>
${templateOuterEnd}`,
  });
};

/**
 * Send welcome email after a new admin successfully logs in for the first time.
 */
export const sendWelcomeEmail = async (email, name) => {
  return sendEmail({
    to: email,
    subject: "Welcome to the Clyric Admin Portal",
    html: `${templateOuterStart}${getBrandHeader('Portal Ready')}
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">System Active</h1>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Welcome aboard, <strong style="color: #ffffff; font-weight: 500;">${name}</strong>.<br><br>
          Your administrative account is fully operational. You now possess authoritative access to oversee platform operations, review internal states, and enact system modifications.
        </p>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">
            <strong style="color: #ffffff; font-weight: 500;">Security Directive:</strong> We strongly advise concluding active sessions upon completion of your work, particularly when operating on shared networks.
          </p>
        </div>
${templateOuterEnd}`,
  });
};