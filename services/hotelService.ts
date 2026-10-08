import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { Hotel } from '@/types/hotel';

const HOTELS_COLLECTION = 'hotels';

export const hotelService = {
  // Get all hotels
  getAll: async (): Promise<Hotel[]> => {
    const querySnapshot = await getDocs(collection(db, HOTELS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Hotel));
  },

  // Get featured hotels
  getFeatured: async (): Promise<Hotel[]> => {
    const q = query(
      collection(db, HOTELS_COLLECTION),
      where('featured', '==', true),
      where('available', '==', true),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Hotel));
  },

  // Get hotel by ID
  getById: async (id: string): Promise<Hotel | null> => {
    const docRef = doc(db, HOTELS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Hotel;
    }
    return null;
  },

  // Get hotels by destination
  getByCity: async (city: string): Promise<Hotel[]> => {
    const q = query(
      collection(db, HOTELS_COLLECTION),
      where('city', '==', city),
      where('available', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Hotel));
  },

  // Create hotel (Admin)
  create: async (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, HOTELS_COLLECTION), {
      ...hotel,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update hotel (Admin)
  update: async (id: string, hotel: Partial<Hotel>): Promise<void> => {
    const docRef = doc(db, HOTELS_COLLECTION, id);
    await updateDoc(docRef, {
      ...hotel,
      updatedAt: new Date()
    });
  },

  // Delete hotel (Admin)
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, HOTELS_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
