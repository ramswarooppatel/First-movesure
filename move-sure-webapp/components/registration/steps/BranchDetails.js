"use client";
import { useState, useEffect } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import AddressComponent from '@/components/common/AddressComponent';
import ClockComponent from '@/components/common/ClockComponent';
import CalendarComponent from '@/components/common/CalendarComponent';
import { Building2, MapPin, Clock, Phone, Mail, User, Trash2, Plus, Copy, CheckCircle, Edit3, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

export default function BranchDetails({ data, updateData }) {
  const [branches, setBranches] = useState(data.branches || []);
  const [showCompanyPreset, setShowCompanyPreset] = useState(false);
  const [expandedBranches, setExpandedBranches] = useState({});

  // Enhanced company details extraction - FIXED to properly capture address data
  const companyDetails = {
    // Basic company info
    name: data.company?.name || data.companyName || data.name || '',
    registrationNumber: data.company?.registrationNumber || data.registrationNumber || '',
    gstNumber: data.company?.gstNumber || data.gstNumber || '',
    panNumber: data.company?.panNumber || data.panNumber || '',
    
    // Contact details
    phone: data.company?.phone || data.phone || '',
    email: data.company?.email || data.email || '',
    website: data.company?.website || data.website || '',
    
    // Address details - ENHANCED to capture all possible address fields
    address: data.company?.address || data.company?.fullAddress || data.address || data.fullAddress || '',
    city: data.company?.city || data.city || '',
    state: data.company?.state || data.state || '',
    country: data.company?.country || data.country || 'India',
    pincode: data.company?.pincode || data.pincode || '',
    
    // Business details
    businessType: data.company?.businessType || data.businessType || '',
    industry: data.company?.industry || data.industry || '',
    establishedYear: data.company?.establishedYear || data.establishedYear || '',
    
    // Additional details
    description: data.company?.description || data.description || '',
    employeeCount: data.company?.employeeCount || data.employeeCount || ''
  };

  // Auto-generate branch code based on company details
  const generateBranchCode = (branchNumber = null) => {
    const companyName = companyDetails.name || 'COMPANY';
    const city = companyDetails.city || 'CITY';
    
    // Create initials from company name (first 2-3 letters)
    const companyInitials = companyName
      .replace(/[^a-zA-Z\s]/g, '') // Remove special characters
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
    
    // Create city code (first 3 letters)
    const cityCode = city
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase();
    
    // Determine branch number
    const branchNum = branchNumber || (branches.length + 1);
    const branchCode = branchNum === 1 ? 'HO' : `BR${String(branchNum).padStart(2, '0')}`;
    
    return `${companyInitials}${cityCode}${branchCode}`;
  };

  // Debug log to check what company data is available
  console.log('Company Details Extracted:', companyDetails);
  console.log('Full Data Object:', data);

  // Create default branch from company details with ALL information
  const createDefaultBranch = () => {
    const defaultBranch = {
      id: 1,
      name: companyDetails.name ? `${companyDetails.name} - Head Office` : 'Branch 1',
      code: generateBranchCode(1),
      
      // Address information - ENHANCED to use ALL company address details
      address: companyDetails.address || '',
      city: companyDetails.city || '',
      state: companyDetails.state || '',
      country: companyDetails.country || 'India',
      pincode: companyDetails.pincode || '',
      
      // Contact information
      phone: companyDetails.phone || '',
      email: companyDetails.email || '',
      website: companyDetails.website || '',
      
      // Branch specific details
      manager_id: '',
      is_head_office: true,
      is_active: true,
      
      // Operating hours
      opening_time: '09:00',
      closing_time: '18:00',
      working_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
    };

    console.log('Default Branch Created:', defaultBranch);
    return defaultBranch;
  };

  // Initialize with default branch if no branches exist
  useEffect(() => {
    if (branches.length === 0) {
      const defaultBranch = createDefaultBranch();
      const initialBranches = [defaultBranch];
      setBranches(initialBranches);
      updateData('branches', initialBranches);
      
      // Expand the first branch by default
      setExpandedBranches({ 1: true });
    }
  }, []);

  // Enhanced: Update default branch when company details change - INCLUDING FULL ADDRESS
  useEffect(() => {
    if (branches.length > 0 && branches[0].id === 1) {
      console.log('Updating default branch with company details:', companyDetails);
      
      const updatedBranches = branches.map((branch, index) => {
        if (index === 0) {
          const updatedBranch = {
            ...branch,
            // Basic info
            name: companyDetails.name ? `${companyDetails.name} - Head Office` : branch.name,
            
            // COMPLETE ADDRESS UPDATE from company details - FORCE UPDATE WITH TIMESTAMP
            address: companyDetails.address || '',
            fullAddress: companyDetails.address || '', // Add both address and fullAddress
            city: companyDetails.city || '',
            state: companyDetails.state || '',
            country: companyDetails.country || 'India',
            pincode: companyDetails.pincode || '',
            
            // Contact info
            phone: companyDetails.phone || branch.phone,
            email: companyDetails.email || branch.email,
            website: companyDetails.website || branch.website,
            
            // Add timestamp to force re-render
            lastUpdated: Date.now()
          };

          console.log('Updated Default Branch:', updatedBranch);
          return updatedBranch;
        }
        return branch;
      });
      setBranches(updatedBranches);
      updateData('branches', updatedBranches);
    }
  }, [
    companyDetails.name, companyDetails.address, companyDetails.city, 
    companyDetails.state, companyDetails.country, companyDetails.phone, 
    companyDetails.email, companyDetails.website, companyDetails.pincode
  ]);

  // Toggle branch expansion
  const toggleBranchExpansion = (branchId) => {
    setExpandedBranches(prev => ({
      ...prev,
      [branchId]: !prev[branchId]
    }));
  };

  // Expand all branches
  const expandAllBranches = () => {
    const allExpanded = {};
    branches.forEach(branch => {
      allExpanded[branch.id] = true;
    });
    setExpandedBranches(allExpanded);
  };

  // Collapse all branches
  const collapseAllBranches = () => {
    setExpandedBranches({});
  };

  const addBranch = (useCompanyDetails = false) => {
    const newBranch = {
      id: Date.now(),
      name: useCompanyDetails ? `${companyDetails.name} - Branch ${branches.length + 1}` : '',
      code: useCompanyDetails ? generateBranchCode(branches.length + 1) : '',
      address: useCompanyDetails ? companyDetails.address : '',
      city: useCompanyDetails ? companyDetails.city : '',
      state: useCompanyDetails ? companyDetails.state : '',
      country: useCompanyDetails ? companyDetails.country : 'India',
      pincode: useCompanyDetails ? companyDetails.pincode : '',
      phone: useCompanyDetails ? companyDetails.phone : '',
      email: useCompanyDetails ? companyDetails.email : '',
      website: useCompanyDetails ? companyDetails.website : '',
      manager_id: '',
      is_head_office: false,
      is_active: true,
      opening_time: '09:00',
      closing_time: '18:00',
      working_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
    };
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    updateData('branches', updatedBranches);
    setShowCompanyPreset(false);
    
    // Expand the newly added branch
    setExpandedBranches(prev => ({
      ...prev,
      [newBranch.id]: true
    }));
  };

  const updateBranch = (branchId, field, value) => {
    const updated = branches.map(branch => 
      branch.id === branchId ? { ...branch, [field]: value } : branch
    );
    setBranches(updated);
    updateData('branches', updated);
  };

  const removeBranch = (branchId) => {
    // Prevent removing the default head office branch
    if (branchId === 1) {
      alert('Cannot delete the head office branch. You can modify its details instead.');
      return;
    }
    
    const updated = branches.filter(branch => branch.id !== branchId);
    setBranches(updated);
    updateData('branches', updated);
    
    // Remove from expanded state
    setExpandedBranches(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[branchId];
      return newExpanded;
    });
  };

  // ENHANCED: Address change handler that properly updates branch data
  const handleAddressChange = (branchId, addressData) => {
    console.log('Address Change for Branch:', branchId, addressData);
    console.log('Address Data Structure:', Object.keys(addressData));
    
    const updated = branches.map(branch => 
      branch.id === branchId ? { 
        ...branch, 
        // Handle multiple possible address field names
        address: addressData.fullAddress || addressData.address || addressData.streetAddress || addressData.addressLine1 || '',
        fullAddress: addressData.fullAddress || addressData.address || addressData.streetAddress || addressData.addressLine1 || '',
        
        // Location data
        city: addressData.city || '',
        state: addressData.state || '',
        pincode: addressData.pincode || addressData.zipCode || addressData.postalCode || '',
        country: addressData.country || 'India',
        
        // Additional location fields
        locality: addressData.locality || '',
        area: addressData.area || '',
        landmark: addressData.landmark || '',
        
        // Update timestamp for re-rendering
        lastUpdated: Date.now()
      } : branch
    );
    
    console.log('Updated Branches after address change:', updated);
    setBranches(updated);
    updateData('branches', updated);
  };

  // Auto-generate branch code for specific branch
  const handleGenerateBranchCode = (branchId) => {
    const branchIndex = branches.findIndex(b => b.id === branchId);
    const branchNumber = branchIndex + 1;
    const generatedCode = generateBranchCode(branchNumber);
    updateBranch(branchId, 'code', generatedCode);
  };

  const copyAllCompanyDetailsToAll = () => {
    if (branches.length === 0) return;
    
    const updated = branches.map(branch => ({
      ...branch,
      address: companyDetails.address,
      city: companyDetails.city,
      state: companyDetails.state,
      country: companyDetails.country,
      pincode: companyDetails.pincode,
      phone: companyDetails.phone,
      email: companyDetails.email,
      website: companyDetails.website
    }));
    setBranches(updated);
    updateData('branches', updated);
  };

  const copyCompanyDetailsToBranch = (branchId) => {
    const updated = branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          name: `${companyDetails.name} - ${branch.is_head_office ? 'Head Office' : 'Branch'}`,
          phone: companyDetails.phone,
          email: companyDetails.email,
          website: companyDetails.website,
          address: companyDetails.address,
          city: companyDetails.city,
          state: companyDetails.state,
          pincode: companyDetails.pincode,
          country: companyDetails.country
        };
      }
      return branch;
    });
    setBranches(updated);
    updateData('branches', updated);
  };

  const workingDaysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleWorkingDaysChange = (branchId, day) => {
    const branch = branches.find(b => b.id === branchId);
    const currentDays = branch.working_days ? branch.working_days.split(',') : [];
    
    let updatedDays;
    if (currentDays.includes(day)) {
      updatedDays = currentDays.filter(d => d !== day);
    } else {
      updatedDays = [...currentDays, day];
    }
    
    updateBranch(branchId, 'working_days', updatedDays.join(','));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Branch Management</h3>
        <p className="text-gray-600">Manage your business locations and operations</p>
      </div>

      {/* Enhanced Company Details Summary */}
      {companyDetails.name && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Company Details Available</h4>
              <p className="text-xs text-blue-700">
                {companyDetails.name} • {companyDetails.city}, {companyDetails.state}
              </p>
            </div>
            {branches.length > 1 && (
              <button
                onClick={copyAllCompanyDetailsToAll}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy to All Branches
              </button>
            )}
          </div>
          
          {/* Enhanced Company Details Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-blue-700">
            {companyDetails.phone && <div>📞 {companyDetails.phone}</div>}
            {companyDetails.email && <div>✉️ {companyDetails.email}</div>}
            {companyDetails.website && <div>🌐 {companyDetails.website}</div>}
            {companyDetails.address && <div>📍 {companyDetails.address}</div>}
            {companyDetails.gstNumber && <div>🏛️ GST: {companyDetails.gstNumber}</div>}
            {companyDetails.panNumber && <div>🆔 PAN: {companyDetails.panNumber}</div>}
            {companyDetails.businessType && <div>🏢 {companyDetails.businessType}</div>}
          </div>
        </div>
      )}

      {/* Branch Expansion Controls */}
      {branches.length > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={expandAllBranches}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            Expand All
          </button>
          <button
            onClick={collapseAllBranches}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            Collapse All
          </button>
        </div>
      )}

      {/* Default Branch Notice */}
      {branches.length === 1 && branches[0].id === 1 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="text-sm font-semibold text-green-900">Default Head Office Created</h4>
              <p className="text-xs text-green-700 mt-1">
                Your first branch has been created as the head office using your company details. All fields are editable below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {branches.map((branch, index) => {
          const isExpanded = expandedBranches[branch.id];
          
          return (
            <div key={branch.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Enhanced Branch Header - Always Visible */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {branch.id === 1 ? 'Branch 1 (Default)' : `Branch ${index + 1}`}
                        </h4>
                        {branch.is_head_office && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Head Office
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          <Edit3 className="w-3 h-3 inline mr-1" />
                          Editable
                        </span>
                        {!branch.is_active && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      {/* Branch Summary Info */}
                      <div className="mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          {branch.name && <span>{branch.name}</span>}
                          {branch.city && branch.state && (
                            <span>📍 {branch.city}, {branch.state}</span>
                          )}
                          {branch.phone && <span>📞 {branch.phone}</span>}
                          {branch.code && <span>🏷️ {branch.code}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={branch.is_head_office}
                        onChange={(e) => updateBranch(branch.id, 'is_head_office', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Head Office</span>
                    </label>
                    
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleBranchExpansion(branch.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    
                    {branch.id !== 1 && (
                      <button
                        onClick={() => removeBranch(branch.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Enhanced Company Details Integration */}
                  {companyDetails.name && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="text-sm font-medium text-gray-700">
                          Quick Fill from Company Details
                          {branch.id === 1 && (
                            <span className="ml-2 text-xs text-blue-600">(Auto-synced)</span>
                          )}
                        </h6>
                        <button
                          onClick={() => copyCompanyDetailsToBranch(branch.id)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy All Details
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div>🏢 {companyDetails.name}</div>
                        <div>📍 {companyDetails.city}, {companyDetails.state}</div>
                        <div>📞 {companyDetails.phone}</div>
                        <div>✉️ {companyDetails.email}</div>
                        <div>🌐 {companyDetails.website}</div>
                        <div>🏛️ GST: {companyDetails.gstNumber}</div>
                        {companyDetails.address && (
                          <div className="col-span-full">🏠 Address: {companyDetails.address}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Address Update Notice for Default Branch */}
                  {branch.id === 1 && companyDetails.address && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-purple-800 font-medium">
                          Address Auto-synced with Company Details
                        </p>
                      </div>
                      <p className="text-xs text-purple-600 mt-1">
                        This branch address automatically updates when you modify company address in the previous step.
                      </p>
                      <div className="mt-2 text-xs text-purple-700 bg-purple-100 rounded p-2">
                        Current: {companyDetails.address}, {companyDetails.city}, {companyDetails.state} - {companyDetails.pincode}
                      </div>
                    </div>
                  )}

                  {/* Branch Details Sections */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Basic Information
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField
                          label="Branch Name"
                          placeholder="Main Branch, Delhi Office, etc."
                          value={branch.name}
                          onChange={(value) => updateBranch(branch.id, 'name', value)}
                          required
                        />
                        
                        <CalendarComponent
                          label="Branch Established Date"
                          value={branch.established_date || ''}
                          onChange={(value) => updateBranch(branch.id, 'established_date', value)}
                          placeholder="Select establishment date"
                          disableFutureDates={true}
                        />
                        
                        {/* Enhanced Branch Code with Auto-Generate */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Code <span className="text-red-500">*</span>
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="BR001, DEL001, etc."
                              value={branch.code}
                              onChange={(e) => updateBranch(branch.id, 'code', e.target.value.toUpperCase())}
                              required
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleGenerateBranchCode(branch.id)}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              title="Auto-generate branch code"
                            >
                              <Wand2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Auto-generated format: {companyDetails.name ? `${companyDetails.name.substring(0,3).toUpperCase()}${companyDetails.city?.substring(0,3).toUpperCase() || 'CIT'}${branch.is_head_office ? 'HO' : 'BR01'}` : 'COMPANYHO/BR01'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <input
                              type="checkbox"
                              checked={branch.is_active}
                              onChange={(e) => updateBranch(branch.id, 'is_active', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Active Branch</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Address Information - ENHANCED with proper data passing */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Address Information
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Fully Editable</span>
                        {branch.id === 1 && (
                          <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Auto-synced</span>
                        )}
                      </h5>
                      
                      {/* Debug info for troubleshooting */}
                      {/* {process.env.NODE_ENV === 'development' && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                          <strong>Debug Info:</strong>
                          <div>Branch Address: {branch.address || 'Not set'}</div>
                          <div>Company Address: {companyDetails.address || 'Not set'}</div>
                          <div>Branch City: {branch.city || 'Not set'}</div>
                          <div>Company City: {companyDetails.city || 'Not set'}</div>
                        </div>
                      )} */}
                      
                      <AddressComponent
                        key={`address-${branch.id}-${branch.lastUpdated || Date.now()}`}
                        // Use data prop (original way)
                        data={{
                          address: branch.address || '',
                          city: branch.city || '',
                          state: branch.state || '',
                          pincode: branch.pincode || '',
                          country: branch.country || 'India'
                        }}
                        // Use value prop for auto-fill support
                        value={{
                          fullAddress: branch.address || '',
                          address: branch.address || '',
                          city: branch.city || '',
                          state: branch.state || '',
                          pincode: branch.pincode || '',
                          country: branch.country || 'India'
                        }}
                        onChange={(addressData) => handleAddressChange(branch.id, addressData)}
                        title=""
                        backgroundColor="bg-gray-50"
                        borderColor="border-gray-200"
                        showTitle={false}
                        prefix="Branch"
                        forceUpdate={branch.lastUpdated}
                        autoFill={branch.id === 1} // Enable auto-fill for default branch
                      />
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Information
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Phone
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="+91 98765 43210"
                              value={branch.phone}
                              onChange={(e) => updateBranch(branch.id, 'phone', e.target.value)}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              placeholder="branch@company.com"
                              value={branch.email}
                              onChange={(e) => updateBranch(branch.id, 'email', e.target.value)}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Website
                          </label>
                          <input
                            type="url"
                            placeholder="https://branch.company.com"
                            value={branch.website || ''}
                            onChange={(e) => updateBranch(branch.id, 'website', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Manager Information */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Manager Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Manager ID
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Manager will be assigned later"
                              value={branch.manager_id}
                              onChange={(e) => updateBranch(branch.id, 'manager_id', e.target.value)}
                              disabled
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 font-medium">Manager Assignment</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Managers can be assigned after user accounts are created in the system.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Operating Hours - ENHANCED with Clock Component */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Operating Hours
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                      </h5>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Opening Time
                            </label>
                            <input
                              type="time"
                              value={branch.opening_time}
                              onChange={(e) => updateBranch(branch.id, 'opening_time', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Closing Time
                            </label>
                            <input
                              type="time"
                              value={branch.closing_time}
                              onChange={(e) => updateBranch(branch.id, 'closing_time', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Working Days */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Working Days
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {workingDaysOptions.map((day) => {
                              const isSelected = branch.working_days?.split(',').includes(day);
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => handleWorkingDaysChange(branch.id, day)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {day.substring(0, 3)}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Selected days: {branch.working_days?.replace(/,/g, ', ') || 'None'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Another Branch Button */}
          <div className="text-center space-y-3">
            <button
              onClick={() => addBranch(false)}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full max-w-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Branch
            </button>
            
            {companyDetails.name && (
              <button
                onClick={() => addBranch(true)}
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full max-w-md"
              >
                <Copy className="w-5 h-5 mr-2" />
                Add Branch with Company Details
              </button>
            )}
          </div>
              </div>

              {/* Enhanced Summary */}
      {branches.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Branch Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Total Branches:</span>
              <span className="ml-2 text-blue-900 font-bold">{branches.length}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Head Offices:</span>
              <span className="ml-2 text-blue-900 font-bold">
                {branches.filter(b => b.is_head_office).length}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Active Branches:</span>
              <span className="ml-2 text-blue-900 font-bold">
                {branches.filter(b => b.is_active).length}
              </span>
            </div>
            {/* <div>
              <span className="text-blue-700 font-medium">Expanded:</span>
              <span className="ml-2 text-blue-900 font-bold">
                {Object.values(expandedBranches).filter(Boolean).length}
              </span>
            </div> */}
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 font-medium">
              ✅ All fields are fully editable • Auto-sync with company details • Smart branch codes • Clock-based time selection
            </p>
          </div>
        </div>
      )}
    </div>
  );
}