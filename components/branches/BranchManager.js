"use client";
import { useState } from 'react';
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
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import BranchAddModal from './BranchAddModal';
import BranchEditModal from './BranchEditModal';
import BranchViewModal from './BranchViewModal';
import BranchDeleteModal from './BranchDeleteModal';
import Button from '@/components/common/Button';

export default function BranchManager() {
  const { branches, loading, error, pagination, fetchBranches, createBranch, updateBranch, deleteBranch } = useBranches();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  // View and filter states
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    is_head_office: 'all',
    city: '',
    state: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchBranches({ page: 1, ...newFilters });
  };

  const handlePageChange = (page) => {
    fetchBranches({ page, ...filters });
  };

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

  const handleRefresh = () => {
    fetchBranches({ ...filters });
  };

  const handleBranchCreated = () => {
    setShowAddModal(false);
    // fetchBranches is called automatically by the hook
  };

  const handleBranchUpdated = () => {
    setShowEditModal(false);
    setSelectedBranch(null);
    // fetchBranches is called automatically by the hook
  };

  const handleBranchDeleted = async () => {
    if (selectedBranch) {
      try {
        await deleteBranch(selectedBranch.id);
        setShowDeleteModal(false);
        setSelectedBranch(null);
      } catch (error) {
        // Error handled by the hook
      }
    }
  };

  if (loading && branches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading branches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-800 font-medium mb-2">Error Loading Branches</div>
        <div className="text-red-600 text-sm mb-4">{error}</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600">Manage your business locations and operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            onClick={handleAddBranch}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Branch
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search branches..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.is_head_office}
              onChange={(e) => handleFilterChange('is_head_office', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="true">Head Office</option>
              <option value="false">Branch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Filter by city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Branches List/Grid */}
      {branches.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
          <p className="text-gray-600 mb-6">
            {Object.values(filters).some(f => f && f !== 'all') 
              ? 'No branches match your current filters.' 
              : 'Get started by adding your first branch.'}
          </p>
          <Button
            onClick={handleAddBranch}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Your First Branch
          </Button>
        </div>
      ) : (
        <BranchDisplay
          branches={branches}
          viewMode={viewMode}
          onEdit={handleEditBranch}
          onView={handleViewBranch}
          onDelete={handleDeleteBranch}
          loading={loading}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.currentPage - 1) * 12) + 1} to {Math.min(pagination.currentPage * 12, pagination.totalItems)} of {pagination.totalItems} branches
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
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
    </div>
  );
}

// Branch Display Component
function BranchDisplay({ branches, viewMode, onEdit, onView, onDelete, loading }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <BranchCard 
            key={branch.id} 
            branch={branch} 
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map(branch => (
              <BranchTableRow 
                key={branch.id} 
                branch={branch} 
                onEdit={onEdit}
                onView={onView}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Branch Card Component
function BranchCard({ branch, onEdit, onView, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{branch.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{branch.code}</span>
              {branch.is_head_office && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Head Office
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(branch)}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(branch)}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Branch"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(branch)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Branch"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 text-sm">
        {branch.address && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{branch.address}, {branch.city}, {branch.state}</span>
          </div>
        )}
        {branch.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{branch.phone}</span>
          </div>
        )}
        {branch.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{branch.email}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className={`px-2 py-1 rounded-full ${
            branch.is_active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {branch.is_active ? 'Active' : 'Inactive'}
          </span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{branch.opening_time} - {branch.closing_time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Branch Table Row Component
function BranchTableRow({ branch, onEdit, onView, onDelete }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{branch.name}</div>
            <div className="text-sm text-gray-500">{branch.code}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{branch.city}, {branch.state}</div>
        <div className="text-sm text-gray-500">{branch.address}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{branch.phone}</div>
        <div className="text-sm text-gray-500">{branch.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          branch.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {branch.is_active ? 'Active' : 'Inactive'}
        </span>
        {branch.is_head_office && (
          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Head Office
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(branch)}
            className="text-blue-600 hover:text-blue-700 p-1 rounded"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(branch)}
            className="text-green-600 hover:text-green-700 p-1 rounded"
            title="Edit Branch"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(branch)}
            className="text-red-600 hover:text-red-700 p-1 rounded"
            title="Delete Branch"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}