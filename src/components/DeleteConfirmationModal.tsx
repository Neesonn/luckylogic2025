'use client';

import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  customerName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  customerName,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1D24] rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <FaExclamationTriangle size={24} />
          <h2 className="text-xl font-bold">Delete Customer</h2>
        </div>

        <p className="text-gray-300 mb-4">
          Are you sure you want to delete <span className="font-semibold text-white">{customerName}</span>? 
          This action cannot be undone and all customer data will be permanently removed.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <FaSpinner className="animate-spin" size={16} />}
            {isLoading ? 'Deleting...' : 'Delete Customer'}
          </button>
        </div>
      </div>
    </div>
  );
} 