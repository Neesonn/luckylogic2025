'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-white">Terms and Conditions</h1>
          <p className="mb-4 text-gray-300">
            These Terms and Conditions govern your use of the Lucky Logic website and services. By using this website, you agree to comply with and be bound by these terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">1. Governing Law</h2>
          <p className="text-gray-300 mb-4">
            These terms are governed by the laws of New South Wales, Australia. Any disputes arising will be subject to the exclusive jurisdiction of the courts in New South Wales.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">2. Website Usage</h2>
          <p className="text-gray-300 mb-4">
            You agree to use this site for lawful purposes only. You must not use this site in a way that violates any Australian law or regulation.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">3. Limitation of Liability</h2>
          <p className="text-gray-300 mb-4">
            Lucky Logic is not liable for any damages arising from the use or inability to use this website. All content is provided "as is" without warranty.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">4. Changes to Terms</h2>
          <p className="text-gray-300 mb-4">
            We may update these Terms from time to time. Continued use of the website constitutes acceptance of the updated terms.
          </p>

          <p className="text-sm text-gray-500 mt-8">Last updated: 25 March 2025</p>
        </div>
      </main>
    </div>
  );
} 