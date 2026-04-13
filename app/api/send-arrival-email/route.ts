import { NextRequest, NextResponse } from 'next/server';
import { getArrivalInfoEmail } from '@/lib/email/payment-templates';
import { createEmailTransporter, emailConfig } from '@/lib/email/config';
import { BookingData } from '@/lib/firebase/bookings';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { booking } = await request.json();

    if (!booking || !booking.id || !booking.bookingNumber) {
      return NextResponse.json(
        { error: 'Missing booking data' },
        { status: 400 }
      );
    }

    const requiredFields = [
      'checkIn', 'checkOut', 'guests', 'firstName', 'lastName',
      'email', 'phone', 'nights', 'totalPrice', 'pricePerNight', 'bookingNumber',
    ];

    for (const field of requiredFields) {
      if (!booking[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const emailContent = getArrivalInfoEmail(
      booking as BookingData & { id: string; bookingNumber: number }
    );

    const transporter = createEmailTransporter();
    const imagesDir = path.join(process.cwd(), 'public', 'images');

    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: booking.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
      attachments: [
        {
          filename: 'tenerife1.jpeg',
          path: path.join(imagesDir, 'tenerife1.jpeg'),
          cid: 'keybox',
        },
        {
          filename: 'tenerife2.jpeg',
          path: path.join(imagesDir, 'tenerife2.jpeg'),
          cid: 'door',
        },
      ],
    });

    // Mark arrival email as sent in Firebase (non-fatal if booking doesn't exist)
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, { arrivalEmailSent: true });
    } catch (fbError) {
      console.warn('⚠️ Could not update arrivalEmailSent in Firebase:', fbError);
    }

    console.log(`✅ Arrival info email sent to: ${booking.email}`);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Failed to send arrival email:', error);
    return NextResponse.json(
      { error: 'Failed to send arrival email' },
      { status: 500 }
    );
  }
}
