'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { hotelService } from '@/services/hotelService';
import { Hotel } from '@/types/hotel';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Building2,
  Star,
  MapPin
} from 'lucide-react';

export default function AdminHotelsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getAll();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        await hotelService.delete(id);
        setHotels(hotels.filter(h => h.id !== id));
      } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('Failed to delete hotel');
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
          <Building2 size={24} />
          <span className="font-semibold">Manage Hotels</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Manage Hotels</h1>
              <p className="text-dark-700">Add, edit, and delete hotels</p>
            </div>
            <button
              onClick={() => router.push('/admin/hotels/new')}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Hotel</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Hotels List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No hotels found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Hotel</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Location</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Rating</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Rooms</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map((hotel) => (
                      <tr key={hotel.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={hotel.images[0]}
                              alt={hotel.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-semibold text-dark-900">{hotel.name}</p>
                              <p className="text-xs text-dark-700">{hotel.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1 text-dark-700">
                            <MapPin size={16} />
                            <span>{hotel.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1">
                            <Star size={16} className="fill-accent text-accent" />
                            <span className="text-dark-700">{hotel.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-dark-700">{hotel.rooms.length}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            hotel.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {hotel.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/hotels/${hotel.id}`)}
                              className="p-2 text-primary hover:bg-primary-10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(hotel.id)}
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
