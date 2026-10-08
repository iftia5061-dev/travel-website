export interface Tour {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: string;
  durationDays: number;
  rating: number;
  reviewCount: number;
  oldPrice: number;
  price: number;
  discount: number;
  image: string;
  images: string[];
  overview: string;
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  hotelInfo: HotelInfo;
  transportInfo: TransportInfo;
  importantNotes: string;
  featured: boolean;
  available: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface HotelInfo {
  name: string;
  location: string;
  rating: number;
  amenities: string[];
}

export interface TransportInfo {
  type: string;
  included: boolean;
  details: string;
}
