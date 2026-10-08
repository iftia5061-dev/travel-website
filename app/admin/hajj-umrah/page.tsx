'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { hajjService, umrahService } from '@/services/hajjService';
import { HajjPackage, UmrahPackage } from '@/types/hajj';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  Star
} from 'lucide-react';

export default function AdminHajjUmrahPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hajjPackages, setHajjPackages] = useState<HajjPackage[]>([]);
  const [umrahPackages, setUmrahPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'hajj' | 'umrah'>('hajj');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const [hajjData, umrahData] = await Promise.all([
          hajjService.getAllHajj(),
          umrahService.getAllUmrah(),
        ]);
        setHajjPackages(hajjData);
        setUmrahPackages(umrahData);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const packages = activeTab === 'hajj' ? hajjPackages : umrahPackages;
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${activeTab} package?`)) {
      try {
        if (activeTab === 'hajj') {
          await hajjService.deleteHajj(id);
          setHajjPackages(hajjPackages.filter(p => p.id !== id));
        } else {
          await umrahService.deleteUmrah(id);
          setUmrahPackages(umrahPackages.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
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
          <span className="font-semibold">Manage Hajj & Umrah</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Manage Hajj & Umrah</h1>
              <p className="text-dark-700">Add, edit, and delete pilgrimage packages</p>
            </div>
            <button
              onClick={() => router.push(`/admin/${activeTab}-umrah/new`)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Package</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('hajj')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'hajj' ? 'bg-primary text-white' : 'bg-white text-dark-700 hover:bg-gray-100'
              }`}
            >
              Hajj Packages ({hajjPackages.length})
            </button>
            <button
              onClick={() => setActiveTab('umrah')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'umrah' ? 'bg-primary text-white' : 'bg-white text-dark-700 hover:bg-gray-100'
              }`}
            >
              Umrah Packages ({umrahPackages.length})
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab} packages...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Packages List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No {activeTab} packages found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Package</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Type</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Duration</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Price</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Featured</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-dark-900">{pkg.name}</p>
                        </td>
                        <td className="py-4 px-6 capitalize text-dark-700">{pkg.type}</td>
                        <td className="py-4 px-6 text-dark-700">{pkg.duration} Days</td>
                        <td className="py-4 px-6 font-semibold text-primary">৳{pkg.price.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pkg.featured ? 'bg-accent text-white' : 'bg-gray-100 text-dark-700'
                          }`}>
                            {pkg.featured ? 'Featured' : 'Regular'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pkg.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {pkg.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/${activeTab}-umrah/${pkg.id}`)}
                              className="p-2 text-primary hover:bg-primary-10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(pkg.id)}
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
