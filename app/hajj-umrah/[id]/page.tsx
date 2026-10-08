'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Star, MapPin, Clock, Users, Check, ArrowRight, Calendar, Heart } from 'lucide-react';
import { getPackageById } from '@/services/hajjService';
import { HajjPackage, UmrahPackage } from '@/types/hajj';
import { useAuth } from '@/hooks/useAuth';
import { wishlistService } from '@/services/wishlistService';

function PackageDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [packageData, setPackageData] = useState<HajjPackage | UmrahPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const packageId = params.id as string;
        const data = await getPackageById(packageId);
        setPackageData(data);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (user && packageData) {
        try {
          const items = await wishlistService.getByUserId(user.uid);
          setIsWishlisted(items.some(item => item.itemId === packageData.id));
        } catch (err) {
          console.error('Error checking wishlist:', err);
        }
      }
    };

    checkWishlist();
  }, [user, packageData]);

  const toggleWishlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!packageData) return;

    try {
      if (isWishlisted) {
        await wishlistService.remove(user.uid, packageData.id);
        setIsWishlisted(false);
      } else {
        await wishlistService.add({
          userId: user.uid,
          itemId: packageData.id,
          itemType: packageData.type === 'Hajj' ? 'hajj' : 'umrah',
          itemName: packageData.name,
          itemImage: packageData.images?.[0] || '',
          price: packageData.price,
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error || 'Package not found'}</p>
      </div>
    );
  }

  const isHajj = 'makkahHotel' in packageData;
  const images = packageData.images || [];
  const mainImage = images[selectedImage] || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{packageData.name}</h1>
          <p className="text-xl text-white/90">{isHajj ? 'Hajj' : 'Umrah'} Package</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="relative mb-4">
                  <img
                    src={mainImage}
                    alt={packageData.name}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  <button 
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart 
                      size={24} 
                      className={isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`rounded-lg overflow-hidden ring-2 ${
                        selectedImage === index ? 'ring-primary' : 'ring-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${packageData.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Package Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-2 text-dark-700 mb-4">
                <Clock size={20} />
                <span className="text-lg">{packageData.duration} Days</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Makkah: {isHajj ? (packageData as HajjPackage).makkahHotel.name : (packageData as UmrahPackage).makkahHotel.name}</p>
                    <p className="font-semibold text-dark-900">Madinah: {isHajj ? (packageData as HajjPackage).madinahHotel.name : (packageData as UmrahPackage).madinahHotel.name}</p>
                  </div>
                </div>
                {packageData.visaIncluded && (
                  <div className="flex items-center space-x-2">
                    <Check className="text-secondary" size={20} />
                    <span className="text-dark-700">Visa Included</span>
                  </div>
                )}
                {packageData.flightIncluded && (
                  <div className="flex items-center space-x-2">
                    <Check className="text-secondary" size={20} />
                    <span className="text-dark-700">Flight Included</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark-900 mb-4">Package Includes</h3>
                <ul className="space-y-2">
                  {packageData.included?.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="text-green-600" size={16} />
                      <span className="text-dark-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-dark-900 mb-4">Important Notes</h3>
                <p className="text-dark-700">{packageData.notes || 'Please ensure you have a valid passport and all required documents before booking.'}</p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">৳{packageData.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">/person</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Departure Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Number of Travelers</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                    <option value="1">1 Traveler</option>
                    <option value="2">2 Travelers</option>
                    <option value="3">3 Travelers</option>
                    <option value="4">4+ Travelers</option>
                  </select>
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                <span>Book Now</span>
                <ArrowRight size={16} />
              </button>

              {!user && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  You need to login to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function PackageDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PackageDetailContent />
    </Suspense>
  );
}
