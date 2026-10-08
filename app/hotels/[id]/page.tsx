'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { wishlistService } from '@/services/wishlistService';
import { Hotel } from '@/types/hotel';
import { Booking } from '@/types/booking';
import { useAuth } from '@/hooks/useAuth';
import { 
  Star, 
  MapPin, 
  Users, 
  Check, 
  ArrowLeft,
  Heart,
  Share2,
  Camera,
  Bed,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Waves,
  Snowflake,
  Dumbbell,
  Calendar
} from 'lucide-react';

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const hotelId = params.id as string;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  
  // Booking form state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getById(hotelId);
        setHotel(data);
        if (data && data.rooms && data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0].id);
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError('Hotel not found. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotel();
    }
  }, [hotelId]);

  // Check if hotel is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (user && hotel) {
        try {
          const inWishlist = await wishlistService.isInWishlist(user.uid, hotel.id);
          setWishlist(inWishlist);
        } catch (err) {
          console.error('Error checking wishlist:', err);
        }
      }
    };

    checkWishlist();
  }, [user, hotel]);

  // Pre-fill customer info from auth
  useEffect(() => {
    if (user) {
      setCustomerName(user.displayName || '');
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  const toggleWishlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!hotel || !selectedRoomData) return;

    try {
      if (wishlist) {
        await wishlistService.remove(user.uid, hotel.id);
        setWishlist(false);
      } else {
        await wishlistService.add({
          userId: user.uid,
          itemId: hotel.id,
          itemType: 'hotel',
          itemName: hotel.name,
          itemImage: hotel.images[0],
          price: selectedRoomData.pricePerNight,
        });
        setWishlist(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (!hotel || !selectedRoomData) return;

    setBookingLoading(true);
    setBookingError('');

    try {
      const booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || '',
        type: 'hotel',
        serviceId: hotel.id,
        serviceName: hotel.name,
        travelers: [
          {
            name: customerName,
            age: 25,
            gender: 'male',
            nationality: 'Bangladesh'
          }
        ],
        startDate: new Date(checkIn),
        endDate: new Date(checkOut),
        amount: totalPrice,
        currency: 'BDT',
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        bookingStatus: 'pending',
      };

      await bookingService.create(booking);
      setBookingSuccess(true);
      
      // Reset form
      setCheckIn('');
      setCheckOut('');
      setGuests('2');
      setCustomerPhone('');
    } catch (err) {
      console.error('Error creating booking:', err);
      setBookingError('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error || 'Hotel not found'}</p>
            <button
              onClick={() => router.push('/hotels')}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              Back to Hotels
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedRoomData = hotel.rooms.find(r => r.id === selectedRoom);
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  const totalPrice = selectedRoomData ? selectedRoomData.pricePerNight * Math.max(nights, 1) : 0;

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return Wifi;
    if (lower.includes('parking')) return Car;
    if (lower.includes('pool')) return Waves;
    if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('restaurant') || lower.includes('food')) return Utensils;
    if (lower.includes('coffee') || lower.includes('breakfast')) return Coffee;
    if (lower.includes('air') || lower.includes('ac')) return Snowflake;
    return Check;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.push('/hotels')}
          className="flex items-center space-x-2 text-dark-700 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Hotels</span>
        </button>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative">
            <img
              src={hotel.images[selectedImage] || hotel.images[0]}
              alt={hotel.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={toggleWishlist}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Heart 
                  size={20} 
                  className={wishlist ? 'fill-red-500 text-red-500' : 'text-dark-700'} 
                />
              </button>
              <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Share2 size={20} className="text-dark-700" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {hotel.images.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${hotel.name} ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`w-full h-44 object-cover rounded-xl cursor-pointer transition-all ${
                  selectedImage === index ? 'ring-4 ring-primary' : 'hover:ring-2 ring-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-dark-700 mb-2">
                <MapPin size={16} />
                <span>{hotel.location}, {hotel.city}, {hotel.country}</span>
              </div>
              <h1 className="text-4xl font-bold text-dark-900 mb-4">{hotel.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(hotel.rating) ? 'fill-accent text-accent' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm text-dark-700 ml-2">{hotel.rating} ({hotel.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">About This Hotel</h2>
              <p className="text-dark-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                <Star className="text-primary" size={24} />
                <span>Amenities</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className="text-primary" size={18} />
                      <span className="text-sm text-dark-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Types */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
                      selectedRoom === room.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark-900 mb-2">{room.name}</h3>
                        <p className="text-sm text-dark-700 mb-3">{room.type}</p>
                        <div className="flex items-center space-x-4 text-sm text-dark-700 mb-3">
                          <div className="flex items-center space-x-1">
                            <Users size={16} />
                            <span>{room.capacity} guests</span>
                          </div>
                          {room.available ? (
                            <span className="text-green-600">Available</span>
                          ) : (
                            <span className="text-red-600">Sold Out</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-dark-700 px-2 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-primary">৳{room.pricePerNight.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">/night</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Book This Hotel</h3>
              
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-dark-900 mb-2">Booking Submitted!</h4>
                  <p className="text-dark-700 mb-4">Your booking request has been submitted successfully. We will contact you shortly.</p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {!user && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-amber-800 mb-2">Please login to book this hotel</p>
                      <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="text-sm font-semibold text-amber-800 hover:text-amber-900"
                      >
                        Login Now →
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {selectedRoomData && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-dark-700">Room</span>
                        <span className="font-semibold">{selectedRoomData.name}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-dark-700">Price per night</span>
                        <span className="font-semibold">৳{selectedRoomData.pricePerNight.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-dark-700">Nights</span>
                        <span className="font-semibold">{Math.max(nights, 1)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-primary">
                        <span>Total</span>
                        <span>৳{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-sm text-red-600">{bookingError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading || !user}
                    className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Book Now</span>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    By booking, you agree to our terms and conditions
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
