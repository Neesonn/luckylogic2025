'use client';
import React from 'react';
import { FaWrench } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      {/* Admin Dashboard Link */}
      <Link 
        href="/admin-dashboard" 
        className="absolute top-4 right-4 p-3 glass-container hover:scale-105 transition-transform"
        aria-label="Admin Dashboard"
      >
        <FaWrench className="text-2xl text-green-500" />
      </Link>

      <div className="glass-container text-center">
        <h1 className="text-6xl font-bold mb-4 text-white">
          <span className="tech-gradient">Lucky Logic</span>
        </h1>
        <p className="text-2xl text-white mb-4">
          Coming Soon
        </p>
        <p className="text-gray-400">
          Your trusted partner in customer management solutions
        </p>
        <div className="mt-8">
          <div className="w-16 h-16 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </main>
  );
} 