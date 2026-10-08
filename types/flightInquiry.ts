export interface FlightInquiry {
  id?: string;
  userId?: string;
  from: string;
  to: string;
  departure: string;
  return?: string;
  travelers: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
