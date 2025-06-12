// src/Components/UserLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar - Fixed */}
      <div className="w-64 bg-white p-6 shadow-lg sticky top-0">
        <h1 className="text-2xl font-semibold text-indigo-600 mb-6">User Dashboard</h1>
        <ul>
          <li className="mb-4 group">
            <Link
              to="/user"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-4 group">
            <Link
              to="/user/appointments"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Book Appointment
            </Link>
          </li>
          <li className="mb-4 group">
            <Link
              to="/user/records"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              My Records
            </Link>
          </li>
          <li className="mb-4 group">
            <Link
              to="/user/support"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Support
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Side: Main Content */}
      <div className="flex-1 p-6">
        {children} {/* Dynamic content goes here */}
      </div>
    </div>
  );
};

export default UserLayout;
