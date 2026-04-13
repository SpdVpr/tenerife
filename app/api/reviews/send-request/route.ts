import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, markReviewRequestSent } from '@/lib/firebase/bookings';
import { getReviewRequestEmail } from '@/lib/email/reviewTemplates';
import { createEmailTransporter, emailConfig } from '@/lib/email/config';

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Chybí bookingId' },
        { status: 400 }
      );
    }

    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Rezervace nenalezena' },
        { status: 404 }
      );
    }

    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Rezervace není potvrzena' },
        { status: 400 }
      );
    }

    if (booking.paymentStatus === 'unpaid') {
      return NextResponse.json(
        { error: 'Rezervace nemá žádnou platbu' },
        { status: 400 }
      );
    }

    const emailContent = getReviewRequestEmail({
      firstName: booking.firstName,
      lastName: booking.lastName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
    });

    const transporter = createEmailTransporter();
    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: booking.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    await markReviewRequestSent(bookingId);

    console.log('✅ Review request email sent to:', booking.email, info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('❌ Failed to send review request:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se odeslat žádost o recenzi' },
      { status: 500 }
    );
  }
}
