import { NextRequest, NextResponse } from 'next/server';
import { deleteReview } from '@/lib/firebase/reviews';

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ error: 'Chybí reviewId' }, { status: 400 });
    }

    await deleteReview(reviewId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to delete review:', error);
    return NextResponse.json({ error: 'Nepodařilo se smazat recenzi' }, { status: 500 });
  }
}
