import { NextResponse } from 'next/server';
import { createReviewWithId } from '@/lib/firebase/reviews';

// TEMPORARY endpoint for seeding mock review data.
// Call POST /api/reviews/seed-mock once from the browser or Postman,
// then DELETE this file.
export async function POST() {
  try {
    const mockReviews = [
      {
        id: 'mock-1',
        data: {
          bookingId: 'mock-booking-1',
          guestName: 'Jana Nováková',
          guestEmail: 'jana@example.com',
          rating: 5,
          comment:
            'Nádherný apartmán s výhledem na moře. Vše bylo perfektně čisté a vybavené. Majitelé jsou velmi vstřícní a ochotní. Určitě se vrátíme!',
          status: 'approved' as const,
          checkIn: '2025-03-01',
          checkOut: '2025-03-10',
          createdAt: new Date('2025-03-15'),
          moderatedAt: new Date('2025-03-16'),
        },
      },
      {
        id: 'mock-2',
        data: {
          bookingId: 'mock-booking-2',
          guestName: 'Tomáš Dvořák',
          guestEmail: 'tomas@example.com',
          rating: 5,
          comment:
            'Fantastická poloha přímo u útesů Los Gigantes. Krásný výhled na moře z terasy, výborné vybavení, nic nechybělo. Bazén na střeše budovy je skvělý bonus.',
          status: 'approved' as const,
          checkIn: '2025-06-15',
          checkOut: '2025-06-25',
          createdAt: new Date('2025-06-28'),
          moderatedAt: new Date('2025-06-29'),
        },
      },
      {
        id: 'mock-3',
        data: {
          bookingId: 'mock-booking-3',
          guestName: 'Marie Horáková',
          guestEmail: 'marie@example.com',
          rating: 4,
          comment:
            'Skvělý apartmán pro odpočinek a relaxaci. Tenerife je krásné a z tohoto apartmánu to máte kousek ke všemu. Určitě doporučuji!',
          status: 'approved' as const,
          checkIn: '2025-09-05',
          checkOut: '2025-09-15',
          createdAt: new Date('2025-09-18'),
          moderatedAt: new Date('2025-09-19'),
        },
      },
    ];

    for (const { id, data } of mockReviews) {
      await createReviewWithId(id, data);
    }

    return NextResponse.json({
      success: true,
      message: '3 mock recenze byly úspěšně vloženy do Firestore.',
      ids: mockReviews.map((r) => r.id),
    });
  } catch (error) {
    console.error('❌ Failed to seed mock reviews:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se vložit mock recenze' },
      { status: 500 }
    );
  }
}
