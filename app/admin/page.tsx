'use client';

import { useState, useEffect } from 'react';
import {
  getAllBookings,
  BookingDocument,
  updateBookingStatus,
  updatePaymentStatus,
  updateBooking,
  deleteBooking
} from '@/lib/firebase/bookings';
import { Calendar, Users, Mail, Phone, Clock, Euro, Loader2, Check, X, Trash2, RefreshCw, LogOut, Edit } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import AdminAvailabilityCalendar from '@/components/admin/AdminAvailabilityCalendar';
import ICalIntegration from '@/components/admin/ICalIntegration';
import EditBookingModal from '@/components/admin/EditBookingModal';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'ical'>('bookings');
  const [editingBooking, setEditingBooking] = useState<BookingDocument | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setError('');
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Chyba při načítání rezervací');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      // If confirming, send confirmation email
      if (newStatus === 'confirmed') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          try {
            const response = await fetch('/api/send-confirmation-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ booking }),
            });

            if (response.ok) {
              alert('Rezervace potvrzena a email odeslán hostovi!');
            } else {
              alert('Rezervace potvrzena, ale email se nepodařilo odeslat.');
            }
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            alert('Rezervace potvrzena, ale email se nepodařilo odeslat.');
          }
        }
      }

      // Reload bookings
      await loadBookings();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Chyba při změně statusu rezervace');
    }
  };

  const handlePaymentStatusChange = async (
    bookingId: string,
    newPaymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid'
  ) => {
    try {
      await updatePaymentStatus(bookingId, newPaymentStatus);

      // Send payment confirmation email
      if (newPaymentStatus === 'deposit_paid' || newPaymentStatus === 'fully_paid') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          try {
            const response = await fetch('/api/send-payment-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking,
                paymentType: newPaymentStatus
              }),
            });

            if (response.ok) {
              alert('Platební status aktualizován a email odeslán hostovi!');
            } else {
              alert('Platební status aktualizován, ale email se nepodařilo odeslat.');
            }
          } catch (emailError) {
            console.error('Error sending payment email:', emailError);
            alert('Platební status aktualizován, ale email se nepodařilo odeslat.');
          }
        }
      }

      // Reload bookings
      await loadBookings();
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Chyba při změně platebního statusu');
    }
  };

  const handleEdit = (booking: BookingDocument) => {
    setEditingBooking(booking);
  };

  const handleSaveEdit = async (bookingId: string, updates: Partial<BookingDocument>) => {
    try {
      await updateBooking(bookingId, updates);
      alert('Rezervace byla úspěšně aktualizována!');
      // Reload bookings
      await loadBookings();
      setEditingBooking(null);
    } catch (err) {
      console.error('Error updating booking:', err);
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Opravdu chcete smazat tuto rezervaci?')) {
      return;
    }

    try {
      await deleteBooking(bookingId);
      // Reload bookings
      await loadBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Chyba při mazání rezervace');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Potvrzeno';
      case 'pending':
        return 'Čeká na potvrzení';
      case 'cancelled':
        return 'Zrušeno';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'fully_paid':
        return 'bg-green-100 text-green-800';
      case 'deposit_paid':
        return 'bg-blue-100 text-blue-800';
      case 'unpaid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'fully_paid':
        return '💰 Plně zaplaceno';
      case 'deposit_paid':
        return '💵 Záloha zaplacena';
      case 'unpaid':
        return '⏳ Nezaplaceno';
      default:
        return paymentStatus;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-600">
                {activeTab === 'bookings' && 'Přehled všech rezervací apartmánu Cielo Dorado'}
                {activeTab === 'calendar' && 'Kombinovaný kalendář - web + Booking.com'}
                {activeTab === 'ical' && 'Přímá synchronizace s Booking.com přes iCal kalendáře'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === 'bookings' && (
                <button
                  onClick={loadBookings}
                  disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                Obnovit
              </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Odhlásit se
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-2 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Rezervace
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Kalendář
            </button>
            <button
              onClick={() => setActiveTab('ical')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'ical'
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              iCal Sync
            </button>
          </div>

          {/* Bookings Tab Content */}
          {activeTab === 'bookings' && (
            <>
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
                  <span className="ml-3 text-gray-600">Načítám rezervace...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Bookings List */}
              {!isLoading && !error && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Celkem rezervací</p>
                      <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                    </div>
                    <Calendar className="w-12 h-12 text-primary-blue opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Čeká na potvrzení</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {bookings.filter(b => b.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Potvrzeno</p>
                      <p className="text-3xl font-bold text-green-600">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </p>
                    </div>
                    <Calendar className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                </div>
              </div>

              {/* Bookings Table */}
              {bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Zatím žádné rezervace</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left Side - Guest Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900">
                              {booking.firstName} {booking.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus || 'unpaid')}`}>
                              {getPaymentStatusText(booking.paymentStatus || 'unpaid')}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {booking.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {booking.phone}
                            </div>
                          </div>
                        </div>

                        {/* Middle - Booking Details */}
                        <div className="flex-1 border-l border-gray-200 pl-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Příjezd</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString('cs-CZ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Odjezd</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(booking.checkOut).toLocaleDateString('cs-CZ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Nocí</p>
                              <p className="font-semibold text-gray-900">{booking.nights}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Hostů</p>
                              <p className="font-semibold text-gray-900 flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {booking.guests}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Price */}
                        <div className="border-l border-gray-200 pl-6">
                          <div className="text-right">
                            <p className="text-gray-600 text-sm mb-1">Celková cena</p>
                            <p className="text-2xl font-bold text-primary-blue flex items-center justify-end">
                              <Euro className="w-6 h-6 mr-1" />
                              {booking.totalPrice}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {booking.pricePerNight} EUR/noc
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {booking.message && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Zpráva:</span> {booking.message}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        {/* Row 1: Status Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Vytvořeno: {booking.createdAt.toLocaleString('cs-CZ')}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEdit(booking)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                              title="Upravit rezervaci"
                            >
                              <Edit className="w-4 h-4" />
                              Upravit
                            </button>
                            {/* Status Buttons */}
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                  title="Potvrdit rezervaci a odeslat email"
                                >
                                  <Check className="w-4 h-4" />
                                  Potvrdit
                                </button>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                  title="Zrušit rezervaci"
                                >
                                  <X className="w-4 h-4" />
                                  Zrušit
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                title="Zrušit rezervaci"
                              >
                                <X className="w-4 h-4" />
                                Zrušit
                              </button>
                            )}
                            {booking.status === 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(booking.id, 'pending')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                                title="Obnovit jako čekající"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Obnovit
                              </button>
                            )}
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                              title="Smazat rezervaci"
                            >
                              <Trash2 className="w-4 h-4" />
                              Smazat
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Payment Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-gray-700">
                            💳 Platební akce:
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Payment Buttons */}
                            {(booking.paymentStatus === 'unpaid' || !booking.paymentStatus) && (
                              <>
                                <button
                                  onClick={() => handlePaymentStatusChange(booking.id, 'deposit_paid')}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                  title="Označit zálohu jako zaplacenou a odeslat email"
                                >
                                  <Check className="w-4 h-4" />
                                  Záloha zaplacena
                                </button>
                                <button
                                  onClick={() => handlePaymentStatusChange(booking.id, 'fully_paid')}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                  title="Označit jako plně zaplaceno a odeslat email"
                                >
                                  <Check className="w-4 h-4" />
                                  Zaplaceno celé
                                </button>
                              </>
                            )}
                            {booking.paymentStatus === 'deposit_paid' && (
                              <button
                                onClick={() => handlePaymentStatusChange(booking.id, 'fully_paid')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                title="Označit zbytek jako zaplacený a odeslat email"
                              >
                                <Check className="w-4 h-4" />
                                Doplacen zbytek
                              </button>
                            )}
                            {booking.paymentStatus === 'fully_paid' && (
                              <span className="text-sm text-green-600 font-semibold">
                                ✅ Vše zaplaceno
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
              )}
            </>
          )}

          {/* Calendar Tab Content */}
          {activeTab === 'calendar' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Kombinovaný kalendář</h2>
                <p className="text-gray-600 mb-6">
                  Přehled obsazených dní z obou zdrojů - web rezervace a Booking.com
                </p>
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-lg shadow p-6">
                <AdminAvailabilityCalendar />
              </div>
            </div>
          )}

          {/* iCal Tab Content */}
          {activeTab === 'ical' && (
            <ICalIntegration />
          )}
        </div>
      </main>
      <Footer />

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          isOpen={!!editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

