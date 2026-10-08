import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { WishlistItem } from '@/types/wishlist';

const WISHLIST_COLLECTION = 'wishlists';

export const wishlistService = {
  // Get all wishlist items for a user
  getByUserId: async (userId: string): Promise<WishlistItem[]> => {
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WishlistItem));
  },

  // Check if item is in wishlist
  isInWishlist: async (userId: string, itemId: string): Promise<boolean> => {
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where('userId', '==', userId),
      where('itemId', '==', itemId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  // Add item to wishlist
  add: async (item: Omit<WishlistItem, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, WISHLIST_COLLECTION), {
      ...item,
      createdAt: new Date()
    });
    return docRef.id;
  },

  // Remove item from wishlist
  remove: async (userId: string, itemId: string): Promise<void> => {
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where('userId', '==', userId),
      where('itemId', '==', itemId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await deleteDoc(doc.ref);
    }
  },

  // Delete wishlist item by ID
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, WISHLIST_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
