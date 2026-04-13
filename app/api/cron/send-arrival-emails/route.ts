import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { BookingDocument } from '@/lib/firebase/bookings';

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Calculate target date: 2 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const targetDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`🔍 Checking bookings with check-in on: ${targetDateStr}`);

    // Get all confirmed bookings with check-in in 2 days that haven't received the email
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('checkIn', '==', targetDateStr),
      where('status', '==', 'confirmed'),
    );

    const snapshot = await getDocs(q);
    const results: { bookingId: string; email: string; success: boolean; error?: string }[] = [];

    for (const docSnap of snapshot.docs) {
      const booking = { id: docSnap.id, ...docSnap.data() } as BookingDocument;

      // Skip if already sent
      if (booking.arrivalEmailSent) {
        console.log(`⏭️ Arrival email already sent for booking ${booking.bookingNumber}`);
        continue;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cielodorado-tenerife.eu';
        const response = await fetch(`${baseUrl}/api/send-arrival-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking }),
        });

        if (response.ok) {
          results.push({ bookingId: booking.id, email: booking.email, success: true });
          console.log(`✅ Arrival email sent for booking #${booking.bookingNumber} to ${booking.email}`);
        } else {
          const err = await response.json();
          results.push({ bookingId: booking.id, email: booking.email, success: false, error: err.error });
        }
      } catch (err) {
        results.push({
          bookingId: booking.id,
          email: booking.email,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      targetDate: targetDateStr,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
