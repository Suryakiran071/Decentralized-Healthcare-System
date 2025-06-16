import React, { useState, useEffect } from 'react';

const Calendar = ({ appointments = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredAppointments, setHoveredAppointments] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (dateString) => {
    return appointments.filter(appointment => appointment.date === dateString);
  };

  const hasAppointments = (dateString) => {
    return getAppointmentsForDate(dateString).length > 0;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateHover = (dateString) => {
    setHoveredDate(dateString);
    setHoveredAppointments(getAppointmentsForDate(dateString));
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
    setHoveredAppointments([]);
  };
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="h-12 w-12 flex items-center justify-center text-sm text-gray-300 cursor-pointer rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(year, month, day);
      const hasAppts = hasAppointments(dateString);
      const appointmentCount = getAppointmentsForDate(dateString).length;
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;

      days.push(
        <div
          key={day}
          className={`
            relative h-12 w-12 flex items-center justify-center cursor-pointer rounded-xl text-sm font-semibold
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg
            ${isToday 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg ring-4 ring-indigo-200' 
              : isWeekend 
                ? 'text-gray-400 hover:bg-gray-50' 
                : 'text-gray-700 hover:bg-indigo-50'
            }
            ${hasAppts 
              ? isToday 
                ? 'ring-4 ring-yellow-300' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 hover:border-indigo-300 shadow-sm' 
              : ''
            }
            ${hoveredDate === dateString ? 'ring-2 ring-indigo-400 shadow-md' : ''}
          `}
          onClick={() => onDateClick && onDateClick(dateString)}
          onMouseEnter={() => handleDateHover(dateString)}
          onMouseLeave={handleDateLeave}
        >
          {day}
          {hasAppts && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center">
              <div className={`
                h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center
                ${isToday 
                  ? 'bg-yellow-400 text-gray-900' 
                  : 'bg-gradient-to-br from-red-500 to-pink-500 text-white'
                }
                shadow-md border-2 border-white
              `}>
                {appointmentCount}
              </div>
            </div>
          )}
          {hasAppts && !isToday && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-0.5">
                {getAppointmentsForDate(dateString).slice(0, 3).map((apt, idx) => (
                  <div
                    key={idx}
                    className={`
                      h-1 w-1 rounded-full
                      ${apt.status === 'Pending' ? 'bg-yellow-400' : 
                        apt.status === 'Approved' ? 'bg-green-400' : 'bg-red-400'}
                    `}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="h-12 w-12 flex items-center justify-center text-sm text-gray-300 cursor-pointer rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          {day}
        </div>
      );
    }

    return days;
  };
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateMonth(-1)}
            className="group p-3 hover:bg-indigo-50 rounded-xl transition-all duration-300 hover:shadow-md"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {appointments.length} total appointments
            </p>
          </div>
          
          <button
            onClick={() => navigateMonth(1)}
            className="group p-3 hover:bg-indigo-50 rounded-xl transition-all duration-300 hover:shadow-md"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekdays.map(day => (
            <div key={day} className="h-12 flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-50 rounded-xl">
              <span className="hidden sm:block">{day}</span>
              <span className="block sm:hidden">{day.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {renderCalendarDays()}
        </div>

        {/* Enhanced Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
            <div className="h-4 w-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-sm"></div>
            <span className="font-medium text-gray-700">Today</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full">
            <div className="h-4 w-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-full"></div>
            <span className="font-medium text-gray-700">Has Appointments</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <div className="h-2 w-2 bg-red-400 rounded-full"></div>
            </div>
            <span className="font-medium text-gray-700">Status Indicators</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tooltip for Hovered Date with Appointments */}
      {hoveredDate && hoveredAppointments.length > 0 && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 mt-4 min-w-80 transform animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg">
              📅 {new Date(hoveredDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              {hoveredAppointments.length} appointment{hoveredAppointments.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {hoveredAppointments.map((appointment, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-indigo-500 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-gray-800">{appointment.name}</p>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-bold
                          ${appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                            appointment.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' : 
                            'bg-red-100 text-red-800 border border-red-200'}
                        `}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{appointment.time}</span>
                        </div>                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{appointment.reason}</span>
                        </div>
                        {appointment.doctor && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">{appointment.doctor}</span>
                          </div>
                        )}
                        {appointment.patientID && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.829 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            <span className="text-gray-500">Patient ID: {appointment.patientID}</span>
                          </div>
                        )}
                        {appointment.blockchainId && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-gray-500 text-xs">Blockchain ID: {appointment.blockchainId}</span>
                          </div>
                        )}
                        {appointment.email && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            <span className="text-gray-500">{appointment.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={() => onDateClick && onDateClick(hoveredDate)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
            >
              View All Appointments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
