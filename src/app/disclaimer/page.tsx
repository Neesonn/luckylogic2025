'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-white">Disclaimer</h1>
          
          <p className="mb-4 text-gray-300">
            All content on this website is for informational purposes only. Lucky Logic makes no warranties of accuracy or completeness.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">1. No Guarantees</h2>
          <p className="text-gray-300 mb-4">
            While we strive to keep information current and accurate, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the information contained on this website.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">2. Use at Your Own Risk</h2>
          <p className="text-gray-300 mb-4">
            Any reliance you place on information provided through this website is strictly at your own risk. You should seek professional advice for your specific circumstances.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">3. Third-Party Links</h2>
          <p className="text-gray-300 mb-4">
            This website may contain links to external websites. We have no control over the nature, content, and availability of those sites and are not responsible for their content.
          </p>

          <p className="text-sm text-gray-500 mt-8">Last updated: 25 March 2025</p>
        </div>
      </main>
    </div>
  );
} 