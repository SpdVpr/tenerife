'use client';

import { useState } from 'react';
import { Calendar, Users, Mail, Phone, User, MessageSquare, CreditCard, Check, Loader2, Info } from 'lucide-react';
import { createBooking, checkAvailability } from '@/lib/firebase/bookings';
import AvailabilityCalendar from '@/components/ui/AvailabilityCalendar';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pricePerNight, setPricePerNight] = useState(95);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Calculate nights and price when dates change
  const calculatePrice = async (checkIn: string, checkOut: string) => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setNights(diffDays);

      // Price calculation: 95 EUR for 1-9 nights, 85 EUR for 10+ nights
      const nightPrice = diffDays >= 10 ? 85 : 95;
      setPricePerNight(nightPrice);
      setTotalPrice(diffDays * nightPrice);

      // Check availability
      setIsCheckingAvailability(true);
      setAvailabilityError('');
      try {
        const isAvailable = await checkAvailability(checkIn, checkOut);
        if (!isAvailable) {
          setAvailabilityError('Tyto termíny jsou již obsazené. Prosím vyberte jiné datum.');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      } finally {
        setIsCheckingAvailability(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'checkIn' || name === 'checkOut') {
      calculatePrice(
        name === 'checkIn' ? value : formData.checkIn,
        name === 'checkOut' ? value : formData.checkOut
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Check availability one more time before submitting
      const isAvailable = await checkAvailability(formData.checkIn, formData.checkOut);

      if (!isAvailable) {
        setAvailabilityError('Tyto termíny jsou již obsazené. Prosím vyberte jiné datum.');
        setStep(1);
        setIsLoading(false);
        return;
      }

      // Create booking in Firebase
      const bookingId = await createBooking({
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || '',
        nights,
        totalPrice,
        pricePerNight,
      });

      console.log('Booking created with ID:', bookingId);

      // Show success message
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          checkIn: '',
          checkOut: '',
          guests: 2,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
        setStep(1);
        setSubmitSuccess(false);
        setNights(0);
        setTotalPrice(0);
      }, 3000);

    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Chyba při odesílání rezervace. Prosím zkuste to znovu nebo nás kontaktujte přímo.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedToStep2 = formData.checkIn && formData.checkOut && nights >= 5 && !availabilityError;
  const canProceedToStep3 = formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Rezervace
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vyplňte formulář a my vás budeme kontaktovat pro potvrzení rezervace
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= stepNumber
                        ? 'bg-gradient-to-r from-primary-blue to-primary-cyan text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > stepNumber ? <Check className="w-6 h-6" /> : stepNumber}
                  </div>
                  <span className="text-sm mt-2 font-medium text-gray-700">
                    {stepNumber === 1 && 'Termín'}
                    {stepNumber === 2 && 'Údaje'}
                    {stepNumber === 3 && 'Shrnutí'}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      step > stepNumber ? 'bg-primary-blue' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Vyberte termín pobytu
              </h3>

              {/* Calendar */}
              <div className="mb-6">
                <AvailabilityCalendar
                  onDateSelect={(checkIn, checkOut) => {
                    setFormData({ ...formData, checkIn, checkOut });
                    calculatePrice(checkIn, checkOut);
                  }}
                  selectedCheckIn={formData.checkIn}
                  selectedCheckOut={formData.checkOut}
                />
              </div>

              {/* Manual Date Input (optional) */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Nebo zadejte datum ručně:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Příjezd
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Odjezd
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Check Status */}
              {isCheckingAvailability && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                  <Loader2 className="w-5 h-5 text-primary-blue animate-spin mr-3" />
                  <span className="text-blue-700">Kontroluji dostupnost...</span>
                </div>
              )}

              {/* Availability Error */}
              {availabilityError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-semibold">{availabilityError}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Počet hostů
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value={1}>1 osoba</option>
                  <option value={2}>2 osoby</option>
                  <option value={3}>3 osoby</option>
                  <option value={4}>4 osoby</option>
                </select>
              </div>

              {nights > 0 && (
                <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Počet nocí:</span>
                    <span className="font-bold text-gray-900">{nights}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Cena za noc:</span>
                    <span className="font-bold text-gray-900">{nights >= 10 ? '85' : '95'} EUR</span>
                  </div>
                  <div className="border-t border-gray-300 my-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Celková cena:</span>
                    <span className="text-2xl font-bold text-primary-blue">{totalPrice} EUR</span>
                  </div>
                  {nights >= 10 && (
                    <p className="text-sm text-accent-green mt-2">
                      ✓ Sleva 10% za pobyt delší než 10 nocí
                    </p>
                  )}
                </div>
              )}

              {nights > 0 && nights < 5 && (
                <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4 mb-6">
                  <p className="text-accent-red font-medium">
                    Minimální délka pobytu je 5 nocí. Prosím vyberte delší období.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full bg-gradient-to-r from-primary-blue to-primary-cyan text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Pokračovat
              </button>
            </div>
          )}

          {/* Step 2: Guest Information */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Kontaktní údaje
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Jméno *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Příjmení *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+420 123 456 789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Zpráva (volitelné)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Máte nějaké speciální požadavky nebo dotazy?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Zpět
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1 bg-gradient-to-r from-primary-blue to-primary-cyan text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Pokračovat
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Shrnutí rezervace
              </h3>

              <div className="space-y-6 mb-8">
                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Detail pobytu</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Příjezd:</span>
                      <span className="font-semibold">{new Date(formData.checkIn).toLocaleDateString('cs-CZ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Odjezd:</span>
                      <span className="font-semibold">{new Date(formData.checkOut).toLocaleDateString('cs-CZ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Počet nocí:</span>
                      <span className="font-semibold">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Počet hostů:</span>
                      <span className="font-semibold">{formData.guests}</span>
                    </div>
                  </div>
                </div>

                {/* Guest Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Kontaktní údaje</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Jméno:</span>
                      <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-semibold">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Telefon:</span>
                      <span className="font-semibold">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Platební informace
                  </h4>
                  <div className="space-y-2 text-gray-700 mb-4">
                    <div className="flex justify-between">
                      <span>Celková cena:</span>
                      <span className="font-bold text-xl text-primary-blue">{totalPrice} EUR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Záloha (50%):</span>
                      <span className="font-semibold">{totalPrice / 2} EUR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zbývá zaplatit:</span>
                      <span className="font-semibold">{totalPrice / 2} EUR</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Záloha 50% je splatná při potvrzení rezervace. Zbývajících 50% je splatných měsíc před příjezdem.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Zpět
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-accent-green to-green-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Odesílám...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Odeslat rezervaci
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-slide-up">
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Rezervace odeslána!
                </h3>
                <p className="text-gray-600">
                  Děkujeme za vaši rezervaci. Brzy vás budeme kontaktovat pro potvrzení.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Payment Terms - After Booking Form */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-6">
              <CreditCard className="w-8 h-8 text-primary-blue flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Platební podmínky
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Při rezervaci se platí záloha <strong>50% z celkové ceny</strong>.
                  Zbývajících 50% je splatných <strong>měsíc před příjezdem</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <Info className="w-8 h-8 text-primary-blue flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Minimální délka pobytu
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Minimální délka rezervace je <strong>5 nocí</strong>.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                Bankovní spojení pro platbu
              </h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">IBAN:</span>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                    ES5600494166222714041761
                  </code>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Do zprávy pro příjemce uveďte prosím číslo vaší rezervace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

