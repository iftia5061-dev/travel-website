'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { contactService } from '@/services/contactService';
import { ContactMessage } from '@/types/contact';
import { 
  Search,
  Mail,
  Eye,
  Trash2,
  Check,
  Clock
} from 'lucide-react';

export default function AdminContactPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await contactService.getAll();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      await contactService.updateStatus(id, newStatus);
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: newStatus } : m
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.delete(id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-gray-100 text-gray-700';
      case 'replied': return 'bg-green-100 text-green-700';
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
          <Mail size={24} />
          <span className="font-semibold">Contact Messages</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Contact Messages</h1>
            <p className="text-dark-700">View and manage contact form submissions</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-dark-700">
                <Mail className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No messages found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">From</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Subject</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Phone</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((message) => (
                      <tr key={message.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-dark-900">{message.name}</p>
                            <p className="text-xs text-dark-700">{message.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-dark-700">{message.subject}</td>
                        <td className="py-4 px-6 text-dark-700">{message.phone || '-'}</td>
                        <td className="py-4 px-6 text-dark-700">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(message.status)}`}>
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {message.status === 'new' && (
                              <button
                                onClick={() => handleStatusChange(message.id, 'read')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Mark as Read"
                              >
                                <Eye size={18} />
                              </button>
                            )}
                            {message.status === 'read' && (
                              <button
                                onClick={() => handleStatusChange(message.id, 'replied')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as Replied"
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(message.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
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
