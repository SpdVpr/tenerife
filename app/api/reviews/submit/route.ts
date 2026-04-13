import { NextRequest, NextResponse } from 'next/server';
import { createReview, getReviewByBookingId } from '@/lib/firebase/reviews';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, rating, comment, guestName, guestEmail, checkIn, checkOut } = body;

    // Validate required fields
    if (!bookingId || !rating || !comment || !guestName || !guestEmail || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Chybí povinná pole' },
        { status: 400 }
      );
    }

    // Validate rating range
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Hodnocení musí být číslo 1–5' },
        { status: 400 }
      );
    }

    // Prevent duplicate submissions
    const existing = await getReviewByBookingId(bookingId);
    if (existing) {
      return NextResponse.json(
        { error: 'Recenzi pro tuto rezervaci jste již odeslali' },
        { status: 409 }
      );
    }

    const reviewId = await createReview({
      bookingId,
      rating: ratingNum,
      comment: comment.trim(),
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      checkIn,
      checkOut,
    });

    console.log('✅ Review submitted:', reviewId);

    return NextResponse.json({ success: true, reviewId });
  } catch (error) {
    console.error('❌ Failed to submit review:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se odeslat recenzi' },
      { status: 500 }
    );
  }
}
