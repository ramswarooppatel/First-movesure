"use client";
import { useState } from 'react';

export default function IndustryCategory({ data, updateData }) {
  const [selectedIndustry, setSelectedIndustry] = useState(data.industry || '');

  const industries = [
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', desc: 'Production and assembly operations' },
    { id: 'retail', name: 'Retail & FMCG', icon: '🛒', desc: 'Fast-moving consumer goods and retail' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', desc: 'Medical and healthcare services' },
    { id: 'education', name: 'Education', icon: '🎓', desc: 'Educational institutions and training' },
    { id: 'technology', name: 'Technology', icon: '💻', desc: 'IT services and software development' },
    { id: 'finance', name: 'Finance & Banking', icon: '🏦', desc: 'Financial services and banking' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏢', desc: 'Property development and management' },
    { id: 'hospitality', name: 'Hospitality', icon: '🏨', desc: 'Hotels, restaurants, and tourism' },
    { id: 'logistics', name: 'Logistics & Transport', icon: '🚚', desc: 'Transportation and supply chain' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾', desc: 'Farming and agricultural products' },
    { id: 'automotive', name: 'Automotive', icon: '🚗', desc: 'Vehicle manufacturing and services' },
    { id: 'other', name: 'Other', icon: '📋', desc: 'Specify your industry category' }
  ];

  const handleSelect = (industryId) => {
    setSelectedIndustry(industryId);
    updateData('industry', industryId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Industry</h3>
        <p className="text-gray-600 mb-6">Choose the category that best describes your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((industry) => (
          <div
            key={industry.id}
            onClick={() => handleSelect(industry.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg group ${
              selectedIndustry === industry.id
                ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
            }`}
          >
            <div className="text-center">
              <div className={`text-4xl mb-3 transition-transform duration-300 ${
                selectedIndustry === industry.id ? 'transform scale-110' : 'group-hover:scale-110'
              }`}>
                {industry.icon}
              </div>
              <div className="font-semibold text-gray-900 mb-2">{industry.name}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{industry.desc}</div>
            </div>
            
            {selectedIndustry === industry.id && (
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIndustry && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 animate-fade-in-up">
          <div className="flex items-center">
            <div className="text-3xl mr-4">
              {industries.find(i => i.id === selectedIndustry)?.icon}
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">
                {industries.find(i => i.id === selectedIndustry)?.name} Selected
              </h4>
              <p className="text-blue-700 text-sm">
                We'll customize your dashboard for {industries.find(i => i.id === selectedIndustry)?.name.toLowerCase()} businesses
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}