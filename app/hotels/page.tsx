'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { hotelService } from '@/services/hotelService';
import { wishlistService } from '@/services/wishlistService';
import { Hotel } from '@/types/hotel';
import { useAuth } from '@/hooks/useAuth';
import { Search, Star, MapPin, Calendar, Users, ArrowRight, Heart, X } from 'lucide-react';

function HotelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [filterDestination, setFilterDestination] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState('');
  const [filterCheckOut, setFilterCheckOut] = useState('');
  const [filterGuests, setFilterGuests] = useState('');

  // Read query parameters on mount
  useEffect(() => {
    const destination = searchParams.get('destination') || '';
    const checkInParam = searchParams.get('checkIn') || '';
    const checkOutParam = searchParams.get('checkOut') || '';
    const guestsParam = searchParams.get('guests') || '';
    
    setFilterDestination(destination);
    setFilterCheckIn(checkInParam);
    setFilterCheckOut(checkOutParam);
    setFilterGuests(guestsParam);
    setSearchQuery(destination);
    setCheckIn(checkInParam);
    setCheckOut(checkOutParam);
    setGuests(guestsParam || '2');
  }, [searchParams]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getAll();
        setHotels(data);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const items = await wishlistService.getByUserId(user.uid);
          const itemIds = new Set(items.map(item => item.itemId));
          setWishlistItems(itemIds);
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (hotelId: string, hotelName: string, hotelImage: string, hotelPrice: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (wishlistItems.has(hotelId)) {
        await wishlistService.remove(user.uid, hotelId);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(hotelId);
          return newSet;
        });
      } else {
        await wishlistService.add({
          userId: user.uid,
          itemId: hotelId,
          itemType: 'hotel',
          itemName: hotelName,
          itemImage: hotelImage,
          price: hotelPrice,
        });
        setWishlistItems(prev => new Set([...prev, hotelId]));
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const filteredHotels = hotels.filter(hotel => 
    searchQuery === '' || 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
    setFilterDestination('');
    setFilterCheckIn('');
    setFilterCheckOut('');
    setFilterGuests('');
    setSearchQuery('');
    setCheckIn('');
    setCheckOut('');
    setGuests('2');
    router.push('/hotels');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Find Hotels</h1>
          <p className="text-xl text-white/90">Discover premium accommodations worldwide</p>
        </div>
      </section>

      {/* Search Box */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Filters */}
          {(filterDestination || filterCheckIn || filterCheckOut || filterGuests) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-dark-700">Active Filters:</span>
              {filterDestination && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Destination: {filterDestination}
                  <button onClick={() => setFilterDestination('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterCheckIn && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Check-in: {filterCheckIn}
                  <button onClick={() => setFilterCheckIn('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterCheckOut && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Check-out: {filterCheckOut}
                  <button onClick={() => setFilterCheckOut('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterGuests && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Guests: {filterGuests}
                  <button onClick={() => setFilterGuests('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-700">No hotels found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={hotel.images[0] || ''}
                      alt={hotel.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {hotel.featured && (
                      <span className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    )}
                    <button 
                      onClick={() => toggleWishlist(hotel.id, hotel.name, hotel.images[0], hotel.rooms[0]?.pricePerNight || 0)}
                      className={`absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors ${
                        wishlistItems.has(hotel.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart size={20} className={wishlistItems.has(hotel.id) ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-dark-700 mb-2">
                      <MapPin size={16} />
                      <span>{hotel.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(hotel.rating) ? 'fill-accent text-accent' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-sm text-dark-700 ml-2">{hotel.rating} ({hotel.reviewCount})</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="text-xs bg-gray-100 text-dark-700 px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-primary">৳{hotel.rooms[0]?.pricePerNight?.toLocaleString() || 0}</span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => router.push(`/hotels/${hotel.id}`)}
                        className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Book Now</span>
                        <ArrowRight size={16} />
                      </button>
                      <button 
                        onClick={() => router.push(`/hotels/${hotel.id}`)}
                        className="px-4 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary-5 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <HotelsPageContent />
    </Suspense>
  );
}
