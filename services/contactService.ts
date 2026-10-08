import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { ContactMessage } from '@/types/contact';

const CONTACT_COLLECTION = 'contactMessages';

export const contactService = {
  // Get all contact messages (Admin)
  getAll: async (): Promise<ContactMessage[]> => {
    const querySnapshot = await getDocs(collection(db, CONTACT_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContactMessage));
  },

  // Get contact message by ID
  getById: async (id: string): Promise<ContactMessage | null> => {
    const docRef = doc(db, CONTACT_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ContactMessage;
    }
    return null;
  },

  // Create contact message
  create: async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
      ...message,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update message status (Admin)
  updateStatus: async (id: string, status: ContactMessage['status']): Promise<void> => {
    const docRef = doc(db, CONTACT_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date()
    });
  },

  // Delete message (Admin)
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, CONTACT_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
