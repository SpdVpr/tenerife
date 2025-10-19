import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { generateICalContent, bookingToICalEvent } from '@/lib/ical';

interface BookingData {
  id: string;
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  status: string;
  source?: string;
  createdAt?: { toDate?: () => Date };
  [key: string]: unknown;
}

/**
 * GET /api/ical/export
 * 
 * Exports all confirmed bookings as an iCal (.ics) calendar feed
 * This URL can be added to Booking.com for calendar synchronization
 * 
 * Usage:
 * 1. Copy this URL: https://your-domain.com/api/ical/export
 * 2. In Booking.com extranet, go to Calendar > Calendar sync
 * 3. Paste the URL to import your bookings to Booking.com
 */
export async function GET() {
  try {
    console.log('📅 iCal Export: Fetching confirmed bookings from Firebase...');
    
    // Fetch all confirmed bookings
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('status', '==', 'confirmed')
    );

    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings: BookingData[] = bookingsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as BookingData;
    });

    console.log(`📅 iCal Export: Found ${bookings.length} confirmed bookings`);

    // Filter out bookings that came from external sources (to avoid circular sync)
    const webBookings = bookings.filter((booking) => {
      // Only export bookings from web or without source
      return !booking.source || booking.source === 'web';
    });

    console.log(`📅 iCal Export: Exporting ${webBookings.length} web bookings (excluding external)`);

    // Convert bookings to iCal events
    const events = webBookings.map((booking) =>
      bookingToICalEvent({
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        firstName: booking.firstName,
        lastName: booking.lastName,
        status: booking.status,
        createdAt: booking.createdAt?.toDate?.() || new Date(),
      })
    );

    // Generate iCal content
    const icalContent = generateICalContent(events);

    console.log(`✅ iCal Export: Generated calendar with ${events.length} events`);

    // Return as .ics file
    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="cielo-dorado-calendar.ics"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('❌ iCal Export error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Chyba při exportu kalendáře',
        details: error instanceof Error ? error.message : 'Neznámá chyba',
      },
      { status: 500 }
    );
  }
}

