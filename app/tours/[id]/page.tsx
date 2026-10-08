'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { tourService } from '@/services/tourService';
import { bookingService } from '@/services/bookingService';
import { wishlistService } from '@/services/wishlistService';
import { Tour } from '@/types/tour';
import { Booking } from '@/types/booking';
import { useAuth } from '@/hooks/useAuth';
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Check, 
  X, 
  ArrowLeft,
  Heart,
  Share2,
  Camera,
  Bed,
  Car,
  Info
} from 'lucide-react';

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tourId = params.id as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  
  // Booking form state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await tourService.getById(tourId);
        setTour(data);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Tour not found. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  // Check if tour is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (user && tour) {
        try {
          const inWishlist = await wishlistService.isInWishlist(user.uid, tour.id);
          setWishlist(inWishlist);
        } catch (err) {
          console.error('Error checking wishlist:', err);
        }
      }
    };

    checkWishlist();
  }, [user, tour]);

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

    if (!tour) return;

    try {
      if (wishlist) {
        await wishlistService.remove(user.uid, tour.id);
        setWishlist(false);
      } else {
        await wishlistService.add({
          userId: user.uid,
          itemId: tour.id,
          itemType: 'tour',
          itemName: tour.title,
          itemImage: tour.image || tour.images[0],
          price: tour.price,
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

    if (!tour) return;

    setBookingLoading(true);
    setBookingError('');

    try {
      const booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || '',
        type: 'tour',
        serviceId: tour.id,
        serviceName: tour.title,
        travelers: [
          {
            name: customerName,
            age: 25,
            gender: 'male',
            nationality: 'Bangladesh'
          }
        ],
        startDate: new Date(travelDate),
        amount: tour.price * parseInt(travelers),
        currency: 'BDT',
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        bookingStatus: 'pending',
      };

      await bookingService.create(booking);
      setBookingSuccess(true);
      
      // Reset form
      setTravelDate('');
      setTravelers('1');
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

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error || 'Tour not found'}</p>
            <button
              onClick={() => router.push('/tours')}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              Back to Tours
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.push('/tours')}
          className="flex items-center space-x-2 text-dark-700 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Tours</span>
        </button>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative">
            <img
              src={tour.images[selectedImage] || tour.image}
              alt={tour.title}
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
            {tour.images.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${tour.title} ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`w-full h-44 object-cover rounded-xl cursor-pointer transition-all ${
                  selectedImage === index ? 'ring-4 ring-primary' : 'hover:ring-2 ring-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tour Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-dark-700 mb-2">
                <MapPin size={16} />
                <span>{tour.destination}, {tour.country}</span>
              </div>
              <h1 className="text-4xl font-bold text-dark-900 mb-4">{tour.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(tour.rating) ? 'fill-accent text-accent' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm text-dark-700 ml-2">{tour.rating} ({tour.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-dark-700">
                  <Clock size={16} />
                  <span>{tour.duration}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4">
                {tour.oldPrice > tour.price && (
                  <span className="text-xl text-gray-500 line-through">৳{tour.oldPrice.toLocaleString()}</span>
                )}
                <span className="text-4xl font-bold text-primary">৳{tour.price.toLocaleString()}</span>
                {tour.discount > 0 && (
                  <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-semibold">
                    {tour.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Per person</p>
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Overview</h2>
              <p className="text-dark-700 leading-relaxed">{tour.overview}</p>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark-900 mb-2">{day.title}</h3>
                        <p className="text-dark-700 mb-3">{day.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {day.activities.map((activity, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-dark-700 px-2 py-1 rounded-full">
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included & Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                  <Check className="text-secondary" size={24} />
                  <span>Included</span>
                </h3>
                <ul className="space-y-3">
                  {tour.included.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="text-secondary mt-1 flex-shrink-0" size={16} />
                      <span className="text-dark-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                  <X className="text-red-500" size={24} />
                  <span>Excluded</span>
                </h3>
                <ul className="space-y-3">
                  {tour.excluded.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <X className="text-red-500 mt-1 flex-shrink-0" size={16} />
                      <span className="text-dark-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hotel Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                <Bed className="text-primary" size={24} />
                <span>Hotel Information</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-dark-900">{tour.hotelInfo.name}</h4>
                  <p className="text-sm text-dark-700">{tour.hotelInfo.location}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(tour.hotelInfo.rating) ? 'fill-accent text-accent' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tour.hotelInfo.amenities.map((amenity, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-dark-700 px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Transport Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                <Car className="text-primary" size={24} />
                <span>Transport Information</span>
              </h3>
              <div>
                <p className="font-semibold text-dark-900">{tour.transportInfo.type}</p>
                <p className="text-dark-700 mt-2">{tour.transportInfo.details}</p>
                {tour.transportInfo.included && (
                  <div className="flex items-center space-x-2 mt-2 text-sm text-secondary">
                    <Check size={16} />
                    <span>Included in package</span>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                <Info className="text-amber-600" size={24} />
                <span>Important Notes</span>
              </h3>
              <p className="text-dark-700 leading-relaxed">{tour.importantNotes}</p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Book This Tour</h3>
              
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
                      <p className="text-sm text-amber-800 mb-2">Please login to book this tour</p>
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
                    <label className="block text-sm font-medium text-dark-700 mb-2">Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      min="1"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
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

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-dark-700">Price per person</span>
                      <span className="font-semibold">৳{tour.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-primary">
                      <span>Total</span>
                      <span>৳{(tour.price * parseInt(travelers)).toLocaleString()}</span>
                    </div>
                  </div>

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
