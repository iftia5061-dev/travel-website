'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';
import { 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter
} from 'lucide-react';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAll();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.bookingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: Booking['bookingStatus']) => {
    try {
      await bookingService.updateStatus(id, newStatus);
      setBookings(bookings.map(b => 
        b.id === id ? { ...b, bookingStatus: newStatus } : b
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center space-x-2 text-dark-700"
        >
          <Eye size={24} />
          <span className="font-semibold">Manage Bookings</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Manage Bookings</h1>
            <p className="text-dark-700">View and manage all bookings</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <Clock className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Service</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Customer</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Type</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Amount</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-dark-900">{booking.serviceName}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-dark-900">{booking.userName}</p>
                            <p className="text-xs text-dark-700">{booking.userEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 capitalize text-dark-700">{booking.type}</td>
                        <td className="py-4 px-6 font-semibold text-primary">৳{booking.amount.toLocaleString()}</td>
                        <td className="py-4 px-6 text-dark-700">
                          {new Date(booking.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {booking.bookingStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Confirm"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            {booking.bookingStatus === 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(booking.id, 'completed')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Mark Complete"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
