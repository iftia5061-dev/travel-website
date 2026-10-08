'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Plane, 
  Calendar, 
  List,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  Mail
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Stats (will be fetched from Firebase)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalTours: 0,
    totalHotels: 0,
    visaApplications: 0,
    contactMessages: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Check if admin
    if (user && user.email !== 'admin@travelwebsite.com') {
      router.push('/');
      return;
    }

    setLoading(false);
    
    // TODO: Fetch real stats from Firebase
    setStats({
      totalUsers: 156,
      totalBookings: 89,
      pendingBookings: 12,
      totalTours: 24,
      totalHotels: 18,
      visaApplications: 34,
      contactMessages: 23,
      revenue: 1250000,
    });
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'blue' },
    { icon: List, label: 'Total Bookings', value: stats.totalBookings, color: 'green' },
    { icon: Clock, label: 'Pending Bookings', value: stats.pendingBookings, color: 'amber' },
    { icon: Map, label: 'Total Tours', value: stats.totalTours, color: 'purple' },
    { icon: Building2, label: 'Total Hotels', value: stats.totalHotels, color: 'pink' },
    { icon: Plane, label: 'Visa Applications', value: stats.visaApplications, color: 'cyan' },
    { icon: Mail, label: 'Contact Messages', value: stats.contactMessages, color: 'indigo' },
  ];

  const recentBookings = [
    { id: '1', service: 'Thailand Adventure', type: 'tour', customer: 'John Doe', amount: 29500, status: 'pending', date: '2024-01-15' },
    { id: '2', service: 'Burj Al Arab', type: 'hotel', customer: 'Jane Smith', amount: 15000, status: 'confirmed', date: '2024-01-14' },
    { id: '3', service: 'UAE Visa', type: 'visa', customer: 'Mike Johnson', amount: 5000, status: 'under_review', date: '2024-01-13' },
    { id: '4', service: 'Economy Hajj', type: 'hajj', customer: 'Sarah Williams', amount: 250000, status: 'pending', date: '2024-01-12' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-amber-500';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'cyan': return 'bg-cyan-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center space-x-2 text-dark-700"
        >
          <Menu size={24} />
          <span className="font-semibold">Admin Panel</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Dashboard</h1>
            <p className="text-dark-700">Welcome back, Admin</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${getStatColor(stat.color)} rounded-xl flex items-center justify-center`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-dark-700">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-1">Total Revenue</p>
                <h2 className="text-4xl font-bold">৳{stats.revenue.toLocaleString()}</h2>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={32} />
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark-900">Recent Bookings</h2>
              <button 
                onClick={() => router.push('/admin/bookings')}
                className="text-primary hover:text-primary-600 font-semibold"
              >
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-dark-900">{booking.service}</p>
                          <p className="text-xs text-dark-700 capitalize">{booking.type}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-dark-700">{booking.customer}</td>
                      <td className="py-3 px-4 font-semibold text-primary">৳{booking.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-dark-700">{booking.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-primary hover:text-primary-600 font-semibold text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
