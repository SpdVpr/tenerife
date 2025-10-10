import { NextRequest, NextResponse } from 'next/server';
import { sendBookingEmails } from '@/lib/email/send';
import { BookingData } from '@/lib/firebase/bookings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking } = body;

    if (!booking || !booking.id) {
      return NextResponse.json(
        { error: 'Missing booking data' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      'checkIn',
      'checkOut',
      'guests',
      'firstName',
      'lastName',
      'email',
      'phone',
      'nights',
      'totalPrice',
      'pricePerNight',
    ];

    for (const field of requiredFields) {
      if (!booking[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Send emails
    const result = await sendBookingEmails(booking as BookingData & { id: string });

    // Check if both emails were sent successfully
    const allSuccess = result.guestEmail.success && result.ownerEmail.success;

    if (allSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Booking emails sent successfully',
        details: result,
      });
    } else {
      // Partial failure
      return NextResponse.json(
        {
          success: false,
          message: 'Some emails failed to send',
          details: result,
        },
        { status: 207 } // Multi-Status
      );
    }
  } catch (error) {
    console.error('Error in send-booking-email API:', error);
    return NextResponse.json(
      {
        error: 'Failed to send booking emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

