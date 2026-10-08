'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { tourService } from '@/services/tourService';
import { Tour } from '@/types/tour';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  MapPin,
  Clock,
  Star,
  Calendar
} from 'lucide-react';

export default function AdminToursPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourService.getAll();
        setTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      try {
        await tourService.delete(id);
        setTours(tours.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Failed to delete tour');
      }
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
          <Calendar size={24} />
          <span className="font-semibold">Manage Tours</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Manage Tours</h1>
              <p className="text-dark-700">Add, edit, and delete tour packages</p>
            </div>
            <button
              onClick={() => router.push('/admin/tours/new')}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Tour</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Tours List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredTours.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No tours found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Tour</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Destination</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Duration</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Rating</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Price</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTours.map((tour) => (
                      <tr key={tour.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={tour.image || tour.images[0]}
                              alt={tour.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-semibold text-dark-900">{tour.title}</p>
                              <p className="text-xs text-dark-700">{tour.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-dark-700">{tour.destination}, {tour.country}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1 text-dark-700">
                            <Clock size={16} />
                            <span>{tour.duration}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1">
                            <Star size={16} className="fill-accent text-accent" />
                            <span className="text-dark-700">{tour.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-primary">৳{tour.price.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tour.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {tour.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/tours/${tour.id}`)}
                              className="p-2 text-primary hover:bg-primary-10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(tour.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
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
