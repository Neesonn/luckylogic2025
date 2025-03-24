'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-white">Refund Policy</h1>
          
          <p className="mb-4 text-gray-300">
            Lucky Logic does not offer refunds for completed digital services or products unless required by Australian Consumer Law.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">1. Digital Services</h2>
          <p className="text-gray-300 mb-4">
            Due to the nature of our digital services, once a service has been delivered or access has been granted, no refunds will be provided unless required by law.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">2. Australian Consumer Law</h2>
          <p className="text-gray-300 mb-4">
            Your rights under Australian Consumer Law remain protected. You may be entitled to a refund if our services fail to meet consumer guarantees.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2 text-white">3. Requesting a Refund</h2>
          <p className="text-gray-300 mb-4">
            If you believe you are entitled to a refund under Australian Consumer Law, please contact our support team at support@luckylogic.com.au with details of your purchase and the reason for your request.
          </p>

          <p className="text-sm text-gray-500 mt-8">Last updated: 25 March 2025</p>
        </div>
      </main>
    </div>
  );
} 