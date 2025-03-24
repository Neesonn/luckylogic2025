'use client';
import React from 'react';
import Link from 'next/link';
import { FaUsers, FaBriefcase, FaPhoneAlt, FaHome, FaChartLine } from 'react-icons/fa';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <nav className="w-64 bg-[rgba(24,27,33,0.95)] backdrop-blur-md border-r border-white/10 p-6 fixed h-full">
        <Link 
          href="/" 
          className="flex items-center gap-3 mb-12"
          aria-label="Back to Home"
        >
          <FaHome className="text-2xl text-green-500" />
          <span className="text-lg font-semibold text-white">Lucky Logic</span>
        </Link>

        <div className="space-y-4">
          <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-green-500 transition-colors">
            <FaUsers className="text-xl" />
            <span>Customers</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-green-500 transition-colors">
            <FaBriefcase className="text-xl" />
            <span>Jobs</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-green-500 transition-colors">
            <FaPhoneAlt className="text-xl" />
            <span>Leads</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold glass-text">
              <span className="tech-gradient">Dashboard Overview</span>
            </h1>
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
                <Link href="#" className="text-sm text-green-500 hover:text-green-400">View all</Link>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center py-8">No customers yet</p>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="glass-container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Active Jobs</h2>
                <Link href="#" className="text-sm text-green-500 hover:text-green-400">View all</Link>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center py-8">No active jobs</p>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="glass-container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Leads</h2>
                <Link href="#" className="text-sm text-green-500 hover:text-green-400">View all</Link>
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