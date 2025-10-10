import { NextResponse } from 'next/server';
import { verifyEmailConfig, createEmailTransporter, emailConfig } from '@/lib/email/config';

export async function GET() {
  try {
    // Check if all required environment variables are set
    const requiredEnvVars = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASSWORD',
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing environment variables',
          missingVars,
          message: 'Please set all required SMTP environment variables in .env.local',
        },
        { status: 500 }
      );
    }

    // Verify email configuration
    const isValid = await verifyEmailConfig();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email configuration verification failed',
          message: 'Please check your SMTP credentials',
        },
        { status: 500 }
      );
    }

    // Send test email
    const transporter = createEmailTransporter();
    const testEmail = emailConfig.notificationEmail;

    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: testEmail,
      subject: '✅ Test Email - Cielo Dorado Email System',
      text: 'This is a test email from your Cielo Dorado booking system. If you received this, your email configuration is working correctly!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .content {
              background: #f9fafb;
              padding: 20px;
              border-radius: 10px;
              border: 1px solid #e5e7eb;
            }
            .success {
              background: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info {
              background: #dbeafe;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Email Test Successful!</h1>
            <p>Cielo Dorado Booking System</p>
          </div>
          <div class="content">
            <div class="success">
              <h2 style="margin-top: 0;">🎉 Congratulations!</h2>
              <p>Your email system is configured correctly and working as expected.</p>
            </div>
            <div class="info">
              <h3 style="margin-top: 0;">Configuration Details:</h3>
              <ul>
                <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
                <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</li>
                <li><strong>From Email:</strong> ${emailConfig.from.email}</li>
                <li><strong>Notification Email:</strong> ${emailConfig.notificationEmail}</li>
              </ul>
            </div>
            <p>Your booking system is now ready to send confirmation emails to guests and notifications to you when new bookings are made.</p>
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              This is an automated test email sent at ${new Date().toLocaleString('cs-CZ')}.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email configuration is valid and test email sent successfully',
      messageId: info.messageId,
      testEmailSentTo: testEmail,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        fromEmail: emailConfig.from.email,
        notificationEmail: emailConfig.notificationEmail,
      },
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Please check your SMTP configuration and credentials',
      },
      { status: 500 }
    );
  }
}

