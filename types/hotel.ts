export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  city: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  amenities: string[];
  rooms: Room[];
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  available: boolean;
  images: string[];
}
