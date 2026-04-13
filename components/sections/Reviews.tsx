'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApprovedReviews, ReviewDocument } from '@/lib/firebase/reviews';
import { useLanguage } from '@/contexts/LanguageContext';

const AUTO_INTERVAL_MS = 5000;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewDocument }) {
  const { t } = useLanguage();
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4 h-full">
      <StarRating rating={review.rating} />
      <p className="text-gray-700 leading-relaxed flex-1">&ldquo;{review.comment}&rdquo;</p>
      <div className="flex items-end justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="font-semibold text-gray-900">{review.guestName}</p>
          <p className="text-sm text-gray-500">
            {t('reviews.stay')}: {formatDate(review.checkIn)} – {formatDate(review.checkOut)}
          </p>
        </div>
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
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

  // Carousel state
  const [pos, setPos] = useState(0);           // current offset in the extended array
  const [sliding, setSliding] = useState(false); // is a CSS transition in progress
  const [noTransition, setNoTransition] = useState(false); // silent jump (no animation)
  const [paused, setPaused] = useState(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  useEffect(() => {
    getApprovedReviews()
      .then((data) => {
        setReviews(data);
        setPos(data.length); // start at the first item of the middle copy
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Three copies for seamless infinite loop: [copy1, copy2, copy3]
  const n = reviews.length;
  const slides = n > 0 ? [...reviews, ...reviews, ...reviews] : [];

  // Card width: 33.333% of track on lg, 100% on mobile
  // We use inline style flex-basis so translateX % is consistent
  const cardPct = 100 / 3; // 33.333…

  // After the CSS transition ends, silently snap back to the middle copy
  const handleTransitionEnd = useCallback(() => {
    setSliding(false);
    const p = posRef.current;
    if (p < n || p >= 2 * n) {
      const snapped = p < n ? p + n : p - n;
      setNoTransition(true);
      setPos(snapped);
    }
  }, [n]);

  // Re-enable transition one paint after a silent snap
  useEffect(() => {
    if (!noTransition) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setNoTransition(false))
    );
    return () => cancelAnimationFrame(id);
  }, [noTransition]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (sliding || n < 2) return;
      setSliding(true);
      setPos((p) => p + dir);
    },
    [sliding, n]
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  // Auto-advance
  useEffect(() => {
    if (paused || n < 2) return;
    const id = setInterval(next, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, n, next]);

  if (!isLoading && n === 0) return null;

  // Which "real" index is at the leftmost visible slot?
  const realFirst = n > 0 ? ((pos - n) % n + n) % n : 0;

  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-b from-slate-50 to-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-blue/10 text-primary-blue text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ⭐ {t('reviews.verified')}
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('reviews.title')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('reviews.subtitle')}</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && n > 0 && (
          <div className="relative">
            {/* Track wrapper */}
            <div className="overflow-hidden py-4">
              <div
                style={{
                  display: 'flex',
                  transform: `translateX(${-pos * cardPct}%)`,
                  transition: noTransition ? 'none' : sliding ? 'transform 0.5s ease' : 'none',
                  willChange: 'transform',
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {slides.map((review, i) => (
                  <div
                    key={`${review.id}-${i}`}
                    style={{ flex: `0 0 ${cardPct}%`, padding: '0 1rem' }}
                  >
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            {n > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={prev}
                  className="p-2 rounded-full bg-white shadow hover:shadow-md border border-gray-200 hover:border-primary-blue transition-all text-gray-600 hover:text-primary-blue"
                  aria-label="Předchozí"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots — one per real review */}
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (sliding) return;
                        const target = n + i; // equivalent position in middle copy
                        const diff = target - posRef.current;
                        if (diff === 0) return;
                        setSliding(true);
                        setPos(target);
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        i === realFirst
                          ? 'w-6 h-3 bg-primary-blue'
                          : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Recenze ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="p-2 rounded-full bg-white shadow hover:shadow-md border border-gray-200 hover:border-primary-blue transition-all text-gray-600 hover:text-primary-blue"
                  aria-label="Další"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
