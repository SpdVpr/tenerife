import { NextResponse } from 'next/server';
import { addSyncLog } from '@/lib/firebase/syncLogs';

/**
 * POST /api/ical/sync
 * 
 * Triggers a full synchronization:
 * 1. Imports bookings from Booking.com iCal URL
 * 2. Exports local bookings to iCal format
 * 
 * This endpoint can be called:
 * - Manually from admin panel
 * - Automatically via cron job (every 30-60 minutes)
 * - Via webhook from external service
 * 
 * Request body (optional):
 * {
 *   "icalUrl": "https://admin.booking.com/hotel/hoteladmin/ical.html?t=..."
 * }
 * 
 * If icalUrl is not provided, it will use BOOKING_COM_ICAL_URL from env
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const icalUrl = body.icalUrl || process.env.BOOKING_COM_ICAL_URL;

    if (!icalUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'iCal URL není nakonfigurována. Přidejte BOOKING_COM_ICAL_URL do .env.local',
        },
        { status: 400 }
      );
    }

    console.log('🔄 Starting iCal synchronization...');
    const startTime = Date.now();

    // Step 1: Import from Booking.com
    console.log('📥 Step 1: Importing from Booking.com...');

    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    (request.headers.get('host') ? `http://${request.headers.get('host')}` : 'http://localhost:3000');

    const importResponse = await fetch(`${baseUrl}/api/ical/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ icalUrl }),
    });

    if (!importResponse.ok) {
      const errorText = await importResponse.text();
      console.error('❌ Import response error:', importResponse.status, errorText);
      throw new Error(`Import request failed: ${importResponse.status} ${importResponse.statusText}`);
    }

    const importResult = await importResponse.json();
    
    if (!importResult.success) {
      throw new Error(`Import failed: ${importResult.message}`);
    }

    console.log(`✅ Import complete: ${importResult.imported} imported, ${importResult.skipped} skipped`);

    // Step 2: Export is automatic via /api/ical/export endpoint
    // Booking.com will fetch it automatically based on their schedule
    console.log('✅ Export endpoint is available at /api/ical/export');

    const duration = Date.now() - startTime;

    // Save sync log to Firebase
    await addSyncLog({
      timestamp: new Date(),
      type: 'sync',
      status: 'success',
      message: `Synchronizace dokončena: ${importResult.imported} importováno, ${importResult.skipped} přeskočeno`,
      details: {
        imported: importResult.imported,
        skipped: importResult.skipped,
        total: importResult.total,
        duration: `${duration}ms`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Synchronizace dokončena',
      duration: `${duration}ms`,
      import: {
        imported: importResult.imported,
        skipped: importResult.skipped,
        total: importResult.total,
      },
      export: {
        message: 'Export endpoint is available at /api/ical/export',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ical/export`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Sync error:', error);

    // Save error log to Firebase
    await addSyncLog({
      timestamp: new Date(),
      type: 'sync',
      status: 'error',
      message: 'Chyba při synchronizaci',
      details: {
        error: error instanceof Error ? error.message : 'Neznámá chyba',
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Chyba při synchronizaci',
        details: error instanceof Error ? error.message : 'Neznámá chyba',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ical/sync
 *
 * Triggers synchronization (used by Vercel Cron)
 * This is the same as POST but without requiring a request body
 */
export async function GET(request: Request) {
  try {
    const icalUrl = process.env.BOOKING_COM_ICAL_URL;

    if (!icalUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'iCal URL není nakonfigurována. Přidejte BOOKING_COM_ICAL_URL do .env.local',
        },
        { status: 400 }
      );
    }

    console.log('🔄 Starting iCal synchronization (GET)...');
    const startTime = Date.now();

    // Step 1: Import from Booking.com
    console.log('📥 Step 1: Importing from Booking.com...');

    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'http://localhost:3000');

    const importResponse = await fetch(`${baseUrl}/api/ical/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ icalUrl }),
    });

    if (!importResponse.ok) {
      const errorText = await importResponse.text();
      console.error('❌ Import response error:', importResponse.status, errorText);
      throw new Error(`Import request failed: ${importResponse.status} ${importResponse.statusText}`);
    }

    const importResult = await importResponse.json();

    if (!importResult.success) {
      throw new Error(`Import failed: ${importResult.message}`);
    }

    console.log(`✅ Import complete: ${importResult.imported} imported, ${importResult.skipped} skipped`);

    // Step 2: Export is automatic via /api/ical/export endpoint
    // Booking.com will fetch it automatically based on their schedule
    console.log('✅ Export endpoint is available at /api/ical/export');

    const duration = Date.now() - startTime;

    // Save sync log to Firebase
    await addSyncLog({
      timestamp: new Date(),
      type: 'sync',
      status: 'success',
      message: `Synchronizace dokončena: ${importResult.imported} importováno, ${importResult.skipped} přeskočeno`,
      details: {
        imported: importResult.imported,
        skipped: importResult.skipped,
        total: importResult.total,
        duration: `${duration}ms`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Synchronizace dokončena',
      duration: `${duration}ms`,
      import: {
        imported: importResult.imported,
        skipped: importResult.skipped,
        total: importResult.total,
      },
      export: {
        message: 'Export endpoint is available at /api/ical/export',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ical/export`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Sync error:', error);

    // Save error log to Firebase
    await addSyncLog({
      timestamp: new Date(),
      type: 'sync',
      status: 'error',
      message: 'Chyba při synchronizaci',
      details: {
        error: error instanceof Error ? error.message : 'Neznámá chyba',
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Chyba při synchronizaci',
        details: error instanceof Error ? error.message : 'Neznámá chyba',
      },
      { status: 500 }
    );
  }
}

