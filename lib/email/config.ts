import nodemailer from 'nodemailer';

// Email configuration
export const emailConfig = {
  from: {
    name: 'Cielo Dorado Tenerife',
    email: process.env.SMTP_FROM_EMAIL || 'info@cielodorado-tenerife.eu',
  },
  notificationEmail: process.env.NOTIFICATION_EMAIL || 'info@cielodorado-tenerife.eu',
};

// Create reusable transporter
export function createEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.vedos.cz',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'info@cielodorado-tenerife.eu',
      pass: process.env.SMTP_PASSWORD || '',
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server verification failed:', error);
    return false;
  }
}

