import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // smtp-relay.brevo.com
  port: Number(process.env.EMAIL_PORT), // 587
  secure: false, // MUST be false for 587
  auth: {
    user: process.env.EMAIL_USER, // apikey
    pass: process.env.EMAIL_PASSWORD // Brevo SMTP key
  }
});

// Optional: verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Brevo SMTP connection failed:', error);
  } else {
    console.log('Brevo SMTP ready to send emails');
  }
});

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Club Management System" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Email Verification - Club Management',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Club Management System</h1>
    </div>
    <div class="content">
      <h2>Email Verification</h2>
      <p>Please use the following OTP to verify your email address:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p><strong>This OTP will expire in 10 minutes.</strong></p>
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2025 Club Management System</p>
    </div>
  </div>
</body>
</html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Brevo email error:', error);
    throw new Error('Failed to send email');
  }
};
