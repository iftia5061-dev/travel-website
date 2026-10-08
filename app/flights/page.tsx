'use client';

import { useState } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Plane, Calendar, MapPin, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { flightInquiryService } from '@/services/flightInquiryService';

export default function FlightsPage() {
  const { user } = useAuth();
  const [tripType, setTripType] = useState('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [flightClass, setFlightClass] = useState('economy');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!from || !to || !departure) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await flightInquiryService.create({
        userId: user?.uid,
        from,
        to,
        departure,
        return: tripType === 'roundtrip' ? returnDate : undefined,
        travelers: passengers,
        status: 'pending',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      setFrom('');
      setTo('');
      setDeparture('');
      setReturnDate('');
      setPassengers('1');
    } catch (error) {
      console.error('Error submitting flight inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Flight Booking</h1>
          <p className="text-xl text-white/90">Find the best flight deals for your journey</p>
        </div>
      </section>

      {/* Flight Search Form */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8">
            {/* Trip Type */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setTripType('roundtrip')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  tripType === 'roundtrip' ? 'bg-primary text-white' : 'bg-white text-dark-700'
                }`}
              >
                Round Trip
              </button>
              <button
                onClick={() => setTripType('oneway')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  tripType === 'oneway' ? 'bg-primary text-white' : 'bg-white text-dark-700'
                }`}
              >
                One Way
              </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-dark-700 mb-2">From</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 rotate-[-45deg]" size={20} />
                  <input
                    type="text"
                    placeholder="Airport/city"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-dark-700 mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Airport/city"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-dark-700 mb-2">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {tripType === 'roundtrip' && (
                <div className="relative">
                  <label className="block text-sm font-medium text-dark-700 mb-2">Return</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-dark-700 mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4+ Passengers</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-dark-700 mb-2">Class</label>
                <select
                  value={flightClass}
                  onChange={(e) => setFlightClass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Inquiry Submitted!</h3>
                <p className="text-green-700">Your flight inquiry has been submitted. Our travel team will contact you shortly.</p>
              </div>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Request Flight</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Flight Inquiry Service</h2>
            <p className="text-xl text-dark-700 mb-8">
              Submit your flight requirements and our team will find the best options for you. We'll contact you with available flights and competitive prices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">✈️</div>
                <h3 className="font-bold text-dark-900 mb-2">Best Prices</h3>
                <p className="text-sm text-dark-700">Competitive rates from multiple airlines</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-bold text-dark-900 mb-2">Global Network</h3>
                <p className="text-sm text-dark-700">Flights to destinations worldwide</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-dark-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-dark-700">Expert assistance whenever you need</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
