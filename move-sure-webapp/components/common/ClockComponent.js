"use client";
import { useState } from 'react';
import { Clock } from 'lucide-react';

export default function ClockComponent({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select time",
  disabled = false,
  required = false 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options (every 30 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatDisplayTime(timeStr);
        times.push({ value: timeStr, display: displayTime });
      }
    }
    return times;
  };

  const formatDisplayTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
        >
          <option value="">{placeholder}</option>
          {timeOptions.map(({ value: timeValue, display }) => (
            <option key={timeValue} value={timeValue}>
              {display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}