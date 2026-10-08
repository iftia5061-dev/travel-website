import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { Booking } from '@/types/booking';

const BOOKINGS_COLLECTION = 'bookings';

export const bookingService = {
  // Get all bookings (Admin)
  getAll: async (): Promise<Booking[]> => {
    const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
  },

  // Get bookings by user ID
  getByUserId: async (userId: string): Promise<Booking[]> => {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
  },

  // Get booking by ID
  getById: async (id: string): Promise<Booking | null> => {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Booking;
    }
    return null;
  },

  // Create booking
  create: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update booking (Admin)
  update: async (id: string, booking: Partial<Booking>): Promise<void> => {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(docRef, {
      ...booking,
      updatedAt: new Date()
    });
  },

  // Update booking status (Admin)
  updateStatus: async (id: string, status: Booking['bookingStatus']): Promise<void> => {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(docRef, {
      bookingStatus: status,
      updatedAt: new Date()
    });
  }
};
