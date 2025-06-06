"use client";
import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, CalendarDays, Edit3 } from 'lucide-react';

export default function CalendarComponent({
  label,
  value, // Expected format: YYYY-MM-DD
  onChange,
  placeholder = "Select date",
  disabled = false,
  required = false,
  minDate = null, // Format: YYYY-MM-DD
  maxDate = null, // Format: YYYY-MM-DD
  showTime = false, // Enable time selection
  timeFormat = "24", // "12" or "24"
  backgroundColor = "bg-white",
  borderColor = "border-gray-300",
  disablePastDates = false,
  disableFutureDates = false,
  highlightToday = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [yearInput, setYearInput] = useState('');
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  
  const dropdownRef = useRef(null);
  const yearInputRef = useRef(null);

  // Parse the input value
  const selectedDate = value ? new Date(value) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditingYear(false);
        setIsEditingMonth(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus year input when editing starts
  useEffect(() => {
    if (isEditingYear && yearInputRef.current) {
      yearInputRef.current.focus();
      yearInputRef.current.select();
    }
  }, [isEditingYear]);

  // Format display date
  const formatDisplayDate = (date, includeTime = false) => {
    if (!date) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    };
    
    let formatted = date.toLocaleDateString('en-US', options);
    
    if (includeTime && showTime) {
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12'
      };
      formatted += ` at ${date.toLocaleTimeString('en-US', timeOptions)}`;
    }
    
    return formatted;
  };

  // Get calendar days for the current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // First day of the week for the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate all days to display (6 weeks = 42 days)
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Check if a date is disabled
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Check past dates
    if (disablePastDates && checkDate < today) return true;
    
    // Check future dates
    if (disableFutureDates && checkDate > today) return true;
    
    // Check min date
    if (minDate && checkDate < new Date(minDate)) return true;
    
    // Check max date
    if (maxDate && checkDate > new Date(maxDate)) return true;
    
    return false;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    
    let newDate = new Date(date);
    
    if (showTime && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    // Format as YYYY-MM-DD or YYYY-MM-DD HH:MM
    const formattedDate = showTime 
      ? newDate.toISOString().slice(0, 16).replace('T', ' ')
      : newDate.toISOString().slice(0, 10);
    
    onChange(formattedDate);
    
    if (!showTime) {
      setIsOpen(false);
    }
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Navigate years
  const navigateYear = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setFullYear(newMonth.getFullYear() + direction);
    setCurrentMonth(newMonth);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Handle year editing
  const startYearEdit = () => {
    setYearInput(currentMonth.getFullYear().toString());
    setIsEditingYear(true);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setYearInput(value);
    }
  };

  const finishYearEdit = () => {
    const year = parseInt(yearInput);
    if (year && year >= 1900 && year <= 2100) {
      const newMonth = new Date(currentMonth);
      newMonth.setFullYear(year);
      setCurrentMonth(newMonth);
    }
    setIsEditingYear(false);
  };

  const handleYearKeyPress = (e) => {
    if (e.key === 'Enter') {
      finishYearEdit();
    } else if (e.key === 'Escape') {
      setIsEditingYear(false);
    }
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(monthIndex);
    setCurrentMonth(newMonth);
    setIsEditingMonth(false);
  };

  // Quick date selection
  const quickDateSelect = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    handleDateSelect(date);
  };

  // Quick year navigation
  const quickYearJump = (years) => {
    const newMonth = new Date(currentMonth);
    newMonth.setFullYear(newMonth.getFullYear() + years);
    setCurrentMonth(newMonth);
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Short month names for dropdown
  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = getCalendarDays();

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={selectedDate ? formatDisplayDate(selectedDate, showTime) : ''}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          disabled={disabled}
          required={required}
          className={`block w-full pl-10 pr-3 py-2 border ${borderColor} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${backgroundColor} ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'cursor-pointer'
          }`}
        />
        
        {/* Clear button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px] animate-in fade-in duration-200">
          {/* Enhanced Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            {/* Previous Month/Year */}
            <div className="flex items-center space-x-1">
                <button
                    type="button"
                    onClick={() => navigateYear(-1)}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    title="Previous Year"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-700 font-bold" />
                    <ChevronLeft className="w-4 h-4 -ml-2 text-gray-700 font-bold" />
                </button>
                <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    title="Previous Month"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700 font-bold" />
                </button>
            </div>

            {/* Month and Year Display */}
            <div className="flex items-center space-x-2">
              {/* Month Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsEditingMonth(!isEditingMonth)}
                  className="text-lg font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                  title="Click to select month"
                >
                  {monthNames[currentMonth.getMonth()]}
                </button>
                
                {isEditingMonth && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-60 grid grid-cols-3 gap-1 p-2 min-w-[200px]">
                    {shortMonthNames.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          currentMonth.getMonth() === index
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Year Selector */}
              <div className="relative">
                {isEditingYear ? (
                  <input
                    ref={yearInputRef}
                    type="text"
                    value={yearInput}
                    onChange={handleYearChange}
                    onBlur={finishYearEdit}
                    onKeyDown={handleYearKeyPress}
                    className="w-16 text-lg font-semibold text-gray-900 text-center border border-blue-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Year"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={startYearEdit}
                    className="text-lg font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors flex items-center space-x-1"
                    title="Click to edit year"
                  >
                    <span>{currentMonth.getFullYear()}</span>
                    <Edit3 className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
              
              <button
                type="button"
                onClick={goToToday}
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Today
              </button>
            </div>
            
            {/* Next Month/Year */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => navigateMonth(1)}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            title="Next Month"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-700 font-bold" />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigateYear(1)}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            title="Next Year"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-700 font-bold" />
                            <ChevronRight className="w-4 h-4 -ml-2 text-gray-700 font-bold" />
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Quick Navigation */}
          <div className="flex flex-wrap gap-1 mb-4 text-xs">
            {/* Date shortcuts */}
            {/* <button
              type="button"
              onClick={() => quickDateSelect(0)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => quickDateSelect(1)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => quickDateSelect(7)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              +1 Week
            </button> */}
            
            {/* Year shortcuts */}
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => quickYearJump(-1)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              -1 Year
            </button>
             <button
              type="button"
              onClick={() => quickYearJump(-5)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              -5 Year
            </button>
            <button
              type="button"
              onClick={() => quickYearJump(1)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              +1 Year
            </button>
            <button
              type="button"
              onClick={() => quickYearJump(5)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              +5 Years
            </button>
          </div>

          {/* Year Range Helper */}
          <div className="text-center mb-3 text-xs text-gray-500">
            <span>Range: 1900 - 2100 | Current: {currentMonth.getFullYear()}</span>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calendarDays.map((date, index) => {
              const disabled = isDateDisabled(date);
              const today = isToday(date);
              const selected = isSelected(date);
              const currentMonthDay = isCurrentMonth(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  disabled={disabled}
                  className={`
                    relative w-8 h-8 text-sm rounded-lg transition-all duration-200 font-medium
                    ${selected 
                      ? 'bg-blue-500 text-white ring-2 ring-blue-200' 
                      : today && highlightToday
                        ? 'bg-blue-100 text-blue-900 ring-1 ring-blue-300'
                        : currentMonthDay
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-gray-400'
                    }
                    ${disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 cursor-pointer'
                    }
                  `}
                >
                  {date.getDate()}
                  {today && highlightToday && !selected && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Selection */}
          {showTime && (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Select Time</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={selectedTime.split(':')[0]}
                  onChange={(e) => {
                    const hour = e.target.value;
                    const minute = selectedTime.split(':')[1];
                    setSelectedTime(`${hour}:${minute}`);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {Array.from({ length: timeFormat === '12' ? 12 : 24 }, (_, i) => {
                    const hour = timeFormat === '12' ? (i === 0 ? 12 : i) : i;
                    return (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {hour.toString().padStart(2, '0')}
                      </option>
                    );
                  })}
                </select>
                
                <span>:</span>
                
                <select
                  value={selectedTime.split(':')[1]}
                  onChange={(e) => {
                    const hour = selectedTime.split(':')[0];
                    const minute = e.target.value;
                    setSelectedTime(`${hour}:${minute}`);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                
                {timeFormat === '12' && (
                  <select
                    value={parseInt(selectedTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    onChange={(e) => {
                      const currentHour = parseInt(selectedTime.split(':')[0]);
                      const minute = selectedTime.split(':')[1];
                      const newHour = e.target.value === 'PM' 
                        ? (currentHour < 12 ? currentHour + 12 : currentHour)
                        : (currentHour >= 12 ? currentHour - 12 : currentHour);
                      setSelectedTime(`${newHour.toString().padStart(2, '0')}:${minute}`);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-stone-900 bg-gray-900 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex space-x-2">
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
              
              <button
                type="button"
                onClick={() => {
                  if (selectedDate) {
                    handleDateSelect(selectedDate);
                  }
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>

          {/* Selected Date Preview */}
          {selectedDate && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg text-center">
              <span className="text-sm text-blue-800 font-medium">
                Selected: {formatDisplayDate(selectedDate, showTime)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}