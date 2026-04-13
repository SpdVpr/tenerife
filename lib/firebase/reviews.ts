import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';

export interface ReviewData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  rating: number; // 1–5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  createdAt: Date;
  moderatedAt?: Date;
}

export interface ReviewDocument extends ReviewData {
  id: string;
}

const REVIEWS_COLLECTION = 'reviews';

/**
 * Create a new review (submitted by guest)
 */
export async function createReview(
  data: Omit<ReviewData, 'createdAt' | 'status'>
): Promise<string> {
  try {
    const review: ReviewData = {
      ...data,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...review,
      createdAt: Timestamp.fromDate(review.createdAt),
    });

    console.log('Review created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

/**
 * Create review with a fixed document ID (for seeding mock data)
 */
export async function createReviewWithId(
  id: string,
  data: ReviewData
): Promise<void> {
  try {
    await setDoc(doc(db, REVIEWS_COLLECTION, id), {
      ...data,
      createdAt: Timestamp.fromDate(data.createdAt),
      moderatedAt: data.moderatedAt ? Timestamp.fromDate(data.moderatedAt) : undefined,
    });
    console.log('Review seeded with ID:', id);
  } catch (error) {
    console.error('Error seeding review:', error);
    throw new Error('Failed to seed review');
  }
}

/**
 * Get all reviews ordered by creation date (for admin)
 */
export async function getAllReviews(): Promise<ReviewDocument[]> {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const reviews: ReviewDocument[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as DocumentData;
      reviews.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        moderatedAt: data.moderatedAt?.toDate() || undefined,
      } as ReviewDocument);
    });

    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw new Error('Failed to get reviews');
  }
}

/**
 * Get only approved reviews (for front page display)
 * Filters in memory to avoid composite Firestore index requirement
 */
export async function getApprovedReviews(): Promise<ReviewDocument[]> {
  try {
    const all = await getAllReviews();
    return all.filter((r) => r.status === 'approved');
  } catch (error) {
    console.error('Error getting approved reviews:', error);
    throw new Error('Failed to get approved reviews');
  }
}

/**
 * Edit review content (admin can fix guestName, rating, comment)
 */
export async function updateReview(
  reviewId: string,
  fields: { guestName?: string; rating?: number; comment?: string }
): Promise<void> {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, fields);
    console.log('Review updated:', reviewId);
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
}

/**
 * Update review status (approve or reject)
 */
export async function updateReviewStatus(
  reviewId: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      status,
      moderatedAt: Timestamp.fromDate(new Date()),
    });
    console.log('Review status updated:', reviewId, status);
  } catch (error) {
    console.error('Error updating review status:', error);
    throw new Error('Failed to update review status');
  }
}

/**
 * Check if a review already exists for a booking (prevent duplicates)
 */
export async function getReviewByBookingId(
  bookingId: string
): Promise<ReviewDocument | null> {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('bookingId', '==', bookingId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data() as DocumentData;
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      moderatedAt: data.moderatedAt?.toDate() || undefined,
    } as ReviewDocument;
  } catch (error) {
    console.error('Error checking review by booking:', error);
    return null;
  }
}

// ─── Settings ────────────────────────────────────────────────────────────────

const SETTINGS_COLLECTION = 'settings';
const REVIEW_SETTINGS_DOC = 'reviews';

export interface ReviewSettings {
  autoEmailDays: number; // Days after checkout before sending review request email
}

const DEFAULT_SETTINGS: ReviewSettings = { autoEmailDays: 3 };

export async function getReviewSettings(): Promise<ReviewSettings> {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, REVIEW_SETTINGS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as ReviewSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting review settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateReviewSettings(settings: ReviewSettings): Promise<void> {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, REVIEW_SETTINGS_DOC);
    await setDoc(ref, settings, { merge: true });
    console.log('Review settings updated:', settings);
  } catch (error) {
    console.error('Error updating review settings:', error);
    throw new Error('Failed to update review settings');
  }
}
