'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getBookingById, BookingDocument } from '@/lib/firebase/bookings';

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="group" aria-label="Hodnocení">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
          aria-label={`${star} hvězd`}
        >
          <Star
            className={`w-10 h-10 transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [booking, setBooking] = useState<BookingDocument | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [bookingError, setBookingError] = useState('');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!token) {
      setBookingError('Neplatný odkaz — chybí token rezervace.');
      setLoadingBooking(false);
      return;
    }

    getBookingById(token)
      .then((b) => {
        if (!b) {
          setBookingError('Rezervace nebyla nalezena.');
        } else {
          setBooking(b);
        }
      })
      .catch(() => setBookingError('Nepodařilo se načíst rezervaci.'))
      .finally(() => setLoadingBooking(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (rating === 0) {
      setSubmitError('Prosím vyberte hodnocení (1–5 hvězdiček).');
      return;
    }
    if (comment.trim().length < 10) {
      setSubmitError('Komentář musí mít alespoň 10 znaků.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: token,
          rating,
          comment: comment.trim(),
          guestName: `${booking!.firstName} ${booking!.lastName}`,
          guestEmail: booking!.email,
          checkIn: booking!.checkIn,
          checkOut: booking!.checkOut,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 409) {
        setSubmitError('Recenzi pro tuto rezervaci jste již odeslali. Děkujeme!');
      } else {
        setSubmitError(data.error || 'Nepodařilo se odeslat recenzi. Zkuste to prosím znovu.');
      }
    } catch {
      setSubmitError('Chyba při odesílání. Zkontrolujte připojení a zkuste znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo / brand */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary-blue">Cielo Dorado</h1>
          <p className="text-gray-500 mt-1">Tenerife — Los Gigantes</p>
        </div>

        {/* Loading booking */}
        {loadingBooking && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Booking error */}
        {!loadingBooking && bookingError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{bookingError}</p>
            <p className="text-red-600 text-sm mt-2">
              Pokud si myslíte, že jde o chybu, kontaktujte nás prosím.
            </p>
          </div>
        )}

        {/* Success state */}
        {isSubmitted && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recenze odeslána!</h2>
            <p className="text-gray-600">
              Děkujeme za vaši recenzi. Po schválení se zobrazí na webu.
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${
                    s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Review form */}
        {!loadingBooking && booking && !isSubmitted && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Jak se vám líbilo?</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Váš pobyt v Cielo Dorado, Tenerife
            </p>

            {/* Stay info (read-only) */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-1">
              <p className="font-semibold text-gray-900">
                {booking.firstName} {booking.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hodnocení <span className="text-red-500">*</span>
                </label>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {['', 'Špatný', 'Podprůměrný', 'Průměrný', 'Dobrý', 'Výborný'][rating]}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Komentář <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  placeholder="Napište nám, jak se vám u nás líbilo..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Error message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-blue to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Odesílám...' : 'Odeslat recenzi'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RecenzePage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ReviewForm />
      </Suspense>
      <Footer />
    </>
  );
}
