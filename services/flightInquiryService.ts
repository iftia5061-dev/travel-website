import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FlightInquiry } from '@/types/flightInquiry';

export const flightInquiryService = {
  async create(inquiry: Omit<FlightInquiry, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'flightInquiries'), {
      ...inquiry,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async getByUserId(userId: string): Promise<FlightInquiry[]> {
    const q = query(
      collection(db, 'flightInquiries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as FlightInquiry[];
  },

  async getAll(): Promise<FlightInquiry[]> {
    const q = query(
      collection(db, 'flightInquiries'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as FlightInquiry[];
  },
};
