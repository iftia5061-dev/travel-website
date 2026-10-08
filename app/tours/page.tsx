'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { tourService } from '@/services/tourService';
import { wishlistService } from '@/services/wishlistService';
import { Tour } from '@/types/tour';
import { useAuth } from '@/hooks/useAuth';
import { Search, Star, Heart, MapPin, Clock, ArrowRight, X } from 'lucide-react';

function ToursPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [filterDestination, setFilterDestination] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTravelers, setFilterTravelers] = useState('');

  const categories = ['all', 'adventure', 'beach', 'cultural', 'family', 'romantic'];

  // Read query parameters on mount
  useEffect(() => {
    const destination = searchParams.get('destination') || '';
    const date = searchParams.get('date') || '';
    const travelers = searchParams.get('travelers') || '';
    
    setFilterDestination(destination);
    setFilterDate(date);
    setFilterTravelers(travelers);
    setSearchQuery(destination);
  }, [searchParams]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await tourService.getAll();
        setTours(data);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to load tours. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
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

  const toggleWishlist = async (tourId: string, tourTitle: string, tourImage: string, tourPrice: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (wishlistItems.has(tourId)) {
        await wishlistService.remove(user.uid, tourId);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(tourId);
          return newSet;
        });
      } else {
        await wishlistService.add({
          userId: user.uid,
          itemId: tourId,
          itemType: 'tour',
          itemName: tourTitle,
          itemImage: tourImage,
          price: tourPrice,
        });
        setWishlistItems(prev => new Set([...prev, tourId]));
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDestination = filterDestination === '' || 
      tour.destination.toLowerCase().includes(filterDestination.toLowerCase()) ||
      tour.country.toLowerCase().includes(filterDestination.toLowerCase());
    return matchesCategory && matchesSearch && matchesDestination;
  });

  const clearFilters = () => {
    setFilterDestination('');
    setFilterDate('');
    setFilterTravelers('');
    setSearchQuery('');
    router.push('/tours');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Tour Packages</h1>
          <p className="text-xl text-white/90">Discover amazing destinations and unforgettable experiences</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Filters */}
          {(filterDestination || filterDate || filterTravelers) && (
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
              {filterDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Date: {filterDate}
                  <button onClick={() => setFilterDate('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterTravelers && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Travelers: {filterTravelers}
                  <button onClick={() => setFilterTravelers('')} className="hover:text-primary-700">
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
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-dark-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
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
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-700">No tours found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {tour.featured && (
                      <span className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    )}
                    <button 
                      onClick={() => toggleWishlist(tour.id, tour.title, tour.image || tour.images[0], tour.price)}
                      className={`absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors ${
                        wishlistItems.has(tour.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart size={20} className={wishlistItems.has(tour.id) ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-dark-700 mb-2">
                      <MapPin size={16} />
                      <span>{tour.destination}</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">{tour.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-dark-700 mb-3">
                      <Clock size={16} />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(tour.rating) ? 'fill-accent text-accent' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-sm text-dark-700 ml-2">{tour.rating} ({tour.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-primary">৳{tour.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">৳{tour.oldPrice.toLocaleString()}</span>
                      </div>
                      <span className="text-sm text-accent font-semibold">{tour.discount}% OFF</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/tours/${tour.id}`)}
                      className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight size={16} />
                    </button>
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

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ToursPageContent />
    </Suspense>
  );
}
