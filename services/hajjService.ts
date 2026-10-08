import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { HajjPackage, UmrahPackage } from '@/types/hajj';

const HAJJ_PACKAGES_COLLECTION = 'hajjPackages';
const UMRAH_PACKAGES_COLLECTION = 'umrahPackages';

// Helper function to get package by ID from either collection
export const getPackageById = async (id: string): Promise<HajjPackage | UmrahPackage | null> => {
  // Try Hajj first
  const hajjRef = doc(db, HAJJ_PACKAGES_COLLECTION, id);
  const hajjSnap = await getDoc(hajjRef);
  if (hajjSnap.exists()) {
    return { id: hajjSnap.id, ...hajjSnap.data() } as HajjPackage;
  }
  
  // Try Umrah
  const umrahRef = doc(db, UMRAH_PACKAGES_COLLECTION, id);
  const umrahSnap = await getDoc(umrahRef);
  if (umrahSnap.exists()) {
    return { id: umrahSnap.id, ...umrahSnap.data() } as UmrahPackage;
  }
  
  return null;
};

export const hajjService = {
  // Get all Hajj packages
  getAllHajj: async (): Promise<HajjPackage[]> => {
    const querySnapshot = await getDocs(collection(db, HAJJ_PACKAGES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HajjPackage));
  },

  // Get featured Hajj packages
  getFeaturedHajj: async (): Promise<HajjPackage[]> => {
    const q = query(
      collection(db, HAJJ_PACKAGES_COLLECTION),
      where('featured', '==', true),
      where('available', '==', true),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HajjPackage));
  },

  // Get Hajj package by ID
  getHajjById: async (id: string): Promise<HajjPackage | null> => {
    const docRef = doc(db, HAJJ_PACKAGES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HajjPackage;
    }
    return null;
  },

  // Get Hajj package by ID (alias for consistency)
  getById: async (id: string): Promise<HajjPackage | null> => {
    return hajjService.getHajjById(id);
  },

  // Create Hajj package (Admin)
  createHajj: async (pkg: Omit<HajjPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, HAJJ_PACKAGES_COLLECTION), {
      ...pkg,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update Hajj package (Admin)
  updateHajj: async (id: string, pkg: Partial<HajjPackage>): Promise<void> => {
    const docRef = doc(db, HAJJ_PACKAGES_COLLECTION, id);
    await updateDoc(docRef, {
      ...pkg,
      updatedAt: new Date()
    });
  },

  // Delete Hajj package (Admin)
  deleteHajj: async (id: string): Promise<void> => {
    const docRef = doc(db, HAJJ_PACKAGES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};

export const umrahService = {
  // Get all Umrah packages
  getAllUmrah: async (): Promise<UmrahPackage[]> => {
    const querySnapshot = await getDocs(collection(db, UMRAH_PACKAGES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UmrahPackage));
  },

  // Get featured Umrah packages
  getFeaturedUmrah: async (): Promise<UmrahPackage[]> => {
    const q = query(
      collection(db, UMRAH_PACKAGES_COLLECTION),
      where('featured', '==', true),
      where('available', '==', true),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UmrahPackage));
  },

  // Get Umrah package by ID
  getUmrahById: async (id: string): Promise<UmrahPackage | null> => {
    const docRef = doc(db, UMRAH_PACKAGES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UmrahPackage;
    }
    return null;
  },

  // Get Umrah package by ID (alias for consistency)
  getById: async (id: string): Promise<UmrahPackage | null> => {
    return umrahService.getUmrahById(id);
  },

  // Create Umrah package (Admin)
  createUmrah: async (pkg: Omit<UmrahPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, UMRAH_PACKAGES_COLLECTION), {
      ...pkg,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update Umrah package (Admin)
  updateUmrah: async (id: string, pkg: Partial<UmrahPackage>): Promise<void> => {
    const docRef = doc(db, UMRAH_PACKAGES_COLLECTION, id);
    await updateDoc(docRef, {
      ...pkg,
      updatedAt: new Date()
    });
  },

  // Delete Umrah package (Admin)
  deleteUmrah: async (id: string): Promise<void> => {
    const docRef = doc(db, UMRAH_PACKAGES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
