'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="mb-4 text-gray-300">
            This Privacy Policy outlines how Lucky Logic collects, uses, and protects your personal information in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">1. Information We Collect</h2>
          <p className="text-gray-300 mb-4">
            We may collect personal information including your name, contact details, IP address, and usage data.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">2. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">
            To provide services, communicate with you, and improve our website and offerings.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">3. Disclosure</h2>
          <p className="text-gray-300 mb-4">
            We will not disclose your personal information to third parties without your consent unless required by law.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">4. Data Security</h2>
          <p className="text-gray-300 mb-4">
            We implement safeguards to protect your data, but no system is 100% secure.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">5. Access and Correction</h2>
          <p className="text-gray-300 mb-4">
            You may request access to or correction of your personal information by contacting us.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">6. Contact</h2>
          <p className="text-gray-300 mb-4">
            For questions, email us at support@luckylogic.com.au
          </p>

          <p className="text-sm text-gray-500 mt-8">Last updated: 25 March 2025</p>
        </div>
      </main>
    </div>
  );
} 