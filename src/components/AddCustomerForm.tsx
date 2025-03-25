'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { faker } from '@faker-js/faker/locale/en_AU';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AUSTRALIAN_STATES } from '@/lib/constants';

interface AddCustomerFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AddCustomerForm({ onSuccess, onClose }: AddCustomerFormProps) {
  const router = useRouter();
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
    country: 'Australia', // Default to Australia
    active_status: true,
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

  const generateDummyData = () => {
    // Add a small delay to prevent rate limiting
    setTimeout(() => {
      const randomState = AUSTRALIAN_STATES[Math.floor(Math.random() * AUSTRALIAN_STATES.length)];
      setFormData({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone_number: `04${faker.string.numeric(8)}`.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3'),
        email_address: faker.internet.email().toLowerCase(),
        address_line_1: faker.location.streetAddress(),
        address_line_2: Math.random() > 0.5 ? `Unit ${faker.number.int({ min: 1, max: 999 })}` : '',
        suburb: faker.location.city(),
        postcode: faker.location.zipCode('####'), // Australian format
        state: randomState.code,
        country: 'Australia',
        active_status: Math.random() > 0.2, // 80% chance of being active
      });
    }, 500); // Add a 500ms delay
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    const submitWithRetry = async (retryCount = 0): Promise<void> => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert([formData])
          .select()
          .single();

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
          
          let errorMessage = '';
          if (error.code === '23505') {
            errorMessage = 'A customer with this email already exists.';
          } else if (error.code === '23503') {
            errorMessage = 'Invalid reference in the data.';
          } else if (error.code === 'PGRST116') {
            errorMessage = 'You do not have permission to add customers.';
          } else if (error.code === '429') {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
          } else {
            errorMessage = `Error: ${error.message}${error.hint ? ` (Hint: ${error.hint})` : ''}`;
          }
          
          setError(errorMessage);
          toast.error(`❌ ${errorMessage}`);
          return;
        }

        console.log('Customer added successfully:', data);
        toast.success('✨ Customer added successfully!');
        onSuccess();
        
        // Close the modal and redirect after a short delay
        setTimeout(() => {
          onClose();
          router.push('/customers');
          router.refresh();
        }, 1000);
      } catch (err) {
        console.error('Network or unexpected error:', err);
        const errorMessage = 'Connection failed. Please check your internet connection and try again.';
        setError(errorMessage);
        toast.error(`❌ ${errorMessage}`);
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

      // Insert customers one by one with delay
      for (const customer of dummyCustomers) {
        const { error } = await supabase.from('customers').insert([customer]);
        if (error) {
          console.error('Error inserting customer:', error);
          if (error.code === '429') {
            // Wait for 2 seconds before trying the next one
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Retry this customer
            const retryResult = await supabase.from('customers').insert([customer]);
            if (retryResult.error) {
              throw retryResult.error;
            }
          } else {
            throw error;
          }
        }
        // Add delay between successful inserts
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      onSuccess(); // This will refresh the customer list
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

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" size={16} />}
                  {loading ? 'Adding...' : 'Add Customer'}
                </button>
                <button
                  type="button"
                  onClick={generateDummyData}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Data
                </button>
              </div>
              <button
                type="button"
                onClick={generateBulkDummyCustomers}
                disabled={loading}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add 5 Random Customers
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