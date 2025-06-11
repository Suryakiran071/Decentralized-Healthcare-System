import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar - Fixed */}
      <div className="w-64 bg-white p-6 shadow-lg sticky top-0">
        <h1 className="text-2xl font-semibold text-indigo-600 mb-6">Patient Dashboard</h1>
        <ul>
          <li className="mb-4 group">
            <Link
              to="/dashboard"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-4 group">
            <Link
              to="/appointments"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Appointments
            </Link>
          </li>
          <li className="mb-4 group">
            <Link
              to="/healthcare"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Healthcare
            </Link>
          </li>
          <li className="mb-4 group">
            <Link
              to="/support"
              className="block p-2 rounded-md transition-all group-hover:bg-gray-200 group-hover:text-black"
            >
              Support
            </Link>
          </li>
          {/* Add more sidebar links here */}
        </ul>
      </div>

      {/* Right Side: Main Content */}
      <div className="flex-1 p-6">
        {children} {/* Dynamic content goes here */}
      </div>
    </div>
  );
};

export default Layout;