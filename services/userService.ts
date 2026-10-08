import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '@/types/user';

const USERS_COLLECTION = 'users';

export const userService = {
  // Get user by ID
  getById: async (userId: string): Promise<User | null> => {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  // Create or update user profile
  createOrUpdate: async (userId: string, userData: Partial<User>): Promise<void> => {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing user
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date()
      });
    } else {
      // Create new user
      await setDoc(docRef, {
        ...userData,
        isAdmin: userData.email === 'admin@travelwebsite.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  },

  // Update user profile
  update: async (userId: string, userData: Partial<User>): Promise<void> => {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date()
    });
  }
};
