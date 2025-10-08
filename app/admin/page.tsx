'use client';

import { useState, useEffect } from 'react';
import {
  getAllBookings,
  BookingDocument,
  updateBookingStatus,
  deleteBooking
} from '@/lib/firebase/bookings';
import { Calendar, Users, Mail, Phone, Clock, Euro, Loader2, Check, X, Trash2, RefreshCw, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
      // Reload bookings
      await loadBookings();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Chyba při změně statusu rezervace');
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
                Admin Panel - Rezervace
              </h1>
              <p className="text-gray-600">
                Přehled všech rezervací apartmánu Cielo Dorado
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadBookings}
                disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              Obnovit
            </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Odhlásit se
              </button>
            </div>
          </div>

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
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {booking.firstName} {booking.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
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
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Vytvořeno: {booking.createdAt.toLocaleString('cs-CZ')}
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Status Buttons */}
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                  title="Potvrdit rezervaci"
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

