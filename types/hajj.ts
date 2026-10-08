export interface HajjPackage {
  id: string;
  name: string;
  type: 'Hajj';
  packageType: 'economy' | 'standard' | 'premium' | 'vip';
  duration: number;
  price: number;
  currency: string;
  images: string[];
  makkahHotel: HotelInfo;
  madinahHotel: HotelInfo;
  transport: TransportInfo;
  visaIncluded: boolean;
  flightIncluded: boolean;
  itinerary: ItineraryDay[];
  included: string[];
  exclusions: string[];
  notes: string;
  available: boolean;
  featured: boolean;
  departureDates: Date[];
  maxTravelers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UmrahPackage {
  id: string;
  name: string;
  type: 'Umrah';
  packageType: 'economy' | 'standard' | 'premium' | 'vip';
  duration: number;
  price: number;
  currency: string;
  images: string[];
  makkahHotel: HotelInfo;
  madinahHotel: HotelInfo;
  transport: TransportInfo;
  visaIncluded: boolean;
  flightIncluded: boolean;
  itinerary: ItineraryDay[];
  included: string[];
  exclusions: string[];
  notes: string;
  available: boolean;
  featured: boolean;
  departureDates: Date[];
  maxTravelers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelInfo {
  name: string;
  rating: number;
  distanceToHaram: string;
  roomType: string;
  meals: string[];
  amenities: string[];
}

export interface TransportInfo {
  type: string;
  details: string;
  included: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}
