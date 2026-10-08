'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { bookingService } from '@/services/bookingService';
import { visaService } from '@/services/visaService';
import { wishlistService } from '@/services/wishlistService';
import { User } from '@/types/user';
import { Booking } from '@/types/booking';
import { VisaApplication } from '@/types/visa';
import { WishlistItem } from '@/types/wishlist';
import { Calendar, Heart, Settings, LogOut, Plane, MapPin, Mail, Phone, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const [userRes, bookingsRes, visaRes, wishlistRes] = await Promise.all([
            userService.getById(user.uid),
            bookingService.getByUserId(user.uid),
            visaService.getApplicationsByUserId(user.uid),
            wishlistService.getByUserId(user.uid),
          ]);
          setUserData(userRes);
          setBookings(bookingsRes);
          setVisaApplications(visaRes);
          setWishlist(wishlistRes);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleRemoveWishlist = async (id: string) => {
    try {
      await wishlistService.delete(id);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold border-4 border-primary">
                  {userData?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-dark-900 mb-2">
                {userData?.name || 'User'}
              </h1>
              <p className="text-dark-700 text-lg mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-4">
                {userData?.phone && (
                  <div className="flex items-center space-x-2 text-dark-700">
                    <Phone size={18} />
                    <span>{userData.phone}</span>
                  </div>
                )}
                {userData?.nationality && (
                  <div className="flex items-center space-x-2 text-dark-700">
                    <MapPin size={18} />
                    <span>{userData.nationality}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center space-x-2">
              <Settings size={20} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark-900">My Bookings</h3>
                <p className="text-sm text-dark-700">{bookings.length} bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Heart className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark-900">Wishlist</h3>
                <p className="text-sm text-dark-700">{wishlist.length} items</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Plane className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark-900">My Applications</h3>
                <p className="text-sm text-dark-700">{visaApplications.length} applications</p>
              </div>
            </div>
          </div>

          <div 
            onClick={handleLogout}
            className="bg-red-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-red-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark-900">Logout</h3>
                <p className="text-sm text-dark-700">Sign out of account</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-dark-700">
              <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
              <p>No bookings yet.</p>
              <p className="text-sm mt-2">Start exploring our tours and hotels!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.type === 'tour' ? 'bg-primary/10 text-primary' :
                          booking.type === 'hotel' ? 'bg-secondary/10 text-secondary' :
                          'bg-accent/10 text-accent'
                        }`}>
                          {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.bookingStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                          booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-dark-900 mb-1">{booking.serviceName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-dark-700">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                        </div>
                        {booking.endDate && (
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-lg font-bold text-primary">
                        ৳{booking.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Visa Applications */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">My Visa Applications</h2>
          {visaApplications.length === 0 ? (
            <div className="text-center py-12 text-dark-700">
              <Plane className="mx-auto mb-4 text-gray-400" size={48} />
              <p>No visa applications yet.</p>
              <p className="text-sm mt-2">Apply for visa services to travel abroad!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visaApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          application.status === 'approved' ? 'bg-green-100 text-green-700' :
                          application.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          application.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {application.status.replace('_', ' ').charAt(0).toUpperCase() + application.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-dark-900 mb-1">{application.country}</h3>
                      <p className="text-sm text-dark-700 mb-2">{application.visaType}</p>
                      <div className="flex items-center space-x-4 text-sm text-dark-700">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>Applied: {new Date(application.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {application.rejectionReason && (
                        <div className="mt-2 text-sm text-red-600">
                          Reason: {application.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Wishlist */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">My Wishlist</h2>
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-dark-700">
              <Heart className="mx-auto mb-4 text-gray-400" size={48} />
              <p>No items in wishlist yet.</p>
              <p className="text-sm mt-2">Save your favorite tours and hotels!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={item.itemImage}
                    alt={item.itemName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-dark-900 mb-2">{item.itemName}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-700 capitalize">{item.itemType}</span>
                      <span className="font-bold text-primary">৳{item.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveWishlist(item.id)}
                      className="mt-4 w-full py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {bookings.length === 0 && visaApplications.length === 0 && wishlist.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <p>No recent activity yet.</p>
                <p className="text-sm mt-2">Start exploring our services!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 2).map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-dark-900">Booking Created</p>
                      <p className="text-sm text-dark-700">{booking.serviceName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {wishlist.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Heart className="text-secondary" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-dark-900">Added to Wishlist</p>
                      <p className="text-sm text-dark-700">{item.itemName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {visaApplications.slice(0, 2).map((application) => (
                  <div key={application.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Plane className="text-accent" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-dark-900">Visa Application</p>
                      <p className="text-sm text-dark-700">{application.country} - {application.visaType}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
