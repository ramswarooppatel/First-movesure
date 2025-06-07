"use client";
import { Building2, User, MapPin, Users, Factory, Globe, Shield, CheckCircle } from 'lucide-react';

export default function SummaryCards({ data, isSubmitted }) {
  const cards = [
    {
      icon: Building2,
      title: 'Company',
      value: data.company?.name || 'Company Name',
      subtitle: `${data.industry || 'Industry'} • ${data.category || 'Category'}`,
      color: 'blue',
      verified: !!data.company?.name
    },
    {
      icon: User,
      title: 'Admin Account',
      value: `${data.owner?.firstName || ''} ${data.owner?.lastName || ''}`.trim() || 'Admin User',
      subtitle: data.owner?.email || 'Email not provided',
      color: 'purple',
      verified: data.owner?.emailVerified
    },
    {
      icon: MapPin,
      title: 'Branches',
      value: data.branches?.length || 0,
      subtitle: data.branches?.length ? 'Locations configured' : 'Head office only',
      color: 'green',
      verified: true
    },
    {
      icon: Users,
      title: 'Team Members',
      value: (data.staff?.length || 0) + 1, // +1 for admin
      subtitle: data.staff?.length ? 'Staff members added' : 'Admin only',
      color: 'orange',
      verified: true
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-600',
      value: 'text-blue-900'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      title: 'text-purple-600',
      value: 'text-purple-900'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-600',
      value: 'text-green-900'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      title: 'text-orange-600',
      value: 'text-orange-900'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = colorClasses[card.color];
        
        return (
          <div 
            key={index}
            className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
            
            {/* Verification badge */}
            {card.verified && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
            
            {/* Icon */}
            <div className={`${colors.icon} mb-4 relative`}>
              <Icon className="w-10 h-10" />
              
              {/* Pulse effect for submitted state */}
              {isSubmitted && (
                <div className="absolute inset-0 bg-current opacity-25 rounded-full animate-ping"></div>
              )}
            </div>
            
            {/* Content */}
            <div className={`${colors.title} text-sm font-semibold mb-2 uppercase tracking-wide`}>
              {card.title}
            </div>
            <div className={`${colors.value} text-xl font-bold mb-1 leading-tight`}>
              {card.value}
            </div>
            <div className="text-gray-600 text-sm">
              {card.subtitle}
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>
        );
      })}
    </div>
  );
}