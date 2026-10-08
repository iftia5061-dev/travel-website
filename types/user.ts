export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  nationality: string;
  passportNumber?: string;
  dateOfBirth?: Date;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  address?: string;
  city?: string;
  country?: string;
  preferences?: string[];
  wishlist: string[];
}
