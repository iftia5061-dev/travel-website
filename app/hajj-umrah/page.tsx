'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Star, MapPin, Clock, Users, Check, ArrowRight, X } from 'lucide-react';
import { hajjService, umrahService } from '@/services/hajjService';
import { HajjPackage, UmrahPackage } from '@/types/hajj';

function HajjUmrahPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hajjPackages, setHajjPackages] = useState<HajjPackage[]>([]);
  const [umrahPackages, setUmrahPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPackage, setFilterPackage] = useState('');
  const [filterDeparture, setFilterDeparture] = useState('');
  const [filterTravelers, setFilterTravelers] = useState('');

  // Read query parameters on mount
  useEffect(() => {
    const type = searchParams.get('type') || '';
    const packageParam = searchParams.get('package') || '';
    const departure = searchParams.get('departure') || '';
    const travelers = searchParams.get('travelers') || '';
    
    setFilterType(type);
    setFilterPackage(packageParam);
    setFilterDeparture(departure);
    setFilterTravelers(travelers);
  }, [searchParams]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const [hajjData, umrahData] = await Promise.all([
          hajjService.getAllHajj(),
          umrahService.getAllUmrah(),
        ]);
        setHajjPackages(hajjData);
        setUmrahPackages(umrahData);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const clearFilters = () => {
    setFilterType('');
    setFilterPackage('');
    setFilterDeparture('');
    setFilterTravelers('');
  };

  const filteredHajjPackages = hajjPackages.filter(pkg => {
    if (filterPackage && !pkg.packageType.toLowerCase().includes(filterPackage.toLowerCase())) return false;
    return true;
  });

  const filteredUmrahPackages = umrahPackages.filter(pkg => {
    if (filterPackage && !pkg.packageType.toLowerCase().includes(filterPackage.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Hajj & Umrah Packages</h1>
          <p className="text-xl text-white/90">Premium spiritual journey packages</p>
        </div>
      </section>

      {/* Active Filters */}
      {(filterType || filterPackage || filterDeparture || filterTravelers) && (
        <section className="py-4 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-dark-700">Active Filters:</span>
              {filterType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Type: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  <button onClick={() => setFilterType('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterPackage && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Package: {filterPackage.charAt(0).toUpperCase() + filterPackage.slice(1)}
                  <button onClick={() => setFilterPackage('')} className="hover:text-primary-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterDeparture && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Departure: {filterDeparture}
                  <button onClick={() => setFilterDeparture('')} className="hover:text-primary-700">
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
          </div>
        </section>
      )}

      {/* Hajj Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Hajj Packages</h2>
            <p className="text-xl text-dark-700">Complete Hajj packages with premium services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredHajjPackages.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-dark-700">No Hajj packages found.</p>
              </div>
            ) : (
              filteredHajjPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                    <span className="text-sm uppercase tracking-wider">{pkg.packageType}</span>
                    <h3 className="text-2xl font-bold mt-2">{pkg.name}</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-dark-700 mb-4">
                      <Clock size={18} />
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start space-x-2">
                        <MapPin size={18} className="text-primary mt-1" />
                        <div>
                          <p className="font-semibold text-dark-900">Makkah: {pkg.makkahHotel.name}</p>
                          <p className="font-semibold text-dark-900">Madinah: {pkg.madinahHotel.name}</p>
                        </div>
                      </div>
                      {pkg.visaIncluded && (
                        <div className="flex items-center space-x-2">
                          <Check className="text-secondary" size={18} />
                          <span className="text-dark-700">Visa Included</span>
                        </div>
                      )}
                      {pkg.flightIncluded && (
                        <div className="flex items-center space-x-2">
                          <Check className="text-secondary" size={18} />
                          <span className="text-dark-700">Flight Included</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">৳{pkg.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">/person</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/hajj-umrah/${pkg.id}`)}
                      className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Umrah Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Umrah Packages</h2>
            <p className="text-xl text-dark-700">Flexible Umrah packages throughout the year</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredUmrahPackages.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-dark-700">No Umrah packages found.</p>
              </div>
            ) : (
              filteredUmrahPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
                    <span className="text-sm uppercase tracking-wider">{pkg.packageType}</span>
                    <h3 className="text-2xl font-bold mt-2">{pkg.name}</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-dark-700 mb-4">
                      <Clock size={18} />
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start space-x-2">
                        <MapPin size={18} className="text-secondary mt-1" />
                        <div>
                          <p className="font-semibold text-dark-900">Makkah: {pkg.makkahHotel.name}</p>
                          <p className="font-semibold text-dark-900">Madinah: {pkg.madinahHotel.name}</p>
                        </div>
                      </div>
                      {pkg.visaIncluded && (
                        <div className="flex items-center space-x-2">
                          <Check className="text-primary" size={18} />
                          <span className="text-dark-700">Visa Included</span>
                        </div>
                      )}
                      {pkg.flightIncluded && (
                        <div className="flex items-center space-x-2">
                          <Check className="text-primary" size={18} />
                          <span className="text-dark-700">Flight Included</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-secondary">৳{pkg.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">/person</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/hajj-umrah/${pkg.id}`)}
                      className="w-full py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-dark-900 mb-8 text-center">Important Information</h2>
            <div className="space-y-4">
              {[
                'All packages include visa processing and flight tickets',
                'Hotel accommodations are walking distance from Haram',
                'Professional guides and transportation included',
                '24/7 support during your journey',
                'Flexible payment options available',
                'Group discounts for families and groups',
              ].map((info, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow">
                  <Check className="text-primary" size={20} />
                  <span className="text-dark-700">{info}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function HajjUmrahPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <HajjUmrahPageContent />
    </Suspense>
  );
}
