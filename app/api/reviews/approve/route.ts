import { NextRequest, NextResponse } from 'next/server';
import { updateReviewStatus } from '@/lib/firebase/reviews';

export async function POST(request: NextRequest) {
  try {
    const { reviewId, action } = await request.json();

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Chybí reviewId nebo action' },
        { status: 400 }
      );
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Neplatná akce — povoleno: approve, reject' },
        { status: 400 }
      );
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    await updateReviewStatus(reviewId, status);

    console.log('✅ Review status updated:', reviewId, status);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('❌ Failed to update review status:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se aktualizovat recenzi' },
      { status: 500 }
    );
  }
}
