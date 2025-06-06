'use client';
import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function ClockComponent({
  label,
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formatDisplayTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hourNum = parseInt(hours);
    const hour12 = hourNum % 12 || 12;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clockHours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleHourClick = (hour) => {
    const current = value ? value.split(':') : ['00', '00'];
    const currentHour = parseInt(current[0]);
    const minutes = current[1] || '00';
    const isPM = currentHour >= 12;
    const newHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    onChange(`${String(newHour).padStart(2, '0')}:${minutes}`);
  };

  const handleMinuteClick = (minute) => {
    const hours = value ? value.split(':')[0] : '00';
    onChange(`${hours}:${String(minute).padStart(2, '0')}`);
  };

  const toggleAmPm = () => {
    if (!value) return;
    const [hour, minute] = value.split(':');
    const h = parseInt(hour);
    const isPM = h >= 12;
    const newHour = isPM ? h - 12 : h + 12;
    onChange(`${String(newHour).padStart(2, '0')}:${minute}`);
  };

  const selectedHour = value ? parseInt(value.split(':')[0]) : null;
  const selectedMinute = value ? parseInt(value.split(':')[1]) : null;
  const isPM = selectedHour !== null ? selectedHour >= 12 : false;
  const displayHour = selectedHour !== null ? (selectedHour % 12 || 12) : null;

  return (
    <div className="relative z-[999]" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={value ? formatDisplayTime(value) : ''}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          disabled={disabled}
          required={required}
          className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white cursor-pointer'
          }`}
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-[999] animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={toggleAmPm}
              className={`px-3 py-1 rounded-md ${!isPM ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              AM
            </button>
            <div className="text-lg font-semibold">
              {value ? formatDisplayTime(value) : '--:--'}
            </div>
            <button
              type="button"
              onClick={toggleAmPm}
              className={`px-3 py-1 rounded-md ${isPM ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              PM
            </button>
          </div>

          {/* Clock Face */}
          <div className="relative w-full h-48">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 flex items-center justify-center">
              <div className="absolute w-1 h-1 bg-gray-500 rounded-full"></div>
              {clockHours.map((hour) => {
                const angle = (hour * 30 - 90) * (Math.PI / 180);
                const x = 42 * Math.cos(angle) + 50;
                const y = 42 * Math.sin(angle) + 50;
                return (
                  <button
                    key={`hour-${hour}`}
                    type="button"
                    onClick={() => handleHourClick(hour)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors ${
                      displayHour === hour ? 'bg-blue-500 text-white' : 'bg-gray-50'
                    }`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>

            {/* Minutes (bottom section) */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around mt-2">
              {[0, 15, 30, 45].map((minute) => (
                <button
                  key={`minute-${minute}`}
                  type="button"
                  onClick={() => handleMinuteClick(minute)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors ${
                    selectedMinute === minute ? 'bg-blue-500 text-white' : 'bg-gray-50'
                  }`}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
