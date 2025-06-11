// src/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

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
    <nav className="bg-indigo-600 p-4 flex justify-between items-center text-white">
      {/* Left Side: MedEase Logo */}
      <div className="text-2xl font-semibold">
        MedEase
      </div>

      {/* Right Side: Links and Profile */}
      <div className="flex items-center space-x-6">
        {/* Login Link */}
        {!user && (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}

        {/* Appointments Link */}
        {user && (
          <Link to="/appointments" className="hover:underline">
            Appointments
          </Link>
        )}

        {/* Profile Circle */}
        {user && (
          <div className="relative">
            {/* Profile Circle */}
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white"
            >
              {getInitials(user.email)}
            </button>

            {/* Dropdown Menu */}
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-48">
                <p className="text-sm mb-2">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline"
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
