import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';

export interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  nights: number;
  totalPrice: number;
  pricePerNight: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid';
  createdAt: Date;
  bookingNumber?: number; // Numeric booking number (variable symbol)
}

export interface BookingDocument extends BookingData {
  id: string;
  bookingNumber: number;
}

const BOOKINGS_COLLECTION = 'bookings';
const COUNTERS_COLLECTION = 'counters';

/**
 * Generate a unique numeric booking number
 */
async function generateBookingNumber(): Promise<number> {
  try {
    const counterRef = doc(db, COUNTERS_COLLECTION, 'bookingNumber');
    const counterDoc = await getDoc(counterRef);

    let nextNumber = 1000; // Start from 1000

    if (counterDoc.exists()) {
      nextNumber = (counterDoc.data().value || 999) + 1;
      await updateDoc(counterRef, { value: nextNumber });
    } else {
      // Create counter if it doesn't exist
      await addDoc(collection(db, COUNTERS_COLLECTION), {
        id: 'bookingNumber',
        value: nextNumber
      });
    }

    return nextNumber;
  } catch (error) {
    console.error('Error generating booking number:', error);
    // Fallback to timestamp-based number
    return parseInt(Date.now().toString().slice(-6));
  }
}

/**
 * Create a new booking in Firestore
 */
export async function createBooking(bookingData: Omit<BookingData, 'createdAt' | 'status' | 'bookingNumber' | 'paymentStatus'>): Promise<string> {
  try {
    // Generate unique booking number
    const bookingNumber = await generateBookingNumber();

    const booking: BookingData = {
      ...bookingData,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date(),
      bookingNumber,
    };

    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...booking,
      createdAt: Timestamp.fromDate(booking.createdAt),
    });

    console.log('Booking created with ID:', docRef.id, 'Booking Number:', bookingNumber);
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
}

/**
 * Get all bookings
 */
export async function getAllBookings(): Promise<BookingDocument[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: BookingDocument[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      bookings.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as BookingDocument);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw new Error('Failed to get bookings');
  }
}

/**
 * Get bookings by date range (for checking availability)
 * Includes +1 day after checkout for cleaning
 */
export async function getBookingsByDateRange(startDate: string, endDate: string): Promise<BookingDocument[]> {
  try {
    // Get all non-cancelled bookings and filter in memory
    // This avoids complex Firestore queries that require indexes
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('status', '!=', 'cancelled')
    );

    const querySnapshot = await getDocs(q);
    const bookings: BookingDocument[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      const booking = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as BookingDocument;

      // Add 1 day after checkout for cleaning
      const checkOutDate = new Date(booking.checkOut);
      checkOutDate.setDate(checkOutDate.getDate() + 1);
      const checkOutWithCleaning = checkOutDate.toISOString().split('T')[0];

      // Check if booking overlaps with the requested date range
      // Overlap occurs if: booking.checkIn <= endDate AND (checkOut + 1 day) >= startDate
      if (booking.checkIn <= endDate && checkOutWithCleaning >= startDate) {
        bookings.push(booking);
      }
    });

    return bookings;
  } catch (error) {
    console.error('Error getting bookings by date range:', error);
    throw new Error('Failed to check availability');
  }
}

/**
 * Check if dates are available
 */
export async function checkAvailability(checkIn: string, checkOut: string): Promise<boolean> {
  try {
    const bookings = await getBookingsByDateRange(checkIn, checkOut);
    return bookings.length === 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
}

/**
 * Get bookings by email
 */
export async function getBookingsByEmail(email: string): Promise<BookingDocument[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bookings: BookingDocument[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      bookings.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as BookingDocument);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting bookings by email:', error);
    throw new Error('Failed to get bookings');
  }
}

/**
 * Get all occupied dates (for calendar display)
 * Includes +1 day after checkout for cleaning
 */
export async function getOccupiedDates(): Promise<string[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('status', '!=', 'cancelled')
    );

    const querySnapshot = await getDocs(q);
    const occupiedDates: Set<string> = new Set();

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);

      // Add 1 day after checkout for cleaning
      const cleaningDay = new Date(checkOut);
      cleaningDay.setDate(cleaningDay.getDate() + 1);

      // Add all dates between checkIn and checkOut + 1 day (inclusive)
      const currentDate = new Date(checkIn);
      while (currentDate <= cleaningDay) {
        occupiedDates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Array.from(occupiedDates);
  } catch (error) {
    console.error('Error getting occupied dates:', error);
    return [];
  }
}

/**
 * Get occupied dates with source information (for admin calendar)
 * Returns dates grouped by source: web, booking.com, beds24, etc.
 */
export interface OccupiedDateWithSource {
  date: string;
  sources: string[]; // e.g., ['web', 'booking.com']
}

export async function getOccupiedDatesWithSource(): Promise<OccupiedDateWithSource[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('status', '!=', 'cancelled')
    );

    const querySnapshot = await getDocs(q);
    const dateSourceMap = new Map<string, Set<string>>();

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      const source = data.source || 'web'; // Default to 'web' if no source specified

      // Add 1 day after checkout for cleaning
      const cleaningDay = new Date(checkOut);
      cleaningDay.setDate(cleaningDay.getDate() + 1);

      // Add all dates between checkIn and checkOut + 1 day (inclusive)
      const currentDate = new Date(checkIn);
      while (currentDate <= cleaningDay) {
        const dateStr = currentDate.toISOString().split('T')[0];

        if (!dateSourceMap.has(dateStr)) {
          dateSourceMap.set(dateStr, new Set());
        }
        dateSourceMap.get(dateStr)!.add(source);

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Convert map to array
    return Array.from(dateSourceMap.entries()).map(([date, sources]) => ({
      date,
      sources: Array.from(sources)
    }));
  } catch (error) {
    console.error('Error getting occupied dates with source:', error);
    return [];
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(bookingRef, { status });
    console.log('Booking status updated:', bookingId, status);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Update booking payment status
 */
export async function updatePaymentStatus(
  bookingId: string,
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid'
): Promise<void> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(bookingRef, { paymentStatus });
    console.log('Payment status updated:', bookingId, paymentStatus);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status');
  }
}

/**
 * Delete booking
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await deleteDoc(bookingRef);
    console.log('Booking deleted:', bookingId);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
}

/**
 * Get single booking by ID
 */
export async function getBookingById(bookingId: string): Promise<BookingDocument | null> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (bookingSnap.exists()) {
      const data = bookingSnap.data() as DocumentData;
      return {
        id: bookingSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as BookingDocument;
    }

    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw new Error('Failed to get booking');
  }
}

