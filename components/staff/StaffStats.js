"use client";
import { 
  Users, 
  UserCheck, 
  Crown, 
  Shield, 
  Building2,
  TrendingUp
} from 'lucide-react';

export default function StaffStats({ staff, loading, totalCount, aggregatedStats }) {
  // Debug logging
  console.log('StaffStats props:', { 
    staffLength: staff?.length, 
    totalCount, 
    loading,
    aggregatedStats
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Staff',
      value: aggregatedStats?.total || totalCount || staff.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Active Staff',
      value: aggregatedStats?.active || staff.filter(s => s.is_active).length,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Admins',
      value: aggregatedStats?.admins || staff.filter(s => ['super_admin', 'admin'].includes(s.role)).length,
      icon: Crown,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Managers',
      value: aggregatedStats?.managers || staff.filter(s => s.role === 'branch_manager').length,
      icon: Shield,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}