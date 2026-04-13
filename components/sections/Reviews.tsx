'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getApprovedReviews, ReviewDocument } from '@/lib/firebase/reviews';
import { useLanguage } from '@/contexts/LanguageContext';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewDocument }) {
  const { t } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
      {/* Stars */}
      <StarRating rating={review.rating} />

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed flex-1">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="font-semibold text-gray-900">{review.guestName}</p>
          <p className="text-sm text-gray-500">
            {t('reviews.stay')}: {formatDate(review.checkIn)} – {formatDate(review.checkOut)}
          </p>
        </div>
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
          ✓ {t('reviews.verified')}
        </span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getApprovedReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Don't render the section if there are no reviews (avoids empty section on live site)
  if (!isLoading && reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-blue/10 text-primary-blue text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ⭐ {t('reviews.verified')}
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Reviews grid */}
        {!isLoading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
