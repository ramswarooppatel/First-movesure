"use client";
import { useState, useEffect } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import AddressComponent from '@/components/common/AddressComponent';
import { 
  User, 
  Users, 
  Phone, 
  Mail, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Shield, 
  Trash2, 
  Plus, 
  Copy, 
  CheckCircle, 
  Edit3,
  Crown,
  UserCheck,
  Building2
} from 'lucide-react';

export default function StaffDetails({ data, updateData }) {
  const [staff, setStaff] = useState(data.staff || []);
  const [showOwnerPreset, setShowOwnerPreset] = useState(false);

  // Extract owner details from data (from OwnerDetails.js)
  const ownerDetails = {
    // Personal information
    firstName: data.owner?.firstName || '',
    lastName: data.owner?.lastName || '',
    middleName: data.owner?.middleName || '',
    email: data.owner?.email || '',
    phone: data.owner?.phone || '',
    dateOfBirth: data.owner?.dateOfBirth || '',
    gender: data.owner?.gender || '',
    
    // Identity documents
    aadhaarNumber: data.owner?.aadhaarNumber || '',
    panNumber: data.owner?.panNumber || '',
    
    // Address information
    address: data.owner?.address || '',
    city: data.owner?.city || '',
    state: data.owner?.state || '',
    pincode: data.owner?.pincode || '',
    
    // Professional information
    designation: data.owner?.designation || 'Super Admin',
    department: data.owner?.department || 'Management',
    
    // Emergency contact
    emergencyContactName: data.owner?.emergencyContactName || '',
    emergencyContactPhone: data.owner?.emergencyContactPhone || '',
    
    // Account credentials
    username: data.owner?.username || ''
  };

  // Get branches for assignment
  const branches = data.branches || [];
  const headOfficeBranch = branches.find(b => b.is_head_office) || branches[0];

  // Create default staff member from owner details
  const createDefaultStaff = () => {
    return {
      id: 1,
      // Branch assignment
      branch_id: headOfficeBranch?.id || null,
      
      // Account credentials
      username: ownerDetails.username || '',
      email: ownerDetails.email || '',
      phone: ownerDetails.phone || '',
      phone_verified: data.owner?.phoneVerified || false,
      
      // Identity documents
      aadhar_number: ownerDetails.aadhaarNumber || '',
      pan_number: ownerDetails.panNumber || '',
      
      // Personal information
      first_name: ownerDetails.firstName || '',
      last_name: ownerDetails.lastName || '',
      middle_name: ownerDetails.middleName || '',
      date_of_birth: ownerDetails.dateOfBirth || '',
      gender: ownerDetails.gender || '',
      
      // Professional information
      designation: 'Super Admin',
      department: 'Management',
      role: 'super_admin',
      salary: '',
      joining_date: new Date().toISOString().split('T')[0],
      reporting_manager_id: null,
      
      // Address information
      address: ownerDetails.address || '',
      city: ownerDetails.city || '',
      state: ownerDetails.state || '',
      pincode: ownerDetails.pincode || '',
      
      // Emergency contact
      emergency_contact_name: ownerDetails.emergencyContactName || '',
      emergency_contact_phone: ownerDetails.emergencyContactPhone || '',
      
      // Additional fields
      language_preference: 'en',
      profile_picture_url: '',
      is_active: true,
      
      // UI specific
      isOwner: true
    };
  };

  // Initialize with default staff if no staff exist
  useEffect(() => {
    if (staff.length === 0) {
      const defaultStaff = createDefaultStaff();
      const initialStaff = [defaultStaff];
      setStaff(initialStaff);
      updateData('staff', initialStaff);
    }
  }, []);

  // Update default staff when owner details change
  useEffect(() => {
    if (staff.length > 0 && staff[0].id === 1 && ownerDetails.firstName) {
      const updatedStaff = staff.map((member, index) => {
        if (index === 0) {
          return {
            ...member,
            username: ownerDetails.username || member.username,
            email: ownerDetails.email || member.email,
            phone: ownerDetails.phone || member.phone,
            first_name: ownerDetails.firstName || member.first_name,
            last_name: ownerDetails.lastName || member.last_name,
            middle_name: ownerDetails.middleName || member.middle_name,
            date_of_birth: ownerDetails.dateOfBirth || member.date_of_birth,
            gender: ownerDetails.gender || member.gender,
            aadhar_number: ownerDetails.aadhaarNumber || member.aadhar_number,
            pan_number: ownerDetails.panNumber || member.pan_number,
            address: ownerDetails.address || member.address,
            city: ownerDetails.city || member.city,
            state: ownerDetails.state || member.state,
            pincode: ownerDetails.pincode || member.pincode,
            emergency_contact_name: ownerDetails.emergencyContactName || member.emergency_contact_name,
            emergency_contact_phone: ownerDetails.emergencyContactPhone || member.emergency_contact_phone,
            branch_id: headOfficeBranch?.id || member.branch_id
          };
        }
        return member;
      });
      setStaff(updatedStaff);
      updateData('staff', updatedStaff);
    }
  }, [
    ownerDetails.firstName, ownerDetails.email, ownerDetails.phone,
    ownerDetails.username, ownerDetails.aadhaarNumber, ownerDetails.panNumber,
    ownerDetails.address, ownerDetails.city, ownerDetails.state,
    headOfficeBranch?.id
  ]);

  const addStaff = (useOwnerDetails = false) => {
    const newStaff = {
      id: Date.now(),
      branch_id: headOfficeBranch?.id || null,
      username: '',
      email: '',
      phone: '',
      phone_verified: false,
      aadhar_number: '',
      pan_number: '',
      first_name: useOwnerDetails ? ownerDetails.firstName : '',
      last_name: useOwnerDetails ? ownerDetails.lastName : '',
      middle_name: useOwnerDetails ? ownerDetails.middleName : '',
      designation: useOwnerDetails ? 'Branch Manager' : '',
      department: useOwnerDetails ? ownerDetails.department : '',
      date_of_birth: '',
      gender: '',
      language_preference: 'en',
      address: useOwnerDetails ? ownerDetails.address : '',
      city: useOwnerDetails ? ownerDetails.city : '',
      state: useOwnerDetails ? ownerDetails.state : '',
      pincode: useOwnerDetails ? ownerDetails.pincode : '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      profile_picture_url: '',
      role: 'branch_staff',
      salary: '',
      joining_date: new Date().toISOString().split('T')[0],
      reporting_manager_id: staff.find(s => s.role === 'super_admin')?.id || null,
      is_active: true,
      isOwner: false
    };
    const updatedStaff = [...staff, newStaff];
    setStaff(updatedStaff);
    updateData('staff', updatedStaff);
  };

  const updateStaff = (staffId, field, value) => {
    const updated = staff.map(member => 
      member.id === staffId ? { ...member, [field]: value } : member
    );
    setStaff(updated);
    updateData('staff', updated);
  };

  const removeStaff = (staffId) => {
    // Prevent removing the owner/super admin
    if (staffId === 1) {
      alert('Cannot delete the owner/super admin account. You can modify details instead.');
      return;
    }
    
    const updated = staff.filter(member => member.id !== staffId);
    setStaff(updated);
    updateData('staff', updated);
  };

  const handleAddressChange = (staffId, addressData) => {
    const updated = staff.map(member => 
      member.id === staffId ? { 
        ...member, 
        address: addressData.fullAddress,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode
      } : member
    );
    setStaff(updated);
    updateData('staff', updated);
  };

  const copyOwnerDetailsToStaff = (staffId) => {
    const updated = staff.map(member => {
      if (member.id === staffId) {
        return {
          ...member,
          first_name: ownerDetails.firstName,
          last_name: ownerDetails.lastName,
          middle_name: ownerDetails.middleName,
          email: ownerDetails.email,
          phone: ownerDetails.phone,
          address: ownerDetails.address,
          city: ownerDetails.city,
          state: ownerDetails.state,
          pincode: ownerDetails.pincode,
          date_of_birth: ownerDetails.dateOfBirth,
          gender: ownerDetails.gender
        };
      }
      return member;
    });
    setStaff(updated);
    updateData('staff', updated);
  };

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'admin', label: 'Admin', color: 'bg-blue-100 text-blue-800' },
    { value: 'branch_manager', label: 'Branch Manager', color: 'bg-green-100 text-green-800' },
    { value: 'branch_staff', label: 'Branch Staff', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'viewer', label: 'Viewer', color: 'bg-gray-100 text-gray-800' }
  ];

  const getRoleColor = (role) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Management</h3>
        <p className="text-gray-600">Manage your team members and their roles</p>
      </div>

      {/* Owner Details Summary */}
      {ownerDetails.firstName && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-purple-900 mb-1">Owner Details Available</h4>
              <p className="text-xs text-purple-700">
                {ownerDetails.firstName} {ownerDetails.lastName} • {ownerDetails.email}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Owner Account</span>
            </div>
          </div>
        </div>
      )}

      {/* Default Staff Notice */}
      {staff.length === 1 && staff[0].id === 1 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="text-sm font-semibold text-green-900">Owner Account Created</h4>
              <p className="text-xs text-green-700 mt-1">
                Your owner account has been created as Super Admin. All details are editable and sync with owner information.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {staff.map((member, index) => (
          <div key={member.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            {/* Staff Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  member.isOwner ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {member.isOwner ? (
                    <Crown className="w-5 h-5 text-purple-600" />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {member.id === 1 ? 'Staff 1 (Owner)' : `Staff ${index + 1}`}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                      {roleOptions.find(r => r.value === member.role)?.label || member.role}
                    </span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Fully Editable
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    {member.id === 1 ? 'Primary owner account with full system access' : 'Configure staff member details and permissions'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={member.is_active}
                    onChange={(e) => updateStaff(member.id, 'is_active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Active</span>
                </label>
                {member.id !== 1 && (
                  <button
                    onClick={() => removeStaff(member.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Owner Details Integration for non-owner staff */}
            {ownerDetails.firstName && member.id !== 1 && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="text-sm font-medium text-gray-700">Quick Fill from Owner Details</h6>
                  <button
                    onClick={() => copyOwnerDetailsToStaff(member.id)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Owner Details
                  </button>
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>👤 {ownerDetails.firstName} {ownerDetails.lastName}</div>
                  <div>📞 {ownerDetails.phone}</div>
                  <div>✉️ {ownerDetails.email}</div>
                  <div>📍 {ownerDetails.city}, {ownerDetails.state}</div>
                </div>
              </div>
            )}

            {/* Owner Auto-Sync Notice */}
            {member.id === 1 && ownerDetails.firstName && (
              <div className="mb-6 bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <p className="text-sm text-purple-800 font-medium">
                    Auto-synced with Owner Details
                  </p>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  This account automatically updates when you modify owner details in the previous step.
                </p>
              </div>
            )}

            {/* Staff Details Sections */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Basic Information
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="First Name"
                    placeholder="Enter first name"
                    value={member.first_name}
                    onChange={(value) => updateStaff(member.id, 'first_name', value)}
                    required
                  />
                  <InputField
                    label="Middle Name"
                    placeholder="Enter middle name"
                    value={member.middle_name}
                    onChange={(value) => updateStaff(member.id, 'middle_name', value)}
                  />
                  <InputField
                    label="Last Name"
                    placeholder="Enter last name"
                    value={member.last_name}
                    onChange={(value) => updateStaff(member.id, 'last_name', value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={member.date_of_birth}
                      onChange={(e) => updateStaff(member.id, 'date_of_birth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={member.gender}
                      onChange={(e) => updateStaff(member.id, 'gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language Preference
                    </label>
                    <select
                      value={member.language_preference}
                      onChange={(e) => updateStaff(member.id, 'language_preference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="bn">Bengali</option>
                      <option value="te">Telugu</option>
                      <option value="mr">Marathi</option>
                      <option value="ta">Tamil</option>
                      <option value="gu">Gujarati</option>
                      <option value="kn">Kannada</option>
                      <option value="ml">Malayalam</option>
                      <option value="pa">Punjabi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Information
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={member.phone}
                        onChange={(e) => updateStaff(member.id, 'phone', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {member.phone_verified && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="staff@company.com"
                        value={member.email}
                        onChange={(e) => updateStaff(member.id, 'email', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <InputField
                    label="Username"
                    placeholder="unique_username"
                    value={member.username}
                    onChange={(value) => updateStaff(member.id, 'username', value.toLowerCase())}
                  />
                </div>
              </div>

              {/* Identity Documents */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Identity Documents
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Aadhaar Number"
                    placeholder="1234 5678 9012"
                    value={member.aadhar_number}
                    onChange={(value) => updateStaff(member.id, 'aadhar_number', value)}
                  />
                  <InputField
                    label="PAN Number"
                    placeholder="ABCDE1234F"
                    value={member.pan_number}
                    onChange={(value) => updateStaff(member.id, 'pan_number', value.toUpperCase())}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Professional Information
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField
                    label="Designation"
                    placeholder="Software Engineer"
                    value={member.designation}
                    onChange={(value) => updateStaff(member.id, 'designation', value)}
                  />
                  <InputField
                    label="Department"
                    placeholder="Engineering"
                    value={member.department}
                    onChange={(value) => updateStaff(member.id, 'department', value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={member.role}
                      onChange={(e) => updateStaff(member.id, 'role', e.target.value)}
                      disabled={member.id === 1} // Owner role cannot be changed
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    {member.id === 1 && (
                      <p className="text-xs text-gray-500 mt-1">Owner role cannot be changed</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch Assignment
                    </label>
                    <select
                      value={member.branch_id || ''}
                      onChange={(e) => updateStaff(member.id, 'branch_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} {branch.is_head_office && '(Head Office)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={member.joining_date}
                      onChange={(e) => updateStaff(member.id, 'joining_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <InputField
                    label="Salary"
                    placeholder="50000"
                    type="number"
                    value={member.salary}
                    onChange={(value) => updateStaff(member.id, 'salary', value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reporting Manager
                    </label>
                    <select
                      value={member.reporting_manager_id || ''}
                      onChange={(e) => updateStaff(member.id, 'reporting_manager_id', e.target.value)}
                      disabled={member.id === 1} // Owner doesn't report to anyone
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Manager</option>
                      {staff.filter(s => s.id !== member.id && (s.role === 'super_admin' || s.role === 'admin' || s.role === 'branch_manager')).map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.first_name} {manager.last_name} ({manager.designation})
                        </option>
                      ))}
                    </select>
                    {member.id === 1 && (
                      <p className="text-xs text-gray-500 mt-1">Owner doesnt report to anyone</p>
                    )}
                  </div>
                  <InputField
                    label="Profile Picture URL"
                    placeholder="https://example.com/profile.jpg"
                    value={member.profile_picture_url}
                    onChange={(value) => updateStaff(member.id, 'profile_picture_url', value)}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address Information
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                </h5>
                <AddressComponent
                  value={{
                    fullAddress: member.address,
                    city: member.city,
                    state: member.state,
                    pincode: member.pincode
                  }}
                  onChange={(addressData) => handleAddressChange(member.id, addressData)}
                  title=""
                  backgroundColor="bg-gray-50"
                  borderColor="border-gray-200"
                  showTitle={false}
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Editable</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Emergency Contact Name"
                    placeholder="Full name of emergency contact"
                    value={member.emergency_contact_name}
                    onChange={(value) => updateStaff(member.id, 'emergency_contact_name', value)}
                  />
                  <InputField
                    label="Emergency Contact Phone"
                    placeholder="+91 9876543210"
                    value={member.emergency_contact_phone}
                    onChange={(value) => updateStaff(member.id, 'emergency_contact_phone', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Staff Button */}
        <div className="text-center space-y-3">
          {/* <button
            onClick={() => addStaff(false)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full max-w-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Staff Member
          </button> */}
          
          {ownerDetails.firstName && (
            <button
              onClick={() => addStaff(true)}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full max-w-md"
            >
              <Copy className="w-5 h-5 mr-2" />
              Add Staff with Owner Details
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      {staff.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Staff Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Total Staff:</span>
              <span className="ml-2 text-blue-900 font-bold">{staff.length}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Active Staff:</span>
              <span className="ml-2 text-blue-900 font-bold">
                {staff.filter(s => s.is_active).length}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Admins:</span>
              <span className="ml-2 text-blue-900 font-bold">
                {staff.filter(s => s.role === 'super_admin' || s.role === 'admin').length}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Managers:</span>
              <span className="ml-2 text-blue-900 font-bold">
                {staff.filter(s => s.role === 'branch_manager').length}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 font-medium">
              ✅ All fields are fully editable • Auto-sync with owner details • Schema compliant • Role-based access
            </p>
          </div>
        </div>
      )}
    </div>
  );
}