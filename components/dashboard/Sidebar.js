"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
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
  MapPin, 
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
  X
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setMobileOpen }) {
  const { user, logout, userName, userRole } = useAuth();
  const router = useRouter();
  const { navigateTo } = useNavigation();
  const pathname = usePathname();
  
  const [activeGroup, setActiveGroup] = useState('dashboard');

  // Auto-set active group based on current path
  useEffect(() => {
    const currentPath = pathname;
    if (currentPath.includes('/dashboard/moves')) setActiveGroup('moves');
    else if (currentPath.includes('/dashboard/customers')) setActiveGroup('customers');
    else if (currentPath.includes('/dashboard/staff') || currentPath.includes('/dashboard/branches') || currentPath.includes('/dashboard/inventory') || currentPath.includes('/dashboard/fleet')) setActiveGroup('operations');
    else if (currentPath.includes('/dashboard/billing') || currentPath.includes('/dashboard/payments') || currentPath.includes('/dashboard/reports')) setActiveGroup('financial');
    else if (currentPath.includes('/dashboard/calculator') || currentPath.includes('/dashboard/tracking') || currentPath.includes('/dashboard/documents') || currentPath.includes('/dashboard/photos')) setActiveGroup('tools');
    else if (currentPath.includes('/dashboard/profile') || currentPath.includes('/dashboard/settings') || currentPath.includes('/dashboard/security') || currentPath.includes('/dashboard/help') || currentPath.includes('/dashboard/contact')) setActiveGroup('settings');
    else setActiveGroup('dashboard');
  }, [pathname]);

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
          icon: FileText, 
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
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const toggleGroup = (groupName) => {
    setActiveGroup(activeGroup === groupName ? '' : groupName);
  };

  const handleNavigation = (path) => {
    // Use the navigation hook for smooth transitions
    navigateTo(path);
    
    // Close mobile menu after navigation
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const NavigationItem = ({ item, isNested = false }) => {
    const IconComponent = item.icon;
    const isActive = isItemActive(item.path);
    
    return (
      <li>
        <button
          onClick={() => handleNavigation(item.path)}
          className={`w-full flex items-center px-3 py-3 text-sm rounded-xl transition-all duration-300 group relative ${
            isActive
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 transform scale-105 border border-blue-400/30'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-blue-50 hover:text-blue-700 hover:shadow-md hover:scale-102'
          } ${isNested ? 'ml-4' : ''}`}
          title={isCollapsed ? item.label : ''}
        >
          {/* Active indicator with glow effect */}
          {isActive && (
            <>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-sm"></div>
            </>
          )}
          
          <IconComponent className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0 transition-all duration-300 relative z-10 ${
            isActive ? 'text-white drop-shadow-sm' : 'text-gray-500 group-hover:text-blue-600'
          }`} />
          
          {!isCollapsed && (
            <>
              <span className={`ml-3 font-medium transition-all duration-300 relative z-10 ${
                isActive ? 'text-white drop-shadow-sm' : ''
              }`}>{item.label}</span>
              {item.badge && (
                <span className={`ml-auto px-2 py-1 text-xs font-bold rounded-full transition-all duration-300 relative z-10 ${
                  isActive 
                    ? 'bg-white/20 text-white backdrop-blur-sm shadow-inner' 
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 group-hover:from-blue-200 group-hover:to-purple-200 shadow-sm'
                }`}>
                  {item.badge}
                </span>
              )}
            </>
          )}
          
          {/* Hover shine effect */}
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          )}
        </button>
      </li>
    );
  };

  const NavigationGroup = ({ group }) => {
    const isExpanded = activeGroup === group.group || isCollapsed;
    const hasActiveItem = group.items.some(item => isItemActive(item.path));
    
    return (
      <div className="mb-3">
        {!isCollapsed && (
          <button
            onClick={() => toggleGroup(group.group)}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              hasActiveItem 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{group.title}</span>
            <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
        
        {(isExpanded || isCollapsed) && (
          <ul className="space-y-1 mt-2">
            {group.items.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl transition-all duration-300 z-40 hidden lg:block ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header with enhanced gradient */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-blue-50/80 backdrop-blur-sm">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg drop-shadow-sm">M</span>
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">MOVESURE</h2>
                <p className="text-xs text-gray-500 font-medium">Dashboard</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/70 transition-all duration-200 hover:shadow-md backdrop-blur-sm"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Profile Section with enhanced styling */}
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <User className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{userName || 'User'}</p>
                <p className="text-xs text-gray-600 capitalize truncate font-medium">{userRole || 'Role'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation with enhanced scrollbar */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-6">
            {navigationItems.map((group) => (
              <NavigationGroup key={group.group} group={group} />
            ))}
          </div>
        </nav>

        {/* Quick Actions with enhanced styling */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50 bg-gray-50/80 backdrop-blur-sm">
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                <PlusCircle className="w-4 h-4 mr-3 text-gray-500" />
                <span>New Move</span>
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                <Search className="w-4 h-4 mr-3 text-gray-500" />
                <span>Quick Search</span>
              </button>
            </div>
          </div>
        )}

        {/* Logout Button with enhanced styling */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 hover:shadow-md transition-all duration-200 font-medium ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar with enhanced backdrop */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileOpen ? 'block' : 'hidden'}`}>
        {/* Enhanced Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        ></div>
        
        {/* Mobile Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-blue-50/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg drop-shadow-sm">M</span>
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">MOVESURE</h2>
                <p className="text-xs text-gray-500 font-medium">Dashboard</p>
              </div>
            </div>
            
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-white/70 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile User Profile */}
          <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-gray-50/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{userName || 'User'}</p>
                <p className="text-xs text-gray-600 capitalize font-medium">{userRole || 'Role'}</p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-6">
              {navigationItems.map((group) => (
                <NavigationGroup key={group.group} group={group} />
              ))}
            </div>
          </nav>

          {/* Mobile Logout */}
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}