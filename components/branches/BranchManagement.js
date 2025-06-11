"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Grid,
  List,
  Settings,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Activity,
  Sparkles,
  Crown,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Globe,
  Shield,
  Target,
  Layers,
  Command,
  Calendar,
  Clock4,
  Award,
  Briefcase,
  Home,
  Building,
  MapIcon,
  FileText,
  PieChart,
  LineChart,
  DollarSign,
  UserCheck,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BranchService } from '@/services/branchService';

// Import existing components
import BranchList from './BranchList';
import BranchDetailsModal from './BranchDetailsModal';
import BranchAddModal from './BranchAddModal';
import BranchEditModal from './BranchEditModal';
import BranchViewModal from './BranchViewModal';
import BranchDeleteModal from './BranchDeleteModal';
import StaffDetailsModal from '../staff/StaffDetailsModal';
import StaffListModal from '../staff/StaffListModal';
import Button from '@/components/common/Button';

export default function BranchManagement() {
  const { user, companyId, getAuthHeaders } = useAuth();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('online');
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Modal states
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showStaffListModal, setShowStaffListModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // View mode and layout
  const [viewMode, setViewMode] = useState('grid');
  const [layoutDensity, setLayoutDensity] = useState('comfortable'); // comfortable, compact, spacious

  // Enhanced filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    is_head_office: 'all',
    city: '',
    state: '',
    sortBy: 'name',
    sortOrder: 'asc',
    dateRange: 'all'
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    headOffices: 0,
    totalStaff: 0,
    cities: 0,
    recentActivity: 0
  });

  // Get the actual company ID
  const getCompanyId = useCallback(() => {
    const userCompanyId = companyId || 
                         user?.company_id || 
                         user?.companyId || 
                         user?.company?.id ||
                         user?.profile?.company_id;
    
    return userCompanyId;
  }, [companyId, user]);

  // Calculate real-time statistics
  const calculatedStats = useMemo(() => {
    if (!branches.length) return stats;
    
    const totalBranches = branches.length;
    const activeBranches = branches.filter(b => b.is_active).length;
    const inactiveBranches = totalBranches - activeBranches;
    const headOffices = branches.filter(b => b.is_head_office).length;
    const uniqueCities = [...new Set(branches.map(b => b.city).filter(Boolean))].length;
    const totalStaff = branches.reduce((sum, b) => sum + (b.staff_count || 0), 0);
    
    return {
      total: totalBranches,
      active: activeBranches,
      inactive: inactiveBranches,
      headOffices,
      totalStaff,
      cities: uniqueCities,
      recentActivity: branches.filter(b => {
        const updated = new Date(b.updated_at || b.created_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return updated > dayAgo;
      }).length
    };
  }, [branches, stats]);

  // Connection status monitoring
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Optimized fetch function with enhanced features
  const fetchBranches = useCallback(async (page = 1, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      if (!showLoader) setRefreshing(true);
      setError(null);
      
      const userCompanyId = getCompanyId();
      
      if (!userCompanyId) {
        throw new Error('Company ID not available. Please refresh and try again.');
      }
      
      const response = await BranchService.getBranches({
        page,
        limit: 12,
        companyId: userCompanyId,
        ...filters
      });

      setBranches(response.branches || []);
      setPagination(response.pagination || {});
      setLastUpdated(new Date());
      
      // Update stats if we got new data
      if (response.branches) {
        setStats(prev => ({
          ...prev,
          total: response.pagination?.totalItems || response.branches.length
        }));
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.message || 'Failed to load branches');
      setBranches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getCompanyId, filters]);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === 'online' && !loading) {
        fetchBranches(pagination.currentPage, false);
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [fetchBranches, pagination.currentPage, connectionStatus, loading]);

  // Debounced search effect with improved UX
  useEffect(() => {
    const userCompanyId = getCompanyId();
    
    if (userCompanyId) {
      const timeoutId = setTimeout(() => {
        fetchBranches(1);
      }, filters.search ? 500 : 300); // Longer debounce for search
      
      return () => clearTimeout(timeoutId);
    } else if (user === null || user === undefined) {
      setLoading(true);
    } else {
      setError('No company associated with your account. Please contact support.');
      setLoading(false);
    }
  }, [filters, getCompanyId, user, fetchBranches]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    fetchBranches(newPage);
  };

  const handleRefresh = async () => {
    await fetchBranches(pagination.currentPage, false);
  };

  // Enhanced CRUD operations
  const handleAddBranch = () => {
    setShowAddModal(true);
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setShowViewModal(true);
  };

  const handleDeleteBranch = (branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const handleBranchCreated = () => {
    setShowAddModal(false);
    fetchBranches(pagination.currentPage);
  };

  const handleBranchUpdated = () => {
    setShowEditModal(false);
    setSelectedBranch(null);
    fetchBranches(pagination.currentPage);
  };

  const handleBranchDeleted = async () => {
    if (selectedBranch) {
      try {
        const result = await BranchService.deleteBranch(selectedBranch.id, getAuthHeaders());
        
        if (result.success) {
          setShowDeleteModal(false);
          setSelectedBranch(null);
          fetchBranches(pagination.currentPage);
        } else {
          console.error('Failed to delete branch:', result.error);
          alert(`Failed to delete branch: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting branch:', error);
        alert('An unexpected error occurred while deleting the branch.');
      }
    }
  };

  // Staff operations
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setShowStaffModal(true);
  };

  const handleViewBranchStaff = (branch) => {
    const userCompanyId = getCompanyId();
    
    if (!userCompanyId) {
      alert('Company ID not available. Please refresh and try again.');
      return;
    }
    
    setSelectedBranch(branch);
    setShowStaffListModal(true);
  };

  // Utility functions
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      is_head_office: 'all',
      city: '',
      state: '',
      sortBy: 'name',
      sortOrder: 'asc',
      dateRange: 'all'
    });
  };

  const exportData = () => {
    // Implement export functionality
    console.log('Exporting branch data...');
  };

  // Modal close handlers
  const closeBranchModal = () => {
    setShowBranchModal(false);
    setSelectedBranch(null);
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setSelectedStaff(null);
  };

  const closeStaffListModal = () => {
    setShowStaffListModal(false);
    setSelectedBranch(null);
  };

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Loading Branch Management</h3>
              <p className="text-gray-600">Fetching your business locations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Unable to Load Branches</h3>
                <p className="text-red-600 mb-4">{error}</p>
              </div>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => fetchBranches(1)}
                  variant="outline"
                  icon={<RefreshCw className="w-4 h-4" />}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-400/5 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Geometric patterns */}
          <div className="absolute top-20 right-20 w-48 h-48 border border-blue-100/30 rounded-xl rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-40 left-40 w-32 h-32 border border-purple-100/30 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Spectacular Header */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  {/* Enhanced Icon Container */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Sparkles className="w-4 h-4 text-yellow-900" />
                    </div>
                    {connectionStatus === 'online' && (
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Wifi className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                        Branch Management
                      </h1>
                      <div className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-full">
                        <span className="text-blue-800 text-sm font-medium">{calculatedStats.total} Locations</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-lg">
                      Manage your business locations and operations with advanced insights
                    </p>
                    
                    {/* Live Status Indicators */}
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                        <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock4 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                      </div>
                      {refreshing && (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                          <span className="text-sm text-blue-600">Syncing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={exportData}
                    variant="outline"
                    icon={<Download className="w-4 h-4" />}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Export
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    icon={refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    disabled={refreshing}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    {refreshing ? 'Syncing...' : 'Refresh'}
                  </Button>
                  <Button
                    onClick={handleAddBranch}
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  >
                    Add Branch
                  </Button>
                </div>
              </div>

              {/* Enhanced Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.total}</p>
                      <p className="text-sm text-gray-600">Total Branches</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.active}</p>
                      <p className="text-sm text-gray-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.headOffices}</p>
                      <p className="text-sm text-gray-600">Head Offices</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.totalStaff}</p>
                      <p className="text-sm text-gray-600">Total Staff</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <MapIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.cities}</p>
                      <p className="text-sm text-gray-600">Cities</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.recentActivity}</p>
                      <p className="text-sm text-gray-600">Recent Updates</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{calculatedStats.inactive}</p>
                      <p className="text-sm text-gray-600">Inactive</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters Panel */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="p-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Smart Filters & Search</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    variant="outline"
                    size="sm"
                    icon={<Settings className="w-4 h-4" />}
                  >
                    Advanced
                  </Button>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    disabled={JSON.stringify(filters) === JSON.stringify({
                      search: '',
                      status: 'all',
                      is_head_office: 'all',
                      city: '',
                      state: '',
                      sortBy: 'name',
                      sortOrder: 'asc',
                      dateRange: 'all'
                    })}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Primary Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Enhanced Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Branches</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name, city, code..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    />
                    {filters.search && (
                      <button
                        onClick={() => handleFilterChange('search', '')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="active">✅ Active</option>
                    <option value="inactive">⭕ Inactive</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch Type</label>
                  <select
                    value={filters.is_head_office}
                    onChange={(e) => handleFilterChange('is_head_office', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="all">All Types</option>
                    <option value="true">👑 Head Office</option>
                    <option value="false">🏢 Branch</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden bg-white/70 backdrop-blur-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 p-3 flex items-center justify-center space-x-2 transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                      <span className="text-sm font-medium">Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`flex-1 p-3 flex items-center justify-center space-x-2 transition-all duration-200 ${
                        viewMode === 'table' 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                      <span className="text-sm font-medium">Table</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Filter by city"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        placeholder="Filter by state"
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      >
                        <option value="name">Name</option>
                        <option value="city">City</option>
                        <option value="created_at">Date Created</option>
                        <option value="updated_at">Last Updated</option>
                        <option value="staff_count">Staff Count</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>

                  {/* Layout Density */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Layout Density</label>
                    <div className="flex space-x-2">
                      {['compact', 'comfortable', 'spacious'].map(density => (
                        <button
                          key={density}
                          onClick={() => setLayoutDensity(density)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            layoutDensity === density
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {density.charAt(0).toUpperCase() + density.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(filters.search || filters.status !== 'all' || filters.is_head_office !== 'all' || filters.city || filters.state) && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600 font-medium">Active Filters:</span>
                    <div className="flex flex-wrap gap-2">
                      {filters.search && (
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Search: &quot;{filters.search}&quot;
                          <button
                            onClick={() => handleFilterChange('search', '')}
                            className="ml-2 hover:text-blue-600"
                          >×</button>
                        </span>
                      )}
                      {filters.status !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          Status: {filters.status}
                          <button
                            onClick={() => handleFilterChange('status', 'all')}
                            className="ml-2 hover:text-green-600"
                          >×</button>
                        </span>
                      )}
                      {filters.is_head_office !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Type: {filters.is_head_office === 'true' ? 'Head Office' : 'Branch'}
                          <button
                            onClick={() => handleFilterChange('is_head_office', 'all')}
                            className="ml-2 hover:text-yellow-600"
                          >×</button>
                        </span>
                      )}
                      {filters.city && (
                        <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                          City: {filters.city}
                          <button
                            onClick={() => handleFilterChange('city', '')}
                            className="ml-2 hover:text-purple-600"
                          >×</button>
                        </span>
                      )}
                      {filters.state && (
                        <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                          State: {filters.state}
                          <button
                            onClick={() => handleFilterChange('state', '')}
                            className="ml-2 hover:text-indigo-600"
                          >×</button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Branches List */}
          <div className="bg-grey/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <BranchList
              branches={branches}
              onUpdate={fetchBranches}
              pagination={{
                page: pagination.currentPage,
                limit: 12,
                total: pagination.totalItems
              }}
              onPageChange={handlePageChange}
              viewMode={viewMode}
              layoutDensity={layoutDensity}
              onViewBranchStaff={handleViewBranchStaff}
            />
          </div>
        </div>
      </div>

      {/* All Modals using existing components */}
      
      {/* Legacy Branch Details Modal */}
      <BranchDetailsModal 
        isOpen={showBranchModal}
        onClose={closeBranchModal}
        branch={selectedBranch}
      />

      {/* New CRUD Modals */}
      {showAddModal && (
        <BranchAddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleBranchCreated}
        />
      )}

      {showEditModal && selectedBranch && (
        <BranchEditModal
          branch={selectedBranch}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
          onSuccess={handleBranchUpdated}
        />
      )}

      {showViewModal && selectedBranch && (
        <BranchViewModal
          branch={selectedBranch}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBranch(null);
          }}
          onEdit={handleEditBranch}
        />
      )}

      {showDeleteModal && selectedBranch && (
        <BranchDeleteModal
          branch={selectedBranch}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBranch(null);
          }}
          onConfirm={handleBranchDeleted}
        />
      )}
      
      {/* Staff Modals */}
      <StaffDetailsModal 
        isOpen={showStaffModal}
        onClose={closeStaffModal}
        staff={selectedStaff}
      />

      <StaffListModal 
        isOpen={showStaffListModal}
        onClose={closeStaffListModal}
        branch={selectedBranch}
        companyId={getCompanyId()}
      />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </>
  );
}

