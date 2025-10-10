import { NextRequest, NextResponse } from 'next/server';
import { getDepositPaidEmail, getFullyPaidEmail } from '@/lib/email/payment-templates';
import { createEmailTransporter } from '@/lib/email/config';
import { emailConfig } from '@/lib/email/config';
import { BookingData } from '@/lib/firebase/bookings';

export async function POST(request: NextRequest) {
  try {
    const { booking, paymentType } = await request.json();

    if (!booking || !booking.id || !booking.bookingNumber) {
      return NextResponse.json(
        { error: 'Missing booking data or booking number' },
        { status: 400 }
      );
    }

    if (!paymentType || !['deposit_paid', 'fully_paid'].includes(paymentType)) {
      return NextResponse.json(
        { error: 'Invalid payment type. Must be "deposit_paid" or "fully_paid"' },
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
    
    // Get appropriate email template based on payment type
    const emailContent = paymentType === 'deposit_paid'
      ? getDepositPaidEmail(booking as BookingData & { id: string; bookingNumber: number })
      : getFullyPaidEmail(booking as BookingData & { id: string; bookingNumber: number });

    // Send payment confirmation email to guest
    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: booking.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log(`✅ Payment email (${paymentType}) sent to guest:`, booking.email);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      paymentType,
    });
  } catch (error) {
    console.error('❌ Failed to send payment email:', error);
    return NextResponse.json(
      { error: 'Failed to send payment email' },
      { status: 500 }
    );
  }
}

