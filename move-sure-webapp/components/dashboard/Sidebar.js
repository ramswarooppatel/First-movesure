"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Truck, 
  Users, 
  Building2, 
  Calendar, 
  Package, 
  BarChart3, 
  Settings, 
  User, 
  Bell, 
  FileText, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  DollarSign, 
  Activity, 
  Archive, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Star,
  Target,
  Zap,
  PlusCircle,
  Search,
  Filter,
  Download,
  Upload,
  Bookmark,
  Tag,
  Globe,
  Camera
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { user, logout, userName, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeGroup, setActiveGroup] = useState('dashboard');

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    {
      group: 'dashboard',
      title: 'Dashboard',
      items: [
        { 
          id: 'overview', 
          label: 'Overview', 
          icon: Home, 
          path: '/dashboard',
          badge: null
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: BarChart3, 
          path: '/dashboard/analytics',
          badge: null
        },
        { 
          id: 'notifications', 
          label: 'Notifications', 
          icon: Bell, 
          path: '/dashboard/notifications',
          badge: '3'
        }
      ]
    },
    {
      group: 'moves',
      title: 'Move Management',
      items: [
        { 
          id: 'all-moves', 
          label: 'All Moves', 
          icon: Truck, 
          path: '/dashboard/moves',
          badge: null
        },
        { 
          id: 'scheduled', 
          label: 'Scheduled', 
          icon: Calendar, 
          path: '/dashboard/moves/scheduled',
          badge: '12'
        },
        { 
          id: 'in-progress', 
          label: 'In Progress', 
          icon: Activity, 
          path: '/dashboard/moves/active',
          badge: '5'
        },
        { 
          id: 'completed', 
          label: 'Completed', 
          icon: Archive, 
          path: '/dashboard/moves/completed',
          badge: null
        },
        { 
          id: 'quotes', 
          label: 'Quotes', 
          icon: FileText, 
          path: '/dashboard/quotes',
          badge: '8'
        }
      ]
    },
    {
      group: 'customers',
      title: 'Customer Management',
      items: [
        { 
          id: 'all-customers', 
          label: 'All Customers', 
          icon: Users, 
          path: '/dashboard/customers',
          badge: null
        },
        { 
          id: 'new-leads', 
          label: 'New Leads', 
          icon: Target, 
          path: '/dashboard/customers/leads',
          badge: '15'
        },
        { 
          id: 'feedback', 
          label: 'Reviews & Feedback', 
          icon: Star, 
          path: '/dashboard/customers/feedback',
          badge: null
        }
      ]
    },
    {
      group: 'operations',
      title: 'Operations',
      items: [
        { 
          id: 'staff', 
          label: 'Staff Management', 
          icon: User, 
          path: '/dashboard/staff',
          badge: null
        },
        { 
          id: 'branches', 
          label: 'Branch Management', 
          icon: Building2, 
          path: '/dashboard/branches',
          badge: null
        },
        { 
          id: 'inventory', 
          label: 'Inventory', 
          icon: Package, 
          path: '/dashboard/inventory',
          badge: '2'
        },
        { 
          id: 'vehicles', 
          label: 'Fleet Management', 
          icon: Truck, 
          path: '/dashboard/fleet',
          badge: null
        }
      ]
    },
    {
      group: 'financial',
      title: 'Financial',
      items: [
        { 
          id: 'billing', 
          label: 'Billing & Invoices', 
          icon: CreditCard, 
          path: '/dashboard/billing',
          badge: null
        },
        { 
          id: 'payments', 
          label: 'Payments', 
          icon: DollarSign, 
          path: '/dashboard/payments',
          badge: '4'
        },
        { 
          id: 'reports', 
          label: 'Financial Reports', 
          icon: BarChart3, 
          path: '/dashboard/reports',
          badge: null
        }
      ]
    },
    {
      group: 'tools',
      title: 'Tools & Utilities',
      items: [
        { 
          id: 'calculator', 
          label: 'Move Calculator', 
          icon: Zap, 
          path: '/dashboard/calculator',
          badge: null
        },
        { 
          id: 'map-tracking', 
          label: 'GPS Tracking', 
          icon: MapPin, 
          path: '/dashboard/tracking',
          badge: null
        },
        { 
          id: 'documents', 
          label: 'Document Center', 
          icon: FileText, 
          path: '/dashboard/documents',
          badge: null
        },
        { 
          id: 'photos', 
          label: 'Photo Gallery', 
          icon: Camera, 
          path: '/dashboard/photos',
          badge: null
        }
      ]
    },
    {
      group: 'settings',
      title: 'Settings & Support',
      items: [
        { 
          id: 'profile', 
          label: 'Profile Settings', 
          icon: User, 
          path: '/dashboard/profile',
          badge: null
        },
        { 
          id: 'company-settings', 
          label: 'Company Settings', 
          icon: Settings, 
          path: '/dashboard/settings',
          badge: null
        },
        { 
          id: 'security', 
          label: 'Security', 
          icon: Shield, 
          path: '/dashboard/security',
          badge: null
        },
        { 
          id: 'help', 
          label: 'Help & Support', 
          icon: HelpCircle, 
          path: '/dashboard/help',
          badge: null
        },
        { 
          id: 'contact', 
          label: 'Contact Support', 
          icon: Phone, 
          path: '/dashboard/contact',
          badge: null
        }
      ]
    }
  ];

  const isItemActive = (path) => {
    return pathname === path;
  };

  const getItemsByGroup = (groupName) => {
    return navigationItems.find(group => group.group === groupName)?.items || [];
  };

  const toggleGroup = (groupName) => {
    setActiveGroup(activeGroup === groupName ? '' : groupName);
  };

  const NavigationItem = ({ item, isNested = false }) => {
    const IconComponent = item.icon;
    const isActive = isItemActive(item.path);
    
    return (
      <li>
        <button
          onClick={() => router.push(item.path)}
          className={`w-full flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } ${isNested ? 'ml-4' : ''}`}
          title={isCollapsed ? item.label : ''}
        >
          <IconComponent className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0 ${
            isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
          }`} />
          
          {!isCollapsed && (
            <>
              <span className="ml-3 font-medium">{item.label}</span>
              {item.badge && (
                <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </>
          )}
        </button>
      </li>
    );
  };

  const NavigationGroup = ({ group }) => {
    const isExpanded = activeGroup === group.group || isCollapsed;
    
    return (
      <div className="mb-2">
        {!isCollapsed && (
          <button
            onClick={() => toggleGroup(group.group)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            <span>{group.title}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
        
        {(isExpanded || isCollapsed) && (
          <ul className="space-y-1">
            {group.items.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">MOVESURE</h2>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{userName || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize truncate">{userRole || 'Role'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {navigationItems.map((group) => (
            <NavigationGroup key={group.group} group={group} />
          ))}
        </div>
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <PlusCircle className="w-4 h-4 mr-3 text-gray-500" />
              <span>New Move</span>
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Search className="w-4 h-4 mr-3 text-gray-500" />
              <span>Quick Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}