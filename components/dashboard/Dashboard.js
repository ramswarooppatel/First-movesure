"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  Users, 
  Building2, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Bell,
  Search,
  Plus,
  Download,
  RefreshCw,
  User,
  Home,
  Truck,
  Package,
  DollarSign,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function Dashboard() {
  const { user, userName, userRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalMoves: 156,
      activeMoves: 23,
      completedMoves: 133,
      revenue: 245000,
      customers: 89,
      staff: 12
    },
    recentMoves: [
      { id: '001', customer: 'John Smith', from: 'New York', to: 'Boston', status: 'in_progress', date: '2025-06-12' },
      { id: '002', customer: 'Sarah Johnson', from: 'LA', to: 'SF', status: 'completed', date: '2025-06-11' },
      { id: '003', customer: 'Mike Wilson', from: 'Chicago', to: 'Miami', status: 'scheduled', date: '2025-06-15' }
    ],
    notifications: [
      { id: 1, type: 'info', title: 'New booking received', time: '5 min ago' },
      { id: 2, type: 'warning', title: 'Staff member requested time off', time: '1 hour ago' },
      { id: 3, type: 'success', title: 'Move completed successfully', time: '2 hours ago' }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName || 'User'}! 👋
            </h1>
            <p className="text-gray-600">Here&apos;s what&apos;s happening with your moves today.</p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
              New Move
            </Button>
            
            <div className="relative">
              <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search moves, customers, staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Moves"
          value={dashboardData.stats.totalMoves}
          change={12}
          icon={Truck}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Moves"
          value={dashboardData.stats.activeMoves}
          change={8}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Revenue"
          value={`$${dashboardData.stats.revenue.toLocaleString()}`}
          change={15}
          icon={DollarSign}
          color="bg-purple-500"
        />
        <StatCard
          title="Customers"
          value={dashboardData.stats.customers}
          change={5}
          icon={Users}
          color="bg-orange-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Moves */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Moves</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentMoves.map((move) => (
              <div key={move.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{move.customer}</p>
                    <p className="text-sm text-gray-600">{move.from} → {move.to}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(move.status)}`}>
                    {move.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{move.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {dashboardData.notifications.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {dashboardData.notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-4">
            View All Notifications
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Schedule Move', icon: Calendar, color: 'bg-blue-500' },
            { label: 'Add Customer', icon: Users, color: 'bg-green-500' },
            { label: 'Manage Staff', icon: User, color: 'bg-purple-500' },
            { label: 'View Reports', icon: BarChart3, color: 'bg-orange-500' }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}