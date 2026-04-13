import { NextResponse } from 'next/server';
import { getAllBookings, markReviewRequestSent } from '@/lib/firebase/bookings';
import { getReviewRequestEmail } from '@/lib/email/reviewTemplates';
import { createEmailTransporter, emailConfig } from '@/lib/email/config';
import { getReviewSettings } from '@/lib/firebase/reviews';

export async function POST() {
  try {
    const [allBookings, settings] = await Promise.all([
      getAllBookings(),
      getReviewSettings(),
    ]);

    const { autoEmailDays } = settings;

    // Calculate the target checkout date based on configured days
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - autoEmailDays);
    const threeDaysAgoStr = targetDate.toISOString().split('T')[0];

    // Filter qualifying bookings
    const qualifying = allBookings.filter((booking) => {
      return (
        booking.checkOut === threeDaysAgoStr &&
        booking.status === 'confirmed' &&
        booking.paymentStatus !== 'unpaid' &&
        !booking.reviewRequestSent
      );
    });

    if (qualifying.length === 0) {
      return NextResponse.json({ success: true, sent: 0, skipped: allBookings.length });
    }

    const transporter = createEmailTransporter();
    let sent = 0;

    for (const booking of qualifying) {
      try {
        const emailContent = getReviewRequestEmail({
          firstName: booking.firstName,
          lastName: booking.lastName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
        });

        await transporter.sendMail({
          from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
          to: booking.email,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        });

        await markReviewRequestSent(booking.id);
        sent++;
        console.log('✅ Auto review request sent to:', booking.email);
      } catch (emailError) {
        console.error('❌ Failed to send review request for booking:', booking.id, emailError);
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      skipped: allBookings.length - qualifying.length,
    });
  } catch (error) {
    console.error('❌ Failed to process pending review requests:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování žádostí o recenzi' },
      { status: 500 }
    );
  }
}
