'use client';
import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="glass-container text-center">
        <h1 className="text-6xl font-bold mb-4 glass-text">
          <span className="tech-gradient">Lucky Logic</span>
        </h1>
        <p className="text-2xl text-gray-300 glass-text">
          Coming Soon
        </p>
        <div className="mt-8">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </main>
  );
} 