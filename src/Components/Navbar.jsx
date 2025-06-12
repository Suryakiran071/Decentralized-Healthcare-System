// src/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAdmin, isUser } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  // Display the first letter of the user's email
  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  return (
    <nav className="bg-white p-4 flex justify-between items-center text-black border-b border-gray-200">
      {/* Left Side: MedEase Logo */}
      <div className="text-2xl font-semibold">
        <Link to={user ? (isAdmin ? '/dashboard' : '/user') : '/login'}>
          MedEase
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center space-x-6">
        {user && isAdmin && (
          <>
            <Link to="/dashboard" className="text-black hover:text-gray-700">
              Dashboard
            </Link>
            <Link to="/appointments" className="text-black hover:text-gray-700">
              Appointments
            </Link>
            <Link to="/healthcare" className="text-black hover:text-gray-700">
              Healthcare
            </Link>
            <Link to="/support" className="text-black hover:text-gray-700">
              Support
            </Link>
          </>
        )}

        {user && isUser && (
          <>
            <Link to="/user" className="text-black hover:text-gray-700">
              Dashboard
            </Link>
            <Link to="/user/appointments" className="text-black hover:text-gray-700">
              Book Appointment
            </Link>
            <Link to="/user/records" className="text-black hover:text-gray-700">
              My Records
            </Link>
            <Link to="/user/support" className="text-black hover:text-gray-700">
              Support
            </Link>
          </>
        )}
      </div>

      {/* Right Side: Login/Profile */}
      <div className="flex items-center space-x-6">
        {/* Login Link */}
        {!user && (
          <Link to="/login" className="text-black hover:text-gray-700">
            Login
          </Link>
        )}

        {/* Profile Circle */}
        {user && (
          <div className="relative">
            {/* Profile Circle with gray background and black border */}
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="w-8 h-8 bg-gray-500 border-2 border-black rounded-full flex items-center justify-center text-white"
            >
              {getInitials(user.email)}
            </button>

            {/* Dropdown Menu */}
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-48 border border-gray-200">
                <p className="text-sm mb-2 font-medium">{user.email}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Role: {isAdmin ? 'Admin' : 'Patient'}
                </p>
                <hr className="mb-3" />
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
