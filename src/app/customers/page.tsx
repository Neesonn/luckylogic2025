'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaPlus, FaFilter } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { AddCustomerForm } from '@/components/AddCustomerForm';

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [customerCache, setCustomerCache] = useState<Customer[] | null>(null);

  const fetchCustomers = useCallback(async () => {
    // Return cached data if available
    if (customerCache) {
      setCustomers(customerCache);
      return;
    }

    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        if (error.code === '429' && retryCount < 3) {
          // If rate limited, wait and retry with exponential backoff
          setRetryCount(prev => prev + 1);
          const delay = 2000 * (retryCount + 1);
          console.log(`Rate limited. Retrying in ${delay}ms...`);
          setTimeout(fetchCustomers, delay);
          return;
        }
        throw error;
      }

      const customersData = data as Customer[];
      setCustomers(customersData);
      setCustomerCache(customersData); // Cache the results
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [loading, retryCount, customerCache]);

  // Function to force refresh data
  const refreshCustomers = useCallback(async () => {
    setCustomerCache(null); // Clear cache
    await fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Add cache invalidation when component unmounts
  useEffect(() => {
    return () => {
      setCustomerCache(null);
    };
  }, []);

  // Update the onSuccess handler in AddCustomerForm to refresh data
  const handleCustomerAdded = () => {
    refreshCustomers(); // Force refresh when new customer is added
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
              <FaPlus className="text-sm" />
              Add Customer
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="glass-container mb-6">
            <div className="flex gap-4">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, phone or UCID..."
                  className="bg-transparent w-full focus:outline-none text-white"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <FaFilter className="text-gray-400" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="glass-container overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">UCID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">First Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Suburb</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Postcode</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                        Loading customers...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-red-400" colSpan={8}>
                        {error}
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
                        <td className="py-4 px-4">{customer.id}</td>
                        <td className="py-4 px-4">{customer.first_name}</td>
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
            <div>
              Showing {customers.length} of {customers.length} customers
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Customer Modal */}
      {showAddForm && (
        <AddCustomerForm
          onSuccess={handleCustomerAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
} 