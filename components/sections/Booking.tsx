'use client';

import { useState } from 'react';
import { Calendar, Users, Mail, Phone, User, MessageSquare, CreditCard, Check, Loader2, Info } from 'lucide-react';
import { createBooking, checkAvailability } from '@/lib/firebase/bookings';
import AvailabilityCalendar from '@/components/ui/AvailabilityCalendar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Booking() {
  const { t } = useLanguage();
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

      // Price calculation: 95 EUR for 1-9 nights, 85 EUR for 10+ nights + 80 EUR cleaning fee
      const nightPrice = diffDays >= 10 ? 85 : 95;
      setPricePerNight(nightPrice);
      const cleaningFee = 80;
      setTotalPrice(diffDays * nightPrice + cleaningFee);

      // Check availability
      setIsCheckingAvailability(true);
      setAvailabilityError('');
      try {
        const isAvailable = await checkAvailability(checkIn, checkOut);
        if (!isAvailable) {
          setAvailabilityError(t('booking.notAvailable'));
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
        setAvailabilityError(t('booking.notAvailable'));
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

      // Get the created booking to retrieve bookingNumber
      const { getBookingById } = await import('@/lib/firebase/bookings');
      const createdBooking = await getBookingById(bookingId);

      if (!createdBooking) {
        throw new Error('Failed to retrieve created booking');
      }

      // Send confirmation emails
      try {
        const emailResponse = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking: {
              id: bookingId,
              bookingNumber: createdBooking.bookingNumber,
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
              status: 'pending',
              createdAt: new Date(),
            },
          }),
        });

        const emailResult = await emailResponse.json();

        if (emailResult.success) {
          console.log('✅ Confirmation emails sent successfully');
        } else {
          console.warn('⚠️ Some emails failed to send:', emailResult);
          // Don't fail the booking if emails fail - booking is already created
        }
      } catch (emailError) {
        console.error('❌ Error sending emails:', emailError);
        // Don't fail the booking if emails fail - booking is already created
      }

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
    <section id="booking" className="py-20 bg-gradient-to-b from-accent-beige to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
            {t('booking.title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('booking.subtitle')}
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
                    {stepNumber === 1 && t('booking.step1')}
                    {stepNumber === 2 && t('booking.step2')}
                    {stepNumber === 3 && t('booking.step3')}
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
                {t('booking.selectDates')}
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
                  {t('booking.orManual')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {t('booking.checkIn')}
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
                      {t('booking.checkOut')}
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
                  <span className="text-blue-700">{t('booking.checkingAvailability')}</span>
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
                  {t('booking.guests')}
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value={1}>{t('booking.guest1')}</option>
                  <option value={2}>{t('booking.guest2')}</option>
                  <option value={3}>{t('booking.guest3')}</option>
                  <option value={4}>{t('booking.guest4')}</option>
                </select>
              </div>

              {nights > 0 && (
                <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{t('booking.nights')}</span>
                    <span className="font-bold text-gray-900">{nights}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{t('booking.pricePerNight')}</span>
                    <span className="font-bold text-gray-900">{nights >= 10 ? '85' : '95'} EUR</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{t('booking.accommodation')}</span>
                    <span className="font-bold text-gray-900">{nights * pricePerNight} EUR</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{t('booking.cleaning')}</span>
                    <span className="font-bold text-gray-900">80 EUR</span>
                  </div>
                  <div className="border-t border-gray-300 my-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t('booking.totalPrice')}</span>
                    <span className="text-2xl font-bold text-primary-blue">{totalPrice} EUR</span>
                  </div>
                  {nights >= 10 && (
                    <p className="text-sm text-accent-green mt-2">
                      {t('booking.discount10')}
                    </p>
                  )}
                </div>
              )}

              {nights > 0 && nights < 5 && (
                <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4 mb-6">
                  <p className="text-accent-red font-medium">
                    {t('booking.minStayWarning')}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full bg-gradient-to-r from-primary-blue to-primary-cyan text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {t('booking.continue')}
              </button>
            </div>
          )}

          {/* Step 2: Guest Information */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('booking.contactDetails')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    {t('booking.firstName')} *
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
                    {t('booking.lastName')} *
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
                  {t('booking.email')} *
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
                  {t('booking.phone')} *
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
                  {t('booking.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t('booking.messagePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  {t('booking.back')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1 bg-gradient-to-r from-primary-blue to-primary-cyan text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {t('booking.continue')}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('booking.summary')}
              </h3>

              <div className="space-y-6 mb-8">
                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">{t('booking.stayDetails')}</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('booking.checkIn')}:</span>
                      <span className="font-semibold">{new Date(formData.checkIn).toLocaleDateString('cs-CZ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.checkOut')}:</span>
                      <span className="font-semibold">{new Date(formData.checkOut).toLocaleDateString('cs-CZ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.nights')}</span>
                      <span className="font-semibold">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.guests')}:</span>
                      <span className="font-semibold">{formData.guests}</span>
                    </div>
                  </div>
                </div>

                {/* Guest Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">{t('booking.contactDetails')}</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('booking.name')}:</span>
                      <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.email')}:</span>
                      <span className="font-semibold">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.phone')}:</span>
                      <span className="font-semibold">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t('booking.paymentInfo')}
                  </h4>
                  <div className="space-y-2 text-gray-700 mb-4">
                    <div className="flex justify-between">
                      <span>{t('booking.totalPrice')}</span>
                      <span className="font-bold text-xl text-primary-blue">{totalPrice} EUR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.deposit')}:</span>
                      <span className="font-semibold">{totalPrice / 2} EUR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('booking.remaining')}:</span>
                      <span className="font-semibold">{totalPrice / 2} EUR</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('booking.depositInfo')}
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
                  {t('booking.back')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-accent-green to-green-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('booking.submitting')}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      {t('booking.submit')}
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
                  {t('booking.success')}
                </h3>
                <p className="text-gray-600">
                  {t('booking.successMessage')}
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
                  {t('booking.paymentTerms')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('booking.paymentTermsDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <Info className="w-8 h-8 text-primary-blue flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {t('booking.minStayTitle')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('booking.minStayDesc')}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                {t('booking.bankDetails')}
              </h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{t('booking.iban')}</span>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                    {t('booking.ibanNumber')}
                  </code>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {t('booking.paymentNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

