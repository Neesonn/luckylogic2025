'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaTimes } from 'react-icons/fa';
import { faker } from '@faker-js/faker/locale/en_AU'; // Using Australian locale

interface AddCustomerFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AddCustomerForm({ onSuccess, onClose }: AddCustomerFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email_address: '',
    address_line_1: '',
    address_line_2: '',
    suburb: '',
    postcode: '',
    state: '',
    country: '',
    active_status: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateDummyData = () => {
    // Australian states
    const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
    
    // Add a small delay to prevent rate limiting
    setTimeout(() => {
      setFormData({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone_number: `04${faker.string.numeric(8)}`.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3'),
        email_address: faker.internet.email().toLowerCase(),
        address_line_1: faker.location.streetAddress(),
        address_line_2: Math.random() > 0.5 ? `Unit ${faker.number.int({ min: 1, max: 999 })}` : '',
        suburb: faker.location.city(),
        postcode: faker.location.zipCode('####'), // Australian format
        state: states[Math.floor(Math.random() * states.length)],
        country: 'Australia',
        active_status: Math.random() > 0.2, // 80% chance of being active
      });
    }, 500); // Add a 500ms delay
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    setError(null);

    const submitWithRetry = async (retryCount = 0): Promise<void> => {
      try {
        console.log('Attempting to insert customer:', formData);
        const { data, error } = await supabase
          .from('customers')
          .insert([formData])
          .select()
          .single(); // Only expect one row

        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          
          if (error.code === '429' && retryCount < 3) {
            const delay = 2000 * (retryCount + 1);
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return submitWithRetry(retryCount + 1);
          }
          
          if (error.code === '23505') {
            setError('A customer with this email already exists.');
          } else if (error.code === '23503') {
            setError('Invalid reference in the data.');
          } else if (error.code === 'PGRST116') {
            setError('You do not have permission to add customers.');
          } else if (error.code === '429') {
            setError('Too many requests. Please wait a moment and try again.');
          } else {
            setError(`Error: ${error.message}${error.hint ? ` (Hint: ${error.hint})` : ''}`);
          }
          return;
        }

        console.log('Customer added successfully:', data);
        onSuccess(); // Hide form and refresh list
      } catch (err) {
        console.error('Network or unexpected error:', err);
        setError('Connection failed. Please check your internet connection and try again.');
      }
    };

    try {
      await submitWithRetry();
    } finally {
      setLoading(false);
    }
  };

  const generateBulkDummyCustomers = async () => {
    setLoading(true);
    try {
      const dummyCustomers = Array.from({ length: 5 }).map(() => ({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone_number: `04${faker.string.numeric(8)}`.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3'),
        email_address: faker.internet.email().toLowerCase(),
        address_line_1: faker.location.streetAddress(),
        address_line_2: faker.location.secondaryAddress(),
        suburb: faker.location.city(),
        postcode: faker.location.zipCode('####'),
        state: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'][Math.floor(Math.random() * 8)],
        country: 'Australia',
        active_status: true,
      }));

      const { error } = await supabase.from('customers').insert(dummyCustomers);

      if (error) {
        console.error('Bulk insert error:', error);
        setError('Failed to insert dummy customers: ' + error.message);
      } else {
        onSuccess(); // This will refresh the customer list
      }
    } catch (err) {
      console.error('Error generating dummy customers:', err);
      setError('Failed to generate dummy customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1D24] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Add New Customer</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
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
                <input
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Country</label>
                <input
                  name="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
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

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={generateBulkDummyCustomers}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Generate 5 Dummy Customers
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 