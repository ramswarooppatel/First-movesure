"use client";
import { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Trash2, 
  Loader,
  Building2,
  Crown,
  MapPin,
  ExclamationTriangle
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function BranchDeleteModal({ branch, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [showWarnings, setShowWarnings] = useState(true);

  const requiredText = branch.name;
  const isConfirmationValid = confirmationText === requiredText;

  const handleConfirm = async () => {
    if (!isConfirmationValid) {
      return;
    }

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-16"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      {/* Enhanced Background Overlay with Animated Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-white/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Danger Header with Gradient */}
        <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white overflow-hidden flex-shrink-0">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 animate-spin-slow"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 animate-bounce"></div>
            
            {/* Warning pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="warning" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M10,2 L18,16 L2,16 Z" fill="currentColor" opacity="0.3"/>
              </pattern>
              <rect width="100" height="100" fill="url(#warning)" />
            </svg>
          </div>

          <div className="relative p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {/* Compact Danger Icon Container */}
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-900" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">Delete Branch</h3>
                    <div className="px-2 py-0.5 bg-red-400/20 border border-red-300/30 rounded-full backdrop-blur-sm">
                      <span className="text-red-100 text-xs font-medium">
                        DANGER
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-red-100 text-xs">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
          <div className="p-4 space-y-4">
            {/* Branch Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Branch Details</h4>
                  <p className="text-gray-600 text-xs">Review what will be deleted</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Branch Name</label>
                  <p className="text-gray-900 font-medium text-sm">{branch.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code</label>
                    <p className="text-gray-900 font-mono text-sm">{branch.code}</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                    <p className="text-gray-900 flex items-center text-sm">
                      {branch.is_head_office ? (
                        <>
                          <Crown className="w-3 h-3 mr-1 text-yellow-500" />
                          Head Office
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3 h-3 mr-1 text-blue-500" />
                          Branch
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                {(branch.city || branch.state) && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                    <p className="text-gray-900 flex items-center text-sm">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      {branch.city && branch.state ? `${branch.city}, ${branch.state}` : 'Not specified'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Warnings */}
            {showWarnings && (
              <div className="space-y-3">
                {/* Head Office Warning */}
                {branch.is_head_office && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-yellow-800 text-sm mb-1">Head Office Warning</h5>
                        <p className="text-yellow-700 text-xs">
                          Deleting the Head Office may affect company operations. Consider designating another branch first.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* General Warning */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-red-800 text-sm mb-1">Data Loss Warning</h5>
                      <p className="text-red-700 text-xs mb-1">
                        This will permanently delete:
                      </p>
                      <ul className="text-red-700 text-xs space-y-0.5 list-disc list-inside">
                        <li>Branch information and settings</li>
                        <li>Staff assignments to this branch</li>
                        <li>Associated data and records</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
              <h5 className="font-medium text-gray-900 text-sm mb-2">Confirmation Required</h5>
              <p className="text-gray-600 text-xs mb-3">
                Type the exact branch name to confirm: <span className="font-mono font-medium text-gray-900">&quot;{requiredText}&quot;</span>
              </p>
              
              <div className="relative">
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={`Type "${requiredText}" to confirm`}
                  disabled={loading}
                  className={`w-full px-3 py-2 border-2 rounded-lg font-mono text-sm transition-all ${
                    confirmationText.length > 0
                      ? isConfirmationValid
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-300 bg-white'
                  } focus:ring-2 focus:ring-red-500/20 focus:border-red-500 disabled:opacity-50`}
                />
                {confirmationText.length > 0 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {isConfirmationValid ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {confirmationText.length > 0 && !isConfirmationValid && (
                <p className="text-red-600 text-xs mt-1">
                  Text doesn&apos;t match. Please type exactly: &quot;{requiredText}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Cannot be undone</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="border-gray-300 hover:bg-gray-50 text-sm px-3 py-1.5"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirm}
                disabled={loading || !isConfirmationValid}
                icon={loading ? <Loader className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg disabled:opacity-50 text-sm px-3 py-1.5"
              >
                {loading ? 'Deleting...' : 'Delete Forever'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations and scrollbar */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}