'use client';
import React from 'react';
import Link from 'next/link';
import { FaUsers, FaBriefcase, FaPhoneAlt, FaChartLine } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-1">
                Dashboard Overview
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor and manage your business operations
              </p>
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-container">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <FaUsers className="text-xl text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Total Accounts</h3>
                  <p className="text-2xl font-bold text-green-500">0</p>
                </div>
              </div>
            </div>
            <div className="glass-container">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <FaBriefcase className="text-xl text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Active Jobs</h3>
                  <p className="text-2xl font-bold text-green-500">0</p>
                </div>
              </div>
            </div>
            <div className="glass-container">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <FaPhoneAlt className="text-xl text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">New Leads</h3>
                  <p className="text-2xl font-bold text-green-500">0</p>
                </div>
              </div>
            </div>
            <div className="glass-container">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <FaChartLine className="text-xl text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Completed Jobs</h3>
                  <p className="text-2xl font-bold text-green-500">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Recent Customers */}
            <div className="glass-container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Customers</h2>
                <Link href="/customers" className="text-sm text-green-500 hover:text-green-400">View all</Link>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center py-8">No customers yet</p>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="glass-container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Active Jobs</h2>
                <Link href="/jobs" className="text-sm text-green-500 hover:text-green-400">View all</Link>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center py-8">No active jobs</p>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="glass-container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Leads</h2>
                <Link href="/leads" className="text-sm text-green-500 hover:text-green-400">View all</Link>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center py-8">No leads yet</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 