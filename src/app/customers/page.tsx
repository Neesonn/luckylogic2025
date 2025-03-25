'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaPlus, FaFilter, FaSpinner, FaExclamationTriangle, FaEye, FaEdit, FaTrash, FaCircle } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { AddCustomerForm } from '@/components/AddCustomerForm';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-hot-toast';
import { EditCustomerForm } from '@/components/EditCustomerForm';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';

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

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 10;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsRateLimited(false);

      // Calculate range for pagination
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize - 1;

      // Build query
      let query = supabase
        .from('customers')
        .select('*', { count: 'exact' });

      // Apply search if term exists
      if (debouncedSearch) {
        query = query.or(`first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%`);
      }

      // Get total count first
      const { count, error: countError } = await query;

      if (countError) {
        if (countError.code === '429') {
          setIsRateLimited(true);
          throw new Error('Too many requests — please slow down.');
        }
        throw countError;
      }

      // Get paginated data
      const { data, error: dataError } = await query
        .range(start, end)
        .order('created_at', { ascending: false });

      if (dataError) {
        if (dataError.code === '429') {
          setIsRateLimited(true);
          throw new Error('Too many requests — please slow down.');
        }
        throw dataError;
      }

      if (data) {
        setCustomers(data);
        setTotalPages(Math.ceil((count || 0) / pageSize));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while fetching customers';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers when page or search term changes
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditForm(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', selectedCustomer.id);

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
      fetchCustomers();
      router.refresh();
    } catch (err) {
      console.error('Network or unexpected error:', err);
      toast.error('❌ Failed to delete customer. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Customer Management
            </h1>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <UserPlusIcon className="h-5 w-5" />
              Add Customer
            </button>
          </div>

          {/* Search Bar */}
          <div className="glass-container p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20 text-white"
                disabled={loading || isRateLimited}
              />
            </div>
          </div>

          {/* Rate Limit Warning */}
          {isRateLimited && (
            <div className="glass-container p-4 mb-6 bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3 text-red-400">
                <FaExclamationTriangle />
                <p>Too many requests — please slow down and try again in a moment.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Customers Table */}
          <div className="glass-container overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">UUID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">First Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Suburb</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Postcode</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                        Loading customers...
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-white/5">
                        <td className="py-4 px-4 font-mono text-sm">
                          <Link
                            href={`/customers/${customer.id}`}
                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                          >
                            {customer.id}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-white">{customer.first_name}</td>
                        <td className="py-4 px-4">{customer.last_name}</td>
                        <td className="py-4 px-4">{customer.phone_number || 'N/A'}</td>
                        <td className="py-4 px-4">{customer.email_address}</td>
                        <td className="py-4 px-4">{customer.suburb}</td>
                        <td className="py-4 px-4">{customer.postcode}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            customer.active_status 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {customer.active_status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/customers/${customer.id}`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <FaEye className="text-gray-400" size={14} />
                            </Link>
                            <button
                              onClick={() => handleEdit(customer)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <FaEdit className="text-gray-400" size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <FaTrash className="text-gray-400" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t border-white/10">
            <div className="text-sm text-gray-400">
              {customers.length > 0 
                ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, (totalPages * pageSize))} of ${totalPages * pageSize} customers`
                : 'No customers found'
              }
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={`w-8 h-8 rounded ${
                        currentPage === pageNum
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={loading}
                      className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Customer Modal */}
      {showAddForm && (
        <AddCustomerForm
          onSuccess={() => {
            setShowAddForm(false);
            setCurrentPage(1); // Reset to first page
            fetchCustomers(); // Refresh the list
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Customer Modal */}
      {showEditForm && selectedCustomer && (
        <EditCustomerForm
          customer={selectedCustomer}
          onSuccess={() => {
            setShowEditForm(false);
            setCurrentPage(1); // Reset to first page
            fetchCustomers(); // Refresh the list
          }}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        customerName={selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : ''}
        isLoading={isDeleting}
        onConfirm={handleDeleteCustomer}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
} 