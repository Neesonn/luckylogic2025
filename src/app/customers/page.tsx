'use client';
import React from 'react';
import { FaSearch, FaPlus, FaFilter } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';

export default function CustomersPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold glass-text">
              <span className="tech-gradient">Customer Management</span>
            </h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
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
                  placeholder="Search customers by name, email, phone or account number..."
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
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Account#</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">First Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Suburb</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Postcode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-400" colSpan={7}>
                      No customers found
                    </td>
                  </tr>
                  {/* Example row (commented out until data is available) */}
                  {/*
                  <tr className="hover:bg-white/5">
                    <td className="py-4 px-4">ACC001</td>
                    <td className="py-4 px-4">John</td>
                    <td className="py-4 px-4">Doe</td>
                    <td className="py-4 px-4">0412 345 678</td>
                    <td className="py-4 px-4">john.doe@example.com</td>
                    <td className="py-4 px-4">Richmond</td>
                    <td className="py-4 px-4">3121</td>
                  </tr>
                  */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
            <div>Showing 0 of 0 customers</div>
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
    </div>
  );
} 