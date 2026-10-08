import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { Tour } from '@/types/tour';

const TOURS_COLLECTION = 'tours';

export const tourService = {
  // Get all tours
  getAll: async (): Promise<Tour[]> => {
    const querySnapshot = await getDocs(collection(db, TOURS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tour));
  },

  // Get featured tours
  getFeatured: async (): Promise<Tour[]> => {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('featured', '==', true),
      where('available', '==', true),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tour));
  },

  // Get tour by ID
  getById: async (id: string): Promise<Tour | null> => {
    const docRef = doc(db, TOURS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Tour;
    }
    return null;
  },

  // Get tours by destination
  getByDestination: async (destination: string): Promise<Tour[]> => {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('destination', '==', destination),
      where('available', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tour));
  },

  // Create tour (Admin)
  create: async (tour: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, TOURS_COLLECTION), {
      ...tour,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update tour (Admin)
  update: async (id: string, tour: Partial<Tour>): Promise<void> => {
    const docRef = doc(db, TOURS_COLLECTION, id);
    await updateDoc(docRef, {
      ...tour,
      updatedAt: new Date()
    });
  },

  // Delete tour (Admin)
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, TOURS_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
