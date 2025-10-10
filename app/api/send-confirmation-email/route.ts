import { NextRequest, NextResponse } from 'next/server';
import { getBookingConfirmationEmail } from '@/lib/email/templates';
import { createEmailTransporter } from '@/lib/email/config';
import { emailConfig } from '@/lib/email/config';
import { BookingData } from '@/lib/firebase/bookings';

export async function POST(request: NextRequest) {
  try {
    const { booking } = await request.json();

    if (!booking || !booking.id || !booking.bookingNumber) {
      return NextResponse.json(
        { error: 'Missing booking data or booking number' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      'checkIn', 'checkOut', 'guests', 'firstName', 'lastName',
      'email', 'phone', 'nights', 'totalPrice', 'pricePerNight',
      'bookingNumber',
    ];

    for (const field of requiredFields) {
      if (!booking[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const transporter = createEmailTransporter();
    const emailContent = getBookingConfirmationEmail(
      booking as BookingData & { id: string; bookingNumber: number }
    );

    // Send confirmation email to guest
    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: booking.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log('✅ Confirmation email sent to guest:', booking.email);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}

