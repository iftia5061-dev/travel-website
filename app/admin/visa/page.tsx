'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { visaService } from '@/services/visaService';
import { VisaService } from '@/types/visa';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Plane,
  Clock
} from 'lucide-react';

export default function AdminVisaPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visaServices, setVisaServices] = useState<VisaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVisaServices = async () => {
      try {
        const data = await visaService.getAllServices();
        setVisaServices(data);
      } catch (error) {
        console.error('Error fetching visa services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisaServices();
  }, []);

  const filteredServices = visaServices.filter(service =>
    service.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this visa service?')) {
      try {
        await visaService.deleteService(id);
        setVisaServices(visaServices.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting visa service:', error);
        alert('Failed to delete visa service');
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
          <Plane size={24} />
          <span className="font-semibold">Manage Visa Services</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Manage Visa Services</h1>
              <p className="text-dark-700">Add, edit, and delete visa services</p>
            </div>
            <button
              onClick={() => router.push('/admin/visa/new')}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Visa Service</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search visa services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Visa Services List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <Plane className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No visa services found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Country</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Flag</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Processing Time</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Visa Types</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Documents</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-semibold text-dark-900">{service.country}</td>
                        <td className="py-4 px-6 text-3xl">{service.countryFlag}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1 text-dark-700">
                            <Clock size={16} />
                            <span>{service.processingTime}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {service.visaTypes.slice(0, 2).map((type) => (
                              <span key={type.id} className="text-xs bg-gray-100 text-dark-700 px-2 py-1 rounded-full">
                                {type.name}
                              </span>
                            ))}
                            {service.visaTypes.length > 2 && (
                              <span className="text-xs text-dark-700">+{service.visaTypes.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-dark-700">{service.requiredDocuments.length}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/visa/${service.id}`)}
                              className="p-2 text-primary hover:bg-primary-10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
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
