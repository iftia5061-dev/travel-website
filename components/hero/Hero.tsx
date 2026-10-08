'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Users, MapPin, Plane, FileText, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { flightInquiryService } from '@/services/flightInquiryService';
import { visaService as visaServiceApi } from '@/services/visaService';
import { VisaService } from '@/types/visa';

export default function Hero() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tours' | 'hotels' | 'flights' | 'visa' | 'hajj-umrah'>('tours');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visaServices, setVisaServices] = useState<VisaService[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    travelers: '1',
    from: '',
    to: '',
    departure: '',
    return: '',
    country: '',
    visaType: '',
    package: '',
    packageType: 'hajj',
  });

  // Load visa services
  useEffect(() => {
    const loadVisaServices = async () => {
      try {
        const services = await visaServiceApi.getAllServices();
        setVisaServices(services);
      } catch (error) {
        console.error('Error loading visa services:', error);
      }
    };
    loadVisaServices();
  }, []);

  const handleTabChange = (tabId: 'tours' | 'hotels' | 'flights' | 'visa' | 'hajj-umrah') => {
    setActiveTab(tabId);
    setErrors({}); // Clear errors when switching tabs
  };

  const tabs = [
    { id: 'tours', label: 'Tours' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'flights', label: 'Flights' },
    { id: 'visa', label: 'Visa' },
    { id: 'hajj-umrah', label: 'Hajj & Umrah' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (activeTab === 'tours') {
      if (!formData.destination.trim()) {
        newErrors.destination = 'Destination is required';
      }
      if (!formData.checkIn) {
        newErrors.checkIn = 'Travel date is required';
      }
      if (!formData.travelers || parseInt(formData.travelers) < 1) {
        newErrors.travelers = 'At least 1 traveler required';
      }
    } else if (activeTab === 'hotels') {
      if (!formData.destination.trim()) {
        newErrors.destination = 'Destination is required';
      }
      if (!formData.checkIn) {
        newErrors.checkIn = 'Check-in date is required';
      }
      if (!formData.checkOut) {
        newErrors.checkOut = 'Check-out date is required';
      }
      if (formData.checkIn && formData.checkOut && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = 'Check-out must be after check-in';
      }
      if (!formData.travelers || parseInt(formData.travelers) < 1) {
        newErrors.travelers = 'At least 1 guest required';
      }
    } else if (activeTab === 'flights') {
      if (!formData.from.trim()) {
        newErrors.from = 'Departure location is required';
      }
      if (!formData.to.trim()) {
        newErrors.to = 'Arrival location is required';
      }
      if (formData.from.trim() === formData.to.trim()) {
        newErrors.to = 'Arrival location must be different from departure';
      }
      if (!formData.departure) {
        newErrors.departure = 'Departure date is required';
      }
      if (!formData.travelers || parseInt(formData.travelers) < 1) {
        newErrors.travelers = 'At least 1 passenger required';
      }
    } else if (activeTab === 'visa') {
      if (!formData.country) {
        newErrors.country = 'Please select a country';
      }
      if (!formData.visaType) {
        newErrors.visaType = 'Please select a visa type';
      }
    } else if (activeTab === 'hajj-umrah') {
      if (!formData.package) {
        newErrors.package = 'Please select a package';
      }
      if (!formData.checkIn) {
        newErrors.checkIn = 'Departure date is required';
      }
      if (!formData.travelers || parseInt(formData.travelers) < 1) {
        newErrors.travelers = 'At least 1 traveler required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }

    if (activeTab === 'tours') {
      setLoading(true);
      const params = new URLSearchParams();
      if (formData.destination) params.append('destination', formData.destination);
      if (formData.checkIn) params.append('date', formData.checkIn);
      if (formData.travelers) params.append('travelers', formData.travelers);
      router.push(`/tours?${params.toString()}`);
      setLoading(false);
    } else if (activeTab === 'hotels') {
      setLoading(true);
      const params = new URLSearchParams();
      if (formData.destination) params.append('destination', formData.destination);
      if (formData.checkIn) params.append('checkIn', formData.checkIn);
      if (formData.checkOut) params.append('checkOut', formData.checkOut);
      if (formData.travelers) params.append('guests', formData.travelers);
      router.push(`/hotels?${params.toString()}`);
      setLoading(false);
    } else if (activeTab === 'flights') {
      setLoading(true);
      try {
        await flightInquiryService.create({
          userId: user?.uid,
          from: formData.from,
          to: formData.to,
          departure: formData.departure,
          return: formData.return,
          travelers: formData.travelers,
          status: 'pending',
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } catch (error) {
        console.error('Error submitting flight inquiry:', error);
        alert('Failed to submit inquiry. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'visa') {
      setLoading(true);
      if (!user) {
        router.push('/login');
        setLoading(false);
        return;
      }
      // Find the visa service by country
      const selectedService = visaServices.find(service => 
        service.country.toLowerCase() === formData.country.toLowerCase()
      );
      if (selectedService) {
        router.push(`/visa/${selectedService.id}`);
      } else {
        // Fallback to country filter if no exact match
        router.push(`/visa?country=${formData.country}`);
      }
      setLoading(false);
    } else if (activeTab === 'hajj-umrah') {
      setLoading(true);
      const params = new URLSearchParams();
      if (formData.packageType) params.append('type', formData.packageType);
      if (formData.package) params.append('package', formData.package);
      if (formData.checkIn) params.append('departure', formData.checkIn);
      if (formData.travelers) params.append('travelers', formData.travelers);
      router.push(`/hajj-umrah?${params.toString()}`);
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'tours':
        return (
          <>
            <div className="relative">
              <label className="block text-sm md:text-sm font-medium text-dark-700 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  placeholder="Select date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.travelers ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4+ Travelers</option>
                </select>
              </div>
              {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>}
            </div>
          </>
        );

      case 'hotels':
        return (
          <>
            <div className="relative">
              <label className="block text-sm md:text-sm font-medium text-dark-700 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Where do you want to stay?"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm ${errors.checkOut ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Adults / Rooms</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.travelers ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
              {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>}
            </div>
          </>
        );

      case 'flights':
        return (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">From</label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Airport/city"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${errors.from ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Airport/city"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${errors.to ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Departure</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.departure}
                  onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${errors.departure ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.departure && <p className="text-red-500 text-sm mt-1">{errors.departure}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.return}
                  onChange={(e) => setFormData({ ...formData, return: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.travelers ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4+ Passengers</option>
                </select>
              </div>
              {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>}
            </div>
          </>
        );

      case 'visa':
        return (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Country</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Country</option>
                  {visaServices.map((service) => (
                    <option key={service.id} value={service.country}>
                      {service.country}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Visa Type</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.visaType}
                  onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.visaType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Visa Type</option>
                  {visaServices
                    .find(s => s.country.toLowerCase() === formData.country.toLowerCase())
                    ?.visaTypes.map((type) => (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    )) || <option value="tourist">Tourist Visa</option>}
                </select>
              </div>
              {errors.visaType && <p className="text-red-500 text-sm mt-1">{errors.visaType}</p>}
            </div>
          </>
        );

      case 'hajj-umrah':
        return (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Package Type</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm"
                >
                  <option value="hajj">Hajj</option>
                  <option value="umrah">Umrah</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Package</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.package ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Package</option>
                  <option value="economy">Economy</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              {errors.package && <p className="text-red-500 text-sm mt-1">{errors.package}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Departure Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark-700 mb-2">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 md:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-base md:text-sm ${errors.travelers ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4+ Travelers</option>
                </select>
              </div>
              {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')] bg-cover bg-center opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Explore The World With Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Discover amazing destinations, unforgettable tours and hassle-free travel services.
          </p>
        </div>

        {/* Booking Search Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8">
          {/* Tabs */}
          <div className="flex gap-3 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide md:overflow-visible md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold transition-all whitespace-nowrap flex-shrink-0 text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-dark-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Inquiry Submitted!</h3>
              <p className="text-green-700">Your flight inquiry has been submitted. Our travel team will contact you shortly.</p>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 gap-4 ${activeTab === 'hotels' || activeTab === 'flights' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                {renderForm()}
              </div>

              {/* Search Button */}
              <div className="mt-4">
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-4 md:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-sm min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{activeTab === 'flights' ? 'Submitting...' : 'Searching...'}</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>{activeTab === 'hajj-umrah' ? 'View Packages' : `Search ${activeTab === 'tours' ? 'Tours' : activeTab === 'hotels' ? 'Hotels' : activeTab === 'flights' ? 'Flights' : activeTab === 'visa' ? 'Visa' : 'Packages'}`}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
