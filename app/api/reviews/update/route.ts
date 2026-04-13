import { NextRequest, NextResponse } from 'next/server';
import { updateReview } from '@/lib/firebase/reviews';

export async function POST(request: NextRequest) {
  try {
    const { reviewId, guestName, rating, comment } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ error: 'Chybí reviewId' }, { status: 400 });
    }

    const fields: { guestName?: string; rating?: number; comment?: string } = {};

    if (guestName !== undefined) {
      if (!guestName.trim()) {
        return NextResponse.json({ error: 'Jméno nemůže být prázdné' }, { status: 400 });
      }
      fields.guestName = guestName.trim();
    }

    if (rating !== undefined) {
      const r = Number(rating);
      if (!Number.isInteger(r) || r < 1 || r > 5) {
        return NextResponse.json({ error: 'Hodnocení musí být 1–5' }, { status: 400 });
      }
      fields.rating = r;
    }

    if (comment !== undefined) {
      if (!comment.trim()) {
        return NextResponse.json({ error: 'Komentář nemůže být prázdný' }, { status: 400 });
      }
      fields.comment = comment.trim();
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: 'Žádná pole k aktualizaci' }, { status: 400 });
    }

    await updateReview(reviewId, fields);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to update review:', error);
    return NextResponse.json({ error: 'Nepodařilo se upravit recenzi' }, { status: 500 });
  }
}
