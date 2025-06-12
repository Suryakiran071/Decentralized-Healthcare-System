// src/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo_nobg.png';  // Import your logo image here

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // Get the current user when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  // Display the first letter of the user's email
  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  return (
    <nav className="bg-white p-5 flex justify-between items-center text-black">
      {/* Left Side: Logo */}
      <div className="flex items-center ml-8">
        <img src={logo} alt="Logo" className="h-10 w-auto" />  {/* Render the logo */}
      </div>

      {/* Right Side: Links and Profile */}
      <div className="flex items-center space-x-6">
        {/* Login Link */}
        {!user && (
          <Link to="/login" className="text-black hover:text-gray-700">
            Login
          </Link>
        )}

        {/* Appointments Link */}
        {user && (
          <Link to="/appointments" className="text-black hover:text-gray-700">
            Appointments
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
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-48">
                {/* Profile Dropdown Links */}
                <Link
                  to="/profile"
                  className="block text-sm text-gray-700 mb-2 hover:bg-gray-200 p-2 rounded-md"
                >
                  Profile
                </Link>
                <Link
                  to="/records"
                  className="block text-sm text-gray-700 mb-2 hover:bg-gray-200 p-2 rounded-md"
                >
                  View Records
                </Link>
                <Link
                  to="/support"
                  className="block text-sm text-gray-700 mb-2 hover:bg-gray-200 p-2 rounded-md"
                >
                  Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-gray-200 p-2 rounded-md w-full text-left"
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
