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
  User,
  Users,
  Shield,
  Globe,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit,
  Trash2
} from 'lucide-react';

export default function BranchDetailsModal({ isOpen, onClose, branch }) {
  if (!isOpen || !branch) return null;

  const workingDays = branch.working_days ? branch.working_days.split(',') : [];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{branch.name}</h2>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium backdrop-blur-sm">
                    {branch.code}
                  </span>
                  {branch.is_head_office && (
                    <span className="px-3 py-1 bg-yellow-400/20 text-yellow-100 text-sm rounded-full font-medium backdrop-blur-sm">
                      Head Office
                    </span>
                  )}
                  <span className={`px-3 py-1 text-sm rounded-full font-medium backdrop-blur-sm ${
                    branch.is_active 
                      ? 'bg-green-400/20 text-green-100' 
                      : 'bg-red-400/20 text-red-100'
                  }`}>
                    {branch.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <Edit className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <Copy className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {branch.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold text-gray-900">{branch.phone}</p>
                      </div>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-semibold text-gray-900">{branch.email}</p>
                      </div>
                    </div>
                  )}
                  {branch.website && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="font-semibold text-gray-900">{branch.website}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-green-600" />
                  Address Information
                </h3>
                <div className="space-y-3">
                  {branch.address && (
                    <div>
                      <p className="text-sm text-gray-600">Street Address</p>
                      <p className="font-semibold text-gray-900">{branch.address}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {branch.city && (
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-semibold text-gray-900">{branch.city}</p>
                      </div>
                    )}
                    {branch.state && (
                      <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-semibold text-gray-900">{branch.state}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {branch.pincode && (
                      <div>
                        <p className="text-sm text-gray-600">Pincode</p>
                        <p className="font-semibold text-gray-900">{branch.pincode}</p>
                      </div>
                    )}
                    {branch.country && (
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold text-gray-900">{branch.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Operating Hours */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-purple-600" />
                  Operating Hours
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <span className="text-gray-600">Opening Time</span>
                    <span className="font-bold text-purple-600">{branch.opening_time || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <span className="text-gray-600">Closing Time</span>
                    <span className="font-bold text-purple-600">{branch.closing_time || 'Not set'}</span>
                  </div>
                  
                  {workingDays.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Working Days</p>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <span
                            key={day}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              workingDays.includes(day)
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Manager Information */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-3 text-orange-600" />
                  Manager Information
                </h3>
                <div className="space-y-3">
                  {branch.manager_id ? (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Manager Name</p>
                        <p className="text-sm text-gray-600">Manager ID: {branch.manager_id}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">No manager assigned</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-gray-600" />
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {branch.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(branch.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {branch.updated_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(branch.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Branch Type</span>
                    <span className="font-semibold text-gray-900">
                      {branch.is_head_office ? 'Head Office' : 'Branch Office'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Last updated: {new Date(branch.updated_at || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Edit Branch
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}