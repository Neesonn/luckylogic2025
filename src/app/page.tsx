'use client';
import React from 'react';
import Link from 'next/link';
import { FaLock } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="glass-container text-center">
        <h1 className="text-6xl font-bold mb-4 glass-text">
          <span className="tech-gradient">Lucky Logic</span>
        </h1>
        <p className="text-2xl text-gray-300 glass-text mb-8">
          Coming Soon
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <Link 
            href="/login" 
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors text-white"
          >
            <FaLock className="text-sm" />
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  );
} 