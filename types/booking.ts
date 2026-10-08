export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: 'tour' | 'hotel' | 'hajj' | 'umrah' | 'flight';
  serviceId: string;
  serviceName: string;
  travelers: Traveler[];
  startDate: Date;
  endDate?: Date;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Traveler {
  name: string;
  age: number;
  gender: 'male' | 'female';
  passportNumber?: string;
  nationality: string;
}
