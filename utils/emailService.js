import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Generate OTP
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP email via Brevo REST API
export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: 'Club Management System',
          email: process.env.EMAIL_FROM,
        },
        to: [{ email }],
        subject: 'Email Verification - Club Management',
        htmlContent: `
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:5px">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        `,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Brevo email sent:', response.data.messageId);
    return { success: true };
  } catch (error) {
    console.error('Brevo API email error:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
};
