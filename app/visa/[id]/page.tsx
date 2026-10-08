'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { visaService as visaServiceApi } from '@/services/visaService';
import { VisaService } from '@/types/visa';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Clock, CheckCircle, XCircle, ArrowRight, Plane, Calendar, User, Phone, Mail } from 'lucide-react';

function VisaServiceDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [visaServiceData, setVisaServiceData] = useState<VisaService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
    travelDate: '',
    visaType: '',
  });

  useEffect(() => {
    const fetchVisaService = async () => {
      try {
        setLoading(true);
        const serviceId = params.id as string;
        const data = await visaServiceApi.getById(serviceId);
        setVisaServiceData(data);
        if (data && data.visaTypes.length > 0) {
          setFormData(prev => ({ ...prev, visaType: data.visaTypes[0].name }));
        }
      } catch (err) {
        console.error('Error fetching visa service:', err);
        setError('Failed to load visa service. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisaService();
  }, [params.id]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.passportNumber || !formData.travelDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await visaServiceApi.createApplication({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || '',
        country: visaServiceData!.country,
        visaType: formData.visaType,
        status: 'pending',
        personalInfo: {
          firstName: formData.fullName.split(' ')[0] || '',
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
          dateOfBirth: new Date(),
          gender: 'male',
          nationality: visaServiceData!.country,
          phone: formData.phone,
          email: formData.email,
          address: '',
          city: '',
          country: visaServiceData!.country,
        },
        passportInfo: {
          passportNumber: formData.passportNumber,
          issueDate: new Date(),
          expiryDate: new Date(),
          placeOfIssue: '',
        },
        documents: [],
        paymentStatus: 'pending',
        amount: visaServiceData!.visaTypes.find(t => t.name === formData.visaType)?.price || 0,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !visaServiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error || 'Visa service not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{visaServiceData.country} Visa</h1>
          <p className="text-xl text-white/90">Complete visa application process</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visa Service Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">{visaServiceData.countryFlag}</div>
                <div>
                  <h2 className="text-3xl font-bold text-dark-900">{visaServiceData.country}</h2>
                  <p className="text-dark-700">Visa Services</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-dark-700">Processing Time</p>
                    <p className="font-semibold text-dark-900">{visaServiceData.processingTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-dark-700">Visa Types</p>
                    <p className="font-semibold text-dark-900">{visaServiceData.visaTypes.length} Available</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark-900 mb-4">Visa Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visaServiceData.visaTypes.map((type, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-dark-900 mb-2">{type.name}</h4>
                      <p className="text-primary font-bold mb-2">{type.price}</p>
                      <p className="text-sm text-dark-700">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-dark-900 mb-4">Required Documents</h3>
                <ul className="space-y-2">
                  {visaServiceData.requiredDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-dark-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Apply for Visa</h3>

              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Application Submitted!</h4>
                  <p className="text-green-700">Your visa application has been submitted. We'll contact you soon.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">Passport Number</label>
                      <input
                        type="text"
                        value={formData.passportNumber}
                        onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">Travel Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">Visa Type</label>
                      <select
                        value={formData.visaType}
                        onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                      >
                        {visaServiceData.visaTypes.map((type) => (
                          <option key={type.name} value={type.name}>
                            {type.name} - {type.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply for Visa</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {!user && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      You need to login to apply for visa
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function VisaServiceDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <VisaServiceDetailContent />
    </Suspense>
  );
}
