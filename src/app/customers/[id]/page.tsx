'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCircle, FaTrash } from 'react-icons/fa';
import { EditCustomerForm } from '@/components/EditCustomerForm';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email_address: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  active_status: boolean;
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCustomer = async () => {
    try {
      // Ensure we're using the full UUID from the URL
      const fullUUID = params.id;
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', fullUUID)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Permission denied');
        }
        throw error;
      }

      if (!data) {
        throw new Error('Customer not found');
      }

      setCustomer(data);

      // Log the view with the full UUID
      await supabase
        .from('customers')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('id', fullUUID);

    } catch (err: any) {
      console.error('Error fetching customer:', err);
      if (err.message === 'Permission denied') {
        setError('You do not have permission to view this customer.');
      } else if (err.message === 'Customer not found') {
        setError('Customer not found. The UCID may be invalid.');
      } else {
        setError('Failed to load customer details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchCustomer(); // Refresh customer data
    router.refresh(); // Refresh the page to update any cached data
  };

  const handleDeleteCustomer = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', params.id);

      if (error) {
        console.error('Error deleting customer:', error);
        let errorMessage = '';
        if (error.code === 'PGRST116') {
          errorMessage = 'You do not have permission to delete customers.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
        toast.error(`❌ ${errorMessage}`);
        return;
      }

      toast.success('✨ Customer deleted successfully!');
      router.push('/customers');
      router.refresh();
    } catch (err) {
      console.error('Network or unexpected error:', err);
      toast.error('❌ Failed to delete customer. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-red-400 glass-container p-8">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error || 'Customer not found'}</p>
          <Link 
            href="/customers"
            className="mt-4 inline-block text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            ← Return to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link 
              href="/customers"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-2"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Back to Customers
            </Link>
            <h1 className="text-4xl font-bold text-white">
              Customer Profile
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-container p-8">
              <h2 className="text-xl font-semibold mb-8">Customer Details</h2>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FaUser className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">
                          {customer.first_name} {customer.last_name}
                        </h2>
                        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                          customer.active_status 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          <FaCircle size={8} />
                          {customer.active_status ? 'Active Account' : 'Inactive Account'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-400 mt-2">
                        <span className="flex items-center gap-2">
                          <FaEnvelope size={14} />
                          {customer.email_address}
                        </span>
                        {customer.phone_number && (
                          <span className="flex items-center gap-2">
                            <FaPhone size={14} />
                            {customer.phone_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass-container px-4 py-2">
                  <span className="text-sm text-gray-400">UUID</span>
                  <div className="font-mono font-medium text-sm">
                    {customer.id}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Street Address</div>
                    <div className="font-medium">
                      {customer.address_line_1}
                      {customer.address_line_2 && (
                        <div className="mt-2">{customer.address_line_2}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Suburb</div>
                      <div className="font-medium">{customer.suburb}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Postcode</div>
                      <div className="font-medium">{customer.postcode}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-2">State</div>
                      <div className="font-medium">{customer.state}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Country</div>
                      <div className="font-medium">{customer.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            <div className="glass-container p-8">
              <h2 className="text-xl font-semibold mb-8">Customer Notes</h2>
              <div className="space-y-4">
                {/* ... notes content ... */}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div>
            <div className="glass-container p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  Edit Customer Details
                </button>
                <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                  View Order History
                </button>
                <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                  Send Email
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <FaTrash size={12} />
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {showEditForm && customer && (
        <EditCustomerForm
          customer={customer}
          onSuccess={handleEditSuccess}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        customerName={customer ? `${customer.first_name} ${customer.last_name}` : ''}
        isLoading={isDeleting}
        onConfirm={handleDeleteCustomer}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
} 