export interface VisaService {
  id: string;
  country: string;
  countryFlag: string;
  visaTypes: VisaType[];
  processingTime: string;
  requiredDocuments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  processingDays: number;
  requirements: string[];
}

export interface VisaApplication {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  country: string;
  visaType: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  personalInfo: PersonalInfo;
  passportInfo: PassportInfo;
  documents: Document[];
  paymentStatus: 'pending' | 'paid';
  paymentMethod?: string;
  transactionId?: string;
  amount: number;
  submittedAt: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
  notes?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  nationality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

export interface PassportInfo {
  passportNumber: string;
  issueDate: Date;
  expiryDate: Date;
  placeOfIssue: string;
}

export interface Document {
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}
