import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { parseICalContent } from '@/lib/ical';

/**
 * POST /api/ical/import
 * 
 * Imports bookings from an external iCal calendar URL (e.g., Booking.com)
 * Creates blocked dates in Firebase for each booking found in the iCal feed
 * 
 * Request body:
 * {
 *   "icalUrl": "https://admin.booking.com/hotel/hoteladmin/ical.html?t=..."
 * }
 * 
 * Usage:
 * 1. Get your iCal export URL from Booking.com extranet
 * 2. Call this endpoint with the URL to import bookings
 * 3. Set up a cron job to call this regularly (every 30-60 minutes)
 */
export async function POST(request: Request) {
  try {
    const { icalUrl } = await request.json();

    if (!icalUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'iCal URL je povinná',
        },
        { status: 400 }
      );
    }

    console.log('📥 iCal Import: Fetching calendar from:', icalUrl.substring(0, 50) + '...');

    // Fetch iCal content from URL
    const response = await fetch(icalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Cielo-Dorado-Calendar-Sync/1.0)',
        'Accept': 'text/calendar, text/plain, */*',
      },
    });

    if (!response.ok) {
      console.error('❌ iCal fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        url: icalUrl.substring(0, 50) + '...',
      });
      throw new Error(`Failed to fetch iCal: ${response.status} ${response.statusText}`);
    }

    const icalContent = await response.text();
    console.log('📥 iCal Import: Downloaded', icalContent.length, 'bytes');

    // Parse iCal content
    const events = parseICalContent(icalContent);
    console.log('📥 iCal Import: Parsed', events.length, 'events');

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Žádné rezervace k importu',
        imported: 0,
        skipped: 0,
        timestamp: new Date().toISOString(),
      });
    }

    let importedCount = 0;
    let skippedCount = 0;

    // Process each event
    for (const event of events) {
      try {
        // Skip cancelled events
        if (event.status === 'CANCELLED') {
          console.log(`⏭️  Skipping cancelled event: ${event.uid}`);
          skippedCount++;
          continue;
        }

        // Check if this booking already exists
        const existingQuery = query(
          collection(db, 'bookings'),
          where('externalId', '==', event.uid),
          where('source', '==', 'booking.com')
        );
        const existingSnapshot = await getDocs(existingQuery);

        if (!existingSnapshot.empty) {
          // Booking already exists - could update it here if needed
          console.log(`✓ Booking already exists: ${event.uid}`);
          skippedCount++;
          continue;
        }

        // Calculate nights
        const checkInDate = new Date(event.startDate);
        const checkOutDate = new Date(event.endDate);
        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Add +1 day for cleaning after checkout
        const cleaningDate = new Date(checkOutDate);
        cleaningDate.setDate(cleaningDate.getDate() + 1);
        const cleaningDay = cleaningDate.toISOString().split('T')[0];

        // Create new booking in Firebase
        await addDoc(collection(db, 'bookings'), {
          firstName: 'Booking.com',
          lastName: 'Guest',
          email: '',
          phone: '',
          checkIn: event.startDate,
          checkOut: event.endDate,
          guests: 2, // Default, as iCal doesn't provide this
          nights: nights,
          totalPrice: 0, // iCal doesn't provide price info
          pricePerNight: 0,
          message: event.description || 'Importováno z Booking.com přes iCal',
          status: 'confirmed',
          paymentStatus: 'fully_paid', // Assume external bookings are paid
          createdAt: Timestamp.now(),
          externalId: event.uid,
          source: 'booking.com',
          syncedAt: Timestamp.now(),
          cleaningDay: cleaningDay, // +1 day after checkout for cleaning
        });

        console.log(`✅ Imported booking: ${event.uid} (${event.startDate} - ${event.endDate})`);
        importedCount++;
      } catch (err) {
        console.error('Error importing event:', event.uid, err);
        skippedCount++;
      }
    }

    console.log(`✅ iCal Import complete: ${importedCount} imported, ${skippedCount} skipped`);

    return NextResponse.json({
      success: true,
      message: `Importováno ${importedCount} rezervací z iCal kalendáře`,
      imported: importedCount,
      skipped: skippedCount,
      total: events.length,
      timestamp: new Date().toISOString(),
      details: {
        source: 'iCal',
        destination: 'Firebase',
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('❌ iCal Import error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Chyba při importu kalendáře',
        details: error instanceof Error ? error.message : 'Neznámá chyba',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ical/import
 * 
 * Test endpoint to check if import is working
 */
export async function GET() {
  return NextResponse.json({
    message: 'iCal Import API',
    usage: 'POST with { "icalUrl": "your-ical-url" }',
    example: {
      icalUrl: 'https://admin.booking.com/hotel/hoteladmin/ical.html?t=...',
    },
  });
}

