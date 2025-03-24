'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUsers, FaBriefcase, FaPhoneAlt, FaHome, FaChartLine } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-64 bg-[rgba(24,27,33,0.95)] backdrop-blur-md border-r border-white/10 p-6 fixed h-full">
      <Link 
        href="/admin-dashboard" 
        className="flex items-center gap-3 mb-12"
        aria-label="Dashboard"
      >
        <FaHome className="text-2xl text-green-500" />
        <span className="text-lg font-semibold text-white">Lucky Logic</span>
      </Link>

      <div className="space-y-4">
        <Link 
          href="/admin-dashboard" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
            isActive('/admin-dashboard') 
              ? 'text-green-500 bg-white/5' 
              : 'text-gray-300 hover:text-green-500'
          }`}
        >
          <FaChartLine className="text-xl" />
          <span>Dashboard</span>
        </Link>
        <Link 
          href="/customers" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
            isActive('/customers') 
              ? 'text-green-500 bg-white/5' 
              : 'text-gray-300 hover:text-green-500'
          }`}
        >
          <FaUsers className="text-xl" />
          <span>Customers</span>
        </Link>
        <Link 
          href="/jobs" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
            isActive('/jobs') 
              ? 'text-green-500 bg-white/5' 
              : 'text-gray-300 hover:text-green-500'
          }`}
        >
          <FaBriefcase className="text-xl" />
          <span>Jobs</span>
        </Link>
        <Link 
          href="/leads" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
            isActive('/leads') 
              ? 'text-green-500 bg-white/5' 
              : 'text-gray-300 hover:text-green-500'
          }`}
        >
          <FaPhoneAlt className="text-xl" />
          <span>Leads</span>
        </Link>
      </div>
    </nav>
  );
} 