"use client";
import { useState } from 'react';
import Button from '@/components/common/Button';
import { 
  Download, 
  Eye, 
  CheckCircle, 
  Rocket, 
  HelpCircle, 
  Loader, 
  X,
  FileText,
  Sparkles
} from 'lucide-react';

export default function ActionButtons({ 
  data, 
  showDetails, 
  setShowDetails, 
  isDownloading, 
  generatePDF, 
  isSubmitting, 
  submitRegistration, 
  submissionResult, 
  submissionError, 
  handleGoToDashboard 
}) {
  return (
    <div className="space-y-8 mb-12">
      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 font-semibold border border-blue-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Eye className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          {showDetails ? 'Hide Details' : 'View All Details'}
          <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        
        <button
          onClick={generatePDF}
          disabled={isDownloading}
          className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 font-semibold border border-green-200 hover:border-green-300 disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 mr-3 animate-spin border-2 border-green-600 border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Download Summary
              <FileText className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </div>

      {/* Main Action Button */}
      <div className="flex justify-center">
        {!submissionResult ? (
          <Button 
            variant="primary" 
            size="lg" 
            onClick={submitRegistration}
            disabled={isSubmitting}
            icon={isSubmitting ? <Loader className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
            className="group px-12 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 border-0 relative overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span className="relative">
              {isSubmitting ? 'Creating Your Account...' : 'Complete Registration'}
            </span>
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleGoToDashboard}
            icon={<Rocket className="w-6 h-6" />}
            className="group px-12 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-0 relative overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span className="relative">Launch Dashboard</span>
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {submissionError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Registration Failed</h3>
              <p className="text-red-700 mb-4">{submissionError}</p>
              <button
                onClick={submitRegistration}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Loader className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : 'hidden'}`} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {submissionResult && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Registration Successful!</h3>
              <p className="text-green-700 mb-2">
                Company created with <span className="font-semibold">{submissionResult.data?.userCount || 0} users</span> and{' '}
                <span className="font-semibold">{submissionResult.data?.branchCount || 0} branches</span>.
              </p>
              {submissionResult.data?.autoLogin && (
                <p className="text-green-600 text-sm">
                  ✅ You are automatically logged in and ready to go!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="lg" 
          href="/help" 
          icon={<HelpCircle className="w-5 h-5" />}
          className="text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        >
          Need Help Getting Started?
        </Button>
      </div>
    </div>
  );
}