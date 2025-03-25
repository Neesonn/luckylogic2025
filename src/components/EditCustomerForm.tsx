'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { AUSTRALIAN_STATES } from '@/lib/constants';

interface Customer {
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
}

interface EditCustomerFormProps {
  customer: Customer;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditCustomerForm({ customer, onSuccess, onClose }: EditCustomerFormProps) {
  const [formData, setFormData] = useState<Customer>({
    ...customer,
    country: 'Australia' // Ensure country is always Australia
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          email_address: formData.email_address,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          suburb: formData.suburb,
          postcode: formData.postcode,
          state: formData.state,
          country: formData.country,
          active_status: formData.active_status,
        })
        .eq('id', customer.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        let errorMessage = '';
        if (error.code === '23505') {
          errorMessage = 'A customer with this email already exists.';
        } else if (error.code === '23503') {
          errorMessage = 'Invalid reference in the data.';
        } else if (error.code === 'PGRST116') {
          errorMessage = 'You do not have permission to update customers.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
        setError(errorMessage);
        toast.error(`❌ ${errorMessage}`);
        return;
      }

      toast.success('✨ Customer updated successfully!');
      onSuccess();
    } catch (err) {
      console.error('Network or unexpected error:', err);
      const errorMessage = 'Connection failed. Please check your internet connection and try again.';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1D24] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Customer</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">First Name</label>
                <input
                  name="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Last Name</label>
                <input
                  name="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Phone Number</label>
                <input
                  name="phone_number"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Email Address</label>
                <input
                  name="email_address"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email_address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Address Line 1</label>
                <input
                  name="address_line_1"
                  placeholder="Enter street address"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Address Line 2</label>
                <input
                  name="address_line_2"
                  placeholder="Enter apartment, suite, etc."
                  value={formData.address_line_2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Suburb</label>
                <input
                  name="suburb"
                  placeholder="Enter suburb"
                  value={formData.suburb}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Postcode</label>
                <input
                  name="postcode"
                  placeholder="Enter postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-[#1A1D24] border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white [&>option]:bg-[#1A1D24]"
                >
                  <option value="">Select a state</option>
                  {AUSTRALIAN_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Country</label>
                <input
                  name="country"
                  value="Australia"
                  disabled
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white opacity-75"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    name="active_status"
                    checked={formData.active_status}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Active Customer</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <FaSpinner className="animate-spin" size={16} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 