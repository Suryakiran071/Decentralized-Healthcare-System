// src/Dashboard.js

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Right Side: Main Content */}
      <div className="flex-1 p-6 flex">
        {/* Left: Calendar */}
        <div className="w-2/3 p-4 bg-white rounded-lg shadow-lg mr-4">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">Calendar</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <Calendar
              onChange={(date) => console.log(date)}
              value={new Date()}
            />
          </div>
        </div>

        {/* Right: Notification Bar */}
        <div className="w-1/3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">Notifications</h2>
          <div className="space-y-4">
            {/* Placeholder Notifications */}
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-700">New appointment request from John Doe</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-700">Reminder: Healthcare provider authorization pending</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-700">New support ticket opened: "Appointment issues"</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
