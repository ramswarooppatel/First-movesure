"use client";
import { Rocket, Loader } from 'lucide-react';

export default function ConfirmationModal({ submissionResult, isSubmitting, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Launch?</h3>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {!submissionResult 
              ? "🚀 This will finalize your registration and create your company account in our system. You're just one click away from getting started!"
              : "✨ You're about to enter your MOVESURE dashboard. Your registration data will be securely cleared from this device."
            }
          </p>
          
          {/* Action buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center font-semibold relative overflow-hidden group"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative flex items-center">
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    {submissionResult ? 'Go to Dashboard' : 'Complete & Launch'}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}