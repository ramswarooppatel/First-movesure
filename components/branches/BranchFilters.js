"use client";
import { useState, useEffect } from 'react';
import { 
  Filter, 
  X, 
  MapPin, 
  Building2, 
  Crown, 
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function BranchFilters({ filters, onFilterChange, branches }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      is_head_office: 'all',
      city: '',
      state: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return localFilters.status !== 'all' || 
           localFilters.is_head_office !== 'all' || 
           localFilters.city !== '' || 
           localFilters.state !== '';
  };

  // Get unique cities and states from branches
  const cities = [...new Set(branches.map(b => b.city).filter(Boolean))].sort();
  const states = [...new Set(branches.map(b => b.state).filter(Boolean))].sort();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-semibold text-gray-900">Filters</h4>
          {hasActiveFilters() && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            icon={<RotateCcw className="w-4 h-4" />}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Head Office Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Crown className="w-4 h-4 inline mr-1" />
            Branch Type
          </label>
          <select
            value={localFilters.is_head_office}
            onChange={(e) => handleFilterChange('is_head_office', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="true">Head Office Only</option>
            <option value="false">Regular Branches</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            City
          </label>
          <select
            value={localFilters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            State
          </label>
          <select
            value={localFilters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {localFilters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Status: {localFilters.status}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.is_head_office !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Type: {localFilters.is_head_office === 'true' ? 'Head Office' : 'Regular Branch'}
                <button
                  onClick={() => handleFilterChange('is_head_office', 'all')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.city && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                City: {localFilters.city}
                <button
                  onClick={() => handleFilterChange('city', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.state && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                State: {localFilters.state}
                <button
                  onClick={() => handleFilterChange('state', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}