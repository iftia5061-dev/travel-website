import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { VisaService, VisaApplication } from '@/types/visa';

const VISA_SERVICES_COLLECTION = 'visaServices';
const VISA_APPLICATIONS_COLLECTION = 'visaApplications';

export const visaService = {
  // Get all visa services
  getAllServices: async (): Promise<VisaService[]> => {
    const querySnapshot = await getDocs(collection(db, VISA_SERVICES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VisaService));
  },

  // Get visa service by country
  getByCountry: async (country: string): Promise<VisaService | null> => {
    const q = query(collection(db, VISA_SERVICES_COLLECTION), where('country', '==', country));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as VisaService;
    }
    return null;
  },

  // Get visa service by ID
  getById: async (id: string): Promise<VisaService | null> => {
    const docRef = doc(db, VISA_SERVICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VisaService;
    }
    return null;
  },

  // Create visa service (Admin)
  createService: async (service: Omit<VisaService, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, VISA_SERVICES_COLLECTION), {
      ...service,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Get all visa applications (Admin)
  getAllApplications: async (): Promise<VisaApplication[]> => {
    const querySnapshot = await getDocs(collection(db, VISA_APPLICATIONS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VisaApplication));
  },

  // Get applications by user ID
  getApplicationsByUserId: async (userId: string): Promise<VisaApplication[]> => {
    const q = query(
      collection(db, VISA_APPLICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VisaApplication));
  },

  // Get application by ID
  getApplicationById: async (id: string): Promise<VisaApplication | null> => {
    const docRef = doc(db, VISA_APPLICATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VisaApplication;
    }
    return null;
  },

  // Create visa application
  createApplication: async (application: Omit<VisaApplication, 'id' | 'submittedAt' | 'reviewedAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, VISA_APPLICATIONS_COLLECTION), {
      ...application,
      submittedAt: new Date()
    });
    return docRef.id;
  },

  // Update application status (Admin)
  updateApplicationStatus: async (id: string, status: VisaApplication['status'], rejectionReason?: string): Promise<void> => {
    const docRef = doc(db, VISA_APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      rejectionReason,
      reviewedAt: new Date()
    });
  },

  // Delete visa service (Admin)
  deleteService: async (id: string): Promise<void> => {
    const docRef = doc(db, VISA_SERVICES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
