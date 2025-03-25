'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaUsers, FaBriefcase, FaPhoneAlt, FaChartLine, FaCircle, FaSync } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  active_status: boolean;
  last_viewed_at: string;
}

export default function AdminDashboard() {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showRefreshState = true) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      }
      
      // Fetch total customers count
      const { count, error: countError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCustomers(count || 0);

      // Fetch recent customers
      const { data: recentData, error: recentError } = await supabase
        .from('customers')
        .select('id, first_name, last_name, active_status, last_viewed_at')
        .not('last_viewed_at', 'is', null)
        .order('last_viewed_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentCustomers(recentData || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setIsRefreshing(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Refresh when window gains focus
  useEffect(() => {
    const onFocus = () => {
      fetchDashboardData(false);
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchDashboardData]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Active Customers */}
            <div className="glass-container p-6">
              <h3 className="text-sm font-medium text-gray-400">Active Customers</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-white">
                  {totalCustomers}
                </p>
              </div>
            </div>

            {/* Active Leads */}
            <div className="glass-container p-6">
              <h3 className="text-sm font-medium text-gray-400">Active Leads</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-white">
                  0
                </p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="glass-container p-6">
              <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-white">
                  $0
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-container p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>
            </div>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Recently Viewed */}
            <div className="glass-container">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Recently Viewed</h2>
                  <button
                    onClick={() => fetchDashboardData(true)}
                    disabled={loading || isRefreshing}
                    className="p-1 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                    title="Refresh recently viewed"
                  >
                    <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} size={14} />
                  </button>
                </div>
                <Link href="/customers" className="text-sm text-green-500 hover:text-green-400">View all</Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <p className="text-red-400 text-sm text-center py-8">{error}</p>
                ) : recentCustomers.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No recently viewed customers</p>
                ) : (
                  recentCustomers.map((customer) => (
                    <Link 
                      key={customer.id} 
                      href={`/customers/${customer.id}`}
                      className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">
                            {customer.first_name} {customer.last_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            #{customer.id.slice(0, 6).toUpperCase()}
                          </p>
                        </div>
                        <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                          customer.active_status 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          <FaCircle size={8} />
                          {customer.active_status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {customer.last_viewed_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Viewed: {new Date(customer.last_viewed_at).toLocaleString()}
                        </p>
                      )}
                    </Link>
                  ))
                )}
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