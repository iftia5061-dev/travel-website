'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Globe, Clock, FileText, ArrowRight, Check } from 'lucide-react';
import { visaService } from '@/services/visaService';
import { VisaService } from '@/types/visa';

export default function VisaPage() {
  const [visaServices, setVisaServices] = useState<VisaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisaServices = async () => {
      try {
        setLoading(true);
        const data = await visaService.getAllServices();
        setVisaServices(data);
      } catch (err) {
        console.error('Error fetching visa services:', err);
        setError('Failed to load visa services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisaServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Visa Services</h1>
          <p className="text-xl text-white/90">Hassle-free visa processing for your travel needs</p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">How It Works</h2>
            <p className="text-xl text-dark-700">Simple and streamlined visa application process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Select Country', description: 'Choose your destination country and visa type' },
              { icon: FileText, title: 'Submit Documents', description: 'Upload required documents and information' },
              { icon: Clock, title: 'Get Approved', description: 'Receive your visa within processing time' },
            ].map((step) => (
              <div
                key={step.title}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="text-primary" size={40} />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{step.title}</h3>
                <p className="text-dark-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Available Countries</h2>
            <p className="text-xl text-dark-700">Visa services for popular destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : visaServices.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-dark-700">No visa services found.</p>
              </div>
            ) : (
              visaServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{service.countryFlag}</div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">{service.country}</h3>
                  <div className="flex items-center space-x-2 text-sm text-dark-700 mb-3">
                    <Clock size={16} />
                    <span>{service.processingTime}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-lg font-bold text-primary">৳{service.visaTypes[0]?.price?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.visaTypes.map((type) => (
                      <span key={type.id} className="text-xs bg-gray-100 text-dark-700 px-2 py-1 rounded-full">
                        {type.name}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                    <span>Apply Now</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-dark-900 mb-8 text-center">Required Documents</h2>
            <div className="space-y-4">
              {visaServices.length > 0 && visaServices[0].requiredDocuments.length > 0 ? (
                visaServices[0].requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Check className="text-secondary" size={20} />
                    <span className="text-dark-700">{doc}</span>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {[
                    'Valid Passport (minimum 6 months validity)',
                    'Passport-size photographs',
                    'Bank statement (last 3 months)',
                    'Employment proof or business documents',
                    'Travel itinerary',
                    'Hotel booking confirmation',
                    'Flight ticket details',
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Check className="text-secondary" size={20} />
                      <span className="text-dark-700">{doc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
