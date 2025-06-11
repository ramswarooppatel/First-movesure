"use client";
import { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Trash2, 
  Loader
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function BranchDeleteModal({ branch, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting branch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Branch</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete the branch <strong>&quot;{branch.name}&quot;</strong>?
            </p>
            <p className="text-sm text-gray-600">
              This will permanently remove the branch and all associated data. This action cannot be undone.
            </p>
          </div>

          {branch.is_head_office && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800 font-medium">
                  Warning: This is a Head Office
                </p>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Deleting the head office may affect company operations. Consider making another branch the head office first.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Branch Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div><strong>Name:</strong> {branch.name}</div>
              <div><strong>Code:</strong> {branch.code}</div>
              <div><strong>Location:</strong> {branch.city}, {branch.state}</div>
              {branch.is_head_office && (
                <div><strong>Type:</strong> Head Office</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={loading}
            icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          >
            {loading ? 'Deleting...' : 'Delete Branch'}
          </Button>
        </div>
      </div>
    </div>
  );
}