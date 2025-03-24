'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaBriefcase, FaPhoneAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center mb-12">
        <Link href="/admin" className="nav-icon text-2xl">
          <FaHome />
        </Link>
        <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button text-2xl">
          <FaSignOutAlt />
        </button>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Customer Accounts Card */}
        <Link href="/admin/customers" className="glass-container text-center">
          <div className="icon-container mx-auto">
            <FaUsers className="text-xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Customer Accounts</h2>
          <p className="text-gray-400">Manage customer accounts and details</p>
        </Link>

        {/* Jobs Card */}
        <Link href="/admin/jobs" className="glass-container text-center">
          <div className="icon-container mx-auto">
            <FaBriefcase className="text-xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Jobs</h2>
          <p className="text-gray-400">Track and update service jobs</p>
        </Link>

        {/* Leads Card */}
        <Link href="/admin/leads" className="glass-container text-center">
          <div className="icon-container mx-auto">
            <FaPhoneAlt className="text-xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Leads</h2>
          <p className="text-gray-400">Manage potential customer leads</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <p className="stat-label">Total Accounts</p>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Jobs</p>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">New Leads</p>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Completed Jobs</p>
          <p className="stat-value">0</p>
        </div>
      </div>
    </div>
  );
} 