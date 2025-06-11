"use client";
import { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Crown,
  CheckCircle,
  XCircle,
  Users,
  Edit,
  Copy,
  Globe
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function BranchViewModal({ branch, onClose, onEdit }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatWorkingDays = (workingDays) => {
    if (!workingDays) return 'Not set';
    const days = workingDays.split(',');
    if (days.length === 7) return 'All days';
    if (days.length === 6 && !days.includes('Sunday')) return 'Monday - Saturday';
    return days.join(', ');
  };

  const formatOperatingHours = (openTime, closeTime) => {
    if (!openTime || !closeTime) return 'Not set';
    return `${openTime} - ${closeTime}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center">
                {branch.name}
                {branch.is_head_office && (
                  <Crown className="w-5 h-5 ml-2 text-yellow-300" />
                )}
              </h3>
              <p className="text-blue-100">{branch.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status Section */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {branch.is_active ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-medium ${
                  branch.is_active ? 'text-green-700' : 'text-red-700'
                }`}>
                  {branch.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {branch.is_head_office && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 rounded-full">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800 text-sm font-medium">Head Office</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => onEdit?.(branch)}
              icon={<Edit className="w-4 h-4" />}
              className="text-blue-600 hover:bg-blue-50"
            >
              Edit Branch
            </Button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Branch Name</label>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">{branch.name || 'Not provided'}</p>
                    <button
                      onClick={() => copyToClipboard(branch.name)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Branch Code</label>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-mono">{branch.code || 'Not provided'}</p>
                    <button
                      onClick={() => copyToClipboard(branch.code)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Country</label>
                  <p className="text-gray-900">{branch.country || 'India'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h4>
              
              <div className="space-y-3">
                {branch.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900">{branch.phone}</p>
                        <button
                          onClick={() => copyToClipboard(branch.phone)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {branch.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900">{branch.email}</p>
                        <button
                          onClick={() => copyToClipboard(branch.email)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          {(branch.address || branch.city || branch.state || branch.pincode) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {branch.address && (
                    <p className="text-gray-900">{branch.address}</p>
                  )}
                  <div className="flex items-center space-x-2 text-gray-700">
                    {branch.city && <span>{branch.city}</span>}
                    {branch.state && <span>• {branch.state}</span>}
                    {branch.pincode && <span>• {branch.pincode}</span>}
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(`${branch.address || ''}, ${branch.city || ''}, ${branch.state || ''} ${branch.pincode || ''}`)}
                  className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Address
                </button>
              </div>
            </div>
          )}

          {/* Operating Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Operating Hours
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Opening Time</label>
                  <p className="text-gray-900">{branch.opening_time || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Closing Time</label>
                  <p className="text-gray-900">{branch.closing_time || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Schedule</label>
                  <p className="text-gray-900 font-medium">
                    {formatOperatingHours(branch.opening_time, branch.closing_time)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Working Days
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Operating Days</label>
                  <p className="text-gray-900">{formatWorkingDays(branch.working_days)}</p>
                </div>
                
                {branch.working_days && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Days List</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {branch.working_days.split(',').map((day, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {day.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">System Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-medium text-gray-600">Created</label>
                <p className="text-gray-900">
                  {branch.created_at ? new Date(branch.created_at).toLocaleString() : 'Unknown'}
                </p>
              </div>
              <div>
                <label className="block font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">
                  {branch.updated_at ? new Date(branch.updated_at).toLocaleString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Copy Success Message */}
          {copied && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Copied to clipboard!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => onEdit?.(branch)}
            icon={<Edit className="w-4 h-4" />}
          >
            Edit Branch
          </Button>
        </div>
      </div>
    </div>
  );
}