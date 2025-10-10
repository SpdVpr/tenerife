import { createEmailTransporter, emailConfig } from './config';
import { getGuestConfirmationEmail, getOwnerNotificationEmail } from './templates';
import { BookingData } from '@/lib/firebase/bookings';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send booking confirmation email to guest
 */
export async function sendGuestConfirmationEmail(
  booking: BookingData & { id: string; bookingNumber: number }
): Promise<SendEmailResult> {
  try {
    const transporter = createEmailTransporter();
    const emailContent = getGuestConfirmationEmail(booking);

    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: booking.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log('✅ Guest confirmation email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Failed to send guest confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send booking notification email to owner
 */
export async function sendOwnerNotificationEmail(
  booking: BookingData & { id: string; bookingNumber: number }
): Promise<SendEmailResult> {
  try {
    const transporter = createEmailTransporter();
    const emailContent = getOwnerNotificationEmail(booking);

    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: emailConfig.notificationEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log('✅ Owner notification email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Failed to send owner notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send both guest confirmation and owner notification emails
 */
export async function sendBookingEmails(
  booking: BookingData & { id: string; bookingNumber: number }
): Promise<{
  guestEmail: SendEmailResult;
  ownerEmail: SendEmailResult;
}> {
  // Send both emails in parallel
  const [guestEmail, ownerEmail] = await Promise.all([
    sendGuestConfirmationEmail(booking),
    sendOwnerNotificationEmail(booking),
  ]);

  return {
    guestEmail,
    ownerEmail,
  };
}

