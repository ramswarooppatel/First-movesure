"use client";
import { 
  Building2, 
  User, 
  MapPin, 
  Users, 
  Globe, 
  CheckCircle, 
  Camera, 
  X, 
  FileText 
} from 'lucide-react';

export default function DetailedSummary({ data, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const maskSensitiveData = (data, length = 4) => {
    if (!data) return 'N/A';
    return '*'.repeat(Math.max(0, data.length - length)) + data.slice(-length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Registration Summary</h3>
                <p className="text-blue-100">Complete details of your registration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Company Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h5 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-3" />
                Company Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Company Name</span>
                  <p className="text-gray-900 font-semibold">{data.company?.name || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Registration Number</span>
                  <p className="text-gray-900 font-semibold">{data.company?.registrationNumber || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">GST Number</span>
                  <p className="text-gray-900 font-semibold">{data.company?.gstNumber || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">PAN Number</span>
                  <p className="text-gray-900 font-semibold">{data.company?.panNumber || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <p className="text-gray-900 font-semibold">{data.company?.email || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Phone</span>
                  <p className="text-gray-900 font-semibold">{data.company?.phone || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Website</span>
                  <p className="text-gray-900 font-semibold">{data.company?.website || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Industry</span>
                  <p className="text-gray-900 font-semibold">{data.industry || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Category</span>
                  <p className="text-gray-900 font-semibold">{data.category || 'N/A'}</p>
                </div>
                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                  <span className="text-sm font-medium text-gray-600">Address</span>
                  <p className="text-gray-900 font-semibold">
                    {data.company?.address || 'N/A'}, {data.company?.city || 'N/A'}, {data.company?.state || 'N/A'} - {data.company?.pincode || 'N/A'}
                  </p>
                </div>
                {data.company?.description && (
                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <span className="text-sm font-medium text-gray-600">Description</span>
                    <p className="text-gray-900 font-semibold">{data.company.description}</p>
                  </div>
                )}
                {data.company?.logo && (
                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <span className="text-sm font-medium text-gray-600 flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      Company Logo
                    </span>
                    <p className="text-green-600 font-semibold">✓ Uploaded ({data.company?.logoFileName || 'company-logo.jpg'})</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Details */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h5 className="text-xl font-bold text-purple-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3" />
                Admin Account Details
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Full Name</span>
                  <p className="text-gray-900 font-semibold">
                    {data.owner?.firstName} {data.owner?.middleName} {data.owner?.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Username</span>
                  <p className="text-gray-900 font-semibold">{data.owner?.username || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 font-semibold">{data.owner?.email || 'N/A'}</p>
                    {data.owner?.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Phone</span>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 font-semibold">{data.owner?.phone || 'N/A'}</p>
                    {data.owner?.phoneVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Date of Birth</span>
                  <p className="text-gray-900 font-semibold">{formatDate(data.owner?.dateOfBirth)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Gender</span>
                  <p className="text-gray-900 font-semibold">{data.owner?.gender || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Designation</span>
                  <p className="text-gray-900 font-semibold">{data.owner?.designation || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Department</span>
                  <p className="text-gray-900 font-semibold">{data.owner?.department || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Aadhaar</span>
                  <p className="text-gray-900 font-semibold">{maskSensitiveData(data.owner?.aadhaarNumber)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">PAN</span>
                  <p className="text-gray-900 font-semibold">{data.owner?.panNumber || 'N/A'}</p>
                </div>
                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                  <span className="text-sm font-medium text-gray-600">Address</span>
                  <p className="text-gray-900 font-semibold">
                    {data.owner?.address || 'N/A'}, {data.owner?.city || 'N/A'}, {data.owner?.state || 'N/A'} - {data.owner?.pincode || 'N/A'}
                  </p>
                </div>
                {data.owner?.emergencyContactName && (
                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <span className="text-sm font-medium text-gray-600">Emergency Contact</span>
                    <p className="text-gray-900 font-semibold">
                      {data.owner.emergencyContactName} - {data.owner?.emergencyContactPhone || 'N/A'}
                    </p>
                  </div>
                )}
                {data.owner?.photo && (
                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <span className="text-sm font-medium text-gray-600 flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      Profile Photo
                    </span>
                    <p className="text-green-600 font-semibold">✓ Uploaded ({data.owner?.photoFileName || 'profile-photo.jpg'})</p>
                  </div>
                )}
              </div>
            </div>

            {/* Branches */}
            {data.branches && data.branches.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h5 className="text-xl font-bold text-green-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3" />
                  Branches ({data.branches.length})
                </h5>
                <div className="space-y-6">
                  {data.branches.map((branch, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-green-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Branch Name</span>
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-900 font-semibold">{branch.name}</p>
                            {branch.is_head_office && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Head Office</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Branch Code</span>
                          <p className="text-gray-900 font-semibold">{branch.code}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Phone</span>
                          <p className="text-gray-900 font-semibold">{branch.phone || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Email</span>
                          <p className="text-gray-900 font-semibold">{branch.email || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 space-y-1">
                          <span className="text-sm font-medium text-gray-600">Address</span>
                          <p className="text-gray-900 font-semibold">
                            {branch.address}, {branch.city}, {branch.state} - {branch.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff */}
            {data.staff && data.staff.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <h5 className="text-xl font-bold text-orange-900 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  Staff Members ({data.staff.length})
                </h5>
                <div className="space-y-6">
                  {data.staff.map((member, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Name</span>
                          <p className="text-gray-900 font-semibold">{member.first_name} {member.last_name}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Role</span>
                          <p className="text-gray-900 font-semibold">{member.role}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Email</span>
                          <p className="text-gray-900 font-semibold">{member.email}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Phone</span>
                          <p className="text-gray-900 font-semibold">{member.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Department</span>
                          <p className="text-gray-900 font-semibold">{member.department}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Designation</span>
                          <p className="text-gray-900 font-semibold">{member.designation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <h5 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                Preferences
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Language</span>
                  <p className="text-gray-900 font-semibold">{data.language === 'en' ? 'English' : data.language}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">Theme</span>
                  <p className="text-gray-900 font-semibold capitalize">{data.theme}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}