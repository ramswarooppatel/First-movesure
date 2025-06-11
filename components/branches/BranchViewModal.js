"use client";
import { useState, useEffect } from 'react';
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
  Globe,
  Star,
  Share2,
  Download,
  Settings,
  MoreVertical,
  Activity,
  Target,
  TrendingUp,
  Shield,
  Award,
  Eye,
  ExternalLink,
  UserCheck,
  UserX,
  Loader
} from 'lucide-react';
import Button from '@/components/common/Button';
import { useBranchStaff } from '@/hooks/useBranchStaff';

export default function BranchViewModal({ branch, onClose, onEdit }) {
  const [copied, setCopied] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use the custom hook for staff data
  const { staffData, staffLoading, staffError, fetchBranchStaff } = useBranchStaff();

  useEffect(() => {
    // Add blur effect to body when modal opens
    document.body.style.overflow = 'hidden';
    document.body.style.filter = 'blur(0px)';
    
    // Fetch staff data
    if (branch.id) {
      fetchBranchStaff(branch.id).catch(console.error);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.filter = 'none';
    };
  }, [branch.id, fetchBranchStaff]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
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

  const getStatusColor = () => {
    return branch.is_active 
      ? 'from-emerald-500 to-green-600' 
      : 'from-red-500 to-rose-600';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
    { id: 'operations', label: 'Operations', icon: <Clock className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      {/* Enhanced Background Overlay with Animated Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spectacular Header with Gradient and Glassmorphism */}
        <div className={`relative bg-gradient-to-r ${getStatusColor()} text-white overflow-hidden`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-spin-slow"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
            
            {/* Flowing lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="animate-dash" />
              <path d="M0,60 Q25,80 50,60 T100,70" stroke="currentColor" strokeWidth="0.3" fill="none" className="animate-dash" style={{animationDelay: '1s'}} />
            </svg>
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {/* Enhanced Icon Container */}
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  {branch.is_head_office && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-4 h-4 text-yellow-900" />
                    </div>
                  )}
                  {branch.is_active && (
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-3 h-3 text-green-900" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-3xl font-bold text-white">{branch.name}</h3>
                    {branch.is_head_office && (
                      <div className="px-3 py-1 bg-yellow-400/20 border border-yellow-300/30 rounded-full backdrop-blur-sm">
                        <span className="text-yellow-100 text-sm font-medium flex items-center">
                          <Crown className="w-4 h-4 mr-1" />
                          Head Office
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-white/20 border border-white/30 text-white text-sm rounded-full font-mono backdrop-blur-sm">
                      {branch.code}
                    </span>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full backdrop-blur-sm border ${
                      branch.is_active 
                        ? 'bg-green-400/20 border-green-300/30 text-green-100' 
                        : 'bg-red-400/20 border-red-300/30 text-red-100'
                    }`}>
                      {branch.is_active ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {branch.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/80 max-w-md">
                    {branch.city && branch.state ? `${branch.city}, ${branch.state}` : 'Location not specified'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-10 overflow-hidden">
                      <div className="py-1">
                        <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Share2 className="w-4 h-4 mr-3" />
                          Share Branch
                        </button>
                        <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4 mr-3" />
                          Export Data
                        </button>
                        <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50/50 backdrop-blur-sm">
          <div className="flex space-x-0 p-6 pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'staff' && !staffLoading && staffData && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {staffData.stats.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area with Enhanced Sections */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-240px)] bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Real-time Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Staff</p>
                      {staffLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin text-blue-600" />
                          <p className="text-lg font-bold text-gray-400">Loading...</p>
                        </div>
                      ) : staffError ? (
                        <p className="text-lg font-bold text-red-600">Error</p>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{staffData?.stats?.total || 0}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Staff</p>
                      {staffLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin text-green-600" />
                          <p className="text-lg font-bold text-gray-400">Loading...</p>
                        </div>
                      ) : staffError ? (
                        <p className="text-lg font-bold text-red-600">Error</p>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{staffData?.stats?.active || 0}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Managers</p>
                      {staffLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin text-purple-600" />
                          <p className="text-lg font-bold text-gray-400">Loading...</p>
                        </div>
                      ) : staffError ? (
                        <p className="text-lg font-bold text-red-600">Error</p>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {(staffData?.stats?.roles?.super_admin || 0) + (staffData?.stats?.roles?.admin || 0) + (staffData?.stats?.roles?.branch_manager || 0)}
                        </p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Branch Status</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {branch.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      {branch.is_active ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information Enhanced */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-blue-600" />
                  Basic Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoCard
                    label="Branch Name"
                    value={branch.name}
                    onCopy={() => copyToClipboard(branch.name, 'name')}
                    copied={copied === 'name'}
                  />
                  <InfoCard
                    label="Branch Code"
                    value={branch.code}
                    onCopy={() => copyToClipboard(branch.code, 'code')}
                    copied={copied === 'code'}
                    mono
                  />
                  <InfoCard
                    label="Country"
                    value={branch.country || 'India'}
                    icon={<Globe className="w-4 h-4 text-gray-400" />}
                  />
                  <InfoCard
                    label="Type"
                    value={branch.is_head_office ? 'Head Office' : 'Branch Office'}
                    icon={branch.is_head_office ? <Crown className="w-4 h-4 text-yellow-500" /> : <Building2 className="w-4 h-4 text-blue-500" />}
                  />
                </div>
              </div>

              {/* Address Information Enhanced */}
              {(branch.address || branch.city || branch.state || branch.pincode) && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-green-600" />
                    Address Information
                  </h4>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <div className="space-y-3">
                      {branch.address && (
                        <p className="text-gray-900 font-medium">{branch.address}</p>
                      )}
                      <div className="flex items-center space-x-2 text-gray-700">
                        {branch.city && <span className="px-3 py-1 bg-white rounded-full border border-gray-200">{branch.city}</span>}
                        {branch.state && <span className="px-3 py-1 bg-white rounded-full border border-gray-200">{branch.state}</span>}
                        {branch.pincode && <span className="px-3 py-1 bg-white rounded-full border border-gray-200">{branch.pincode}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-6">
                      <button
                        onClick={() => copyToClipboard(`${branch.address || ''}, ${branch.city || ''}, ${branch.state || ''} ${branch.pincode || ''}`, 'address')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copied === 'address' ? 'Copied!' : 'Copy Address'}
                      </button>
                      <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Map
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-8">
              {/* Staff Statistics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-600" />
                  Staff Overview
                </h4>
                
                {staffLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600">Loading staff data...</span>
                  </div>
                ) : staffError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800 font-medium">Error loading staff data</p>
                    <p className="text-red-600 text-sm mt-1">{staffError}</p>
                    <button
                      onClick={() => fetchBranchStaff(branch.id)}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Staff Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-600">Total Staff</p>
                        <p className="text-2xl font-bold text-blue-900">{staffData?.stats?.total || 0}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm font-medium text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-900">{staffData?.stats?.active || 0}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p className="text-sm font-medium text-red-600">Inactive</p>
                        <p className="text-2xl font-bold text-red-900">{staffData?.stats?.inactive || 0}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-medium text-purple-600">Managers</p>
                        <p className="text-2xl font-bold text-purple-900">{staffData?.stats?.roles?.branch_manager || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600">Staff Members</p>
                        <p className="text-2xl font-bold text-gray-900">{staffData?.stats?.roles?.branch_staff || 0}</p>
                      </div>
                    </div>

                    {/* Role Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h5>
                      <div className="space-y-3">
                        {Object.entries(staffData?.stats?.roles || {}).map(([role, count]) => (
                          <div key={role} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {role === 'super_admin' && <Crown className="w-4 h-4 text-purple-600" />}
                              {role === 'admin' && <Shield className="w-4 h-4 text-blue-600" />}
                              {role === 'branch_manager' && <UserCheck className="w-4 h-4 text-green-600" />}
                              {role === 'branch_staff' && <Users className="w-4 h-4 text-gray-600" />}
                              {role === 'viewer' && <Eye className="w-4 h-4 text-yellow-600" />}
                              <span className="font-medium text-gray-700 capitalize">
                                {role.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="font-bold text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Staff */}
                    {staffData?.data && staffData.data.length > 0 && (
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">Recent Staff Members</h5>
                        <div className="space-y-3">
                          {staffData.data.slice(0, 5).map((staff) => (
                            <div key={staff.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {(staff.first_name?.[0] || '').toUpperCase()}
                                    {(staff.last_name?.[0] || '').toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {staff.first_name} {staff.last_name}
                                  </p>
                                  <p className="text-sm text-gray-500">{staff.designation || staff.role}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                staff.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {staff.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8">
              {/* Contact Information Enhanced */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-blue-600" />
                  Contact Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {branch.phone && (
                    <ContactCard
                      icon={<Phone className="w-5 h-5 text-blue-600" />}
                      label="Phone Number"
                      value={branch.phone}
                      onCopy={() => copyToClipboard(branch.phone, 'phone')}
                      copied={copied === 'phone'}
                      action="Call"
                    />
                  )}
                  
                  {branch.email && (
                    <ContactCard
                      icon={<Mail className="w-5 h-5 text-green-600" />}
                      label="Email Address"
                      value={branch.email}
                      onCopy={() => copyToClipboard(branch.email, 'email')}
                      copied={copied === 'email'}
                      action="Email"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-8">
              {/* Operating Hours Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-purple-600" />
                    Operating Hours
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                      <p className="text-sm font-medium text-gray-600 mb-2">Current Schedule</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatOperatingHours(branch.opening_time, branch.closing_time)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-600">Opens</p>
                        <p className="text-xl font-bold text-green-900">{branch.opening_time || '--:--'}</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-600">Closes</p>
                        <p className="text-xl font-bold text-red-900">{branch.closing_time || '--:--'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-orange-600" />
                    Working Days
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                      <p className="text-sm font-medium text-gray-600 mb-2">Operating Days</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatWorkingDays(branch.working_days)}
                      </p>
                    </div>
                    
                    {branch.working_days && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-3">Days Breakdown</p>
                        <div className="flex flex-wrap gap-2">
                          {branch.working_days.split(',').map((day, index) => (
                            <span 
                              key={index}
                              className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium border border-blue-200"
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
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Analytics Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-indigo-600" />
                  Branch Analytics
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnalyticsCard
                    title="Staff Efficiency"
                    value={`${Math.round((staffData?.stats?.active || 0) / Math.max(staffData?.stats?.total || 1, 1) * 100)}%`}
                    change={staffData?.stats?.active > staffData?.stats?.inactive ? "+5%" : "-2%"}
                    positive={staffData?.stats?.active > staffData?.stats?.inactive}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="green"
                  />
                  <AnalyticsCard
                    title="Team Size"
                    value={`${staffData?.stats?.total || 0} Members`}
                    change="Stable"
                    positive={true}
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                  />
                  <AnalyticsCard
                    title="Branch Health"
                    value={branch.is_active ? "Excellent" : "Inactive"}
                    change={branch.is_active ? "Active" : "Inactive"}
                    positive={branch.is_active}
                    icon={<Shield className="w-6 h-6" />}
                    color="purple"
                  />
                </div>
              </div>

              {/* System Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">Created Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {branch.created_at ? new Date(branch.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {branch.updated_at ? new Date(branch.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Last viewed: {new Date().toLocaleDateString()}</span>
            {copied && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Copied to clipboard!</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => onEdit?.(branch)}
              icon={<Edit className="w-4 h-4" />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              Edit Branch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Info Card Component
function InfoCard({ label, value, onCopy, copied, mono = false, icon }) {
  return (
    <div className="group p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon}
            <label className="text-sm font-medium text-gray-600">{label}</label>
          </div>
          <p className={`text-lg font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}>
            {value || 'Not provided'}
          </p>
        </div>
        {onCopy && (
          <button
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// Enhanced Contact Card Component
function ContactCard({ icon, label, value, onCopy, copied, action }) {
  return (
    <div className="group p-6 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-600">{label}</label>
          <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={onCopy}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Card Component
function AnalyticsCard({ title, value, change, positive, icon, color }) {
  const colorClasses = {
    green: 'bg-green-500/10 text-green-600 border-green-200',
    yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          positive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}