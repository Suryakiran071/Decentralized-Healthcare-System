// src/Pages/profile/Profile.js

import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase'; // Make sure you have firebase set up
import { updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';  // Add this import

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setNewName(currentUser.displayName || '');
      setNewEmail(currentUser.email);
    }
  }, []);

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName: newName });
      setUser({ ...user, displayName: newName }); // Update local state
      setError('');
    } catch (err) {
      setError('Failed to update name');
    }
  };

  const handlePasswordChange = async (e) => {
    // Implement password change functionality if needed
  };

  const handleLogout = () => {
    // Handle logout functionality
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">

      {/* Profile Box Container */}
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-cyan-600 mb-6">Profile</h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* User Details Section */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-cyan-600 mb-2">User Details</h2>
          <div className="mb-4">
            <p><strong>Name: </strong>{user ? user.displayName : 'Loading...'}</p>
            <p><strong>Email: </strong>{user ? user.email : 'Loading...'}</p>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-cyan-600 mb-2">Edit Profile</h2>
          <form onSubmit={handleNameChange}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm">Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
            >
              Update Name
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-cyan-600 mb-2">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm">New Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* View Medical Records Section */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-cyan-600 mb-2">Medical Records</h2>
          <Link
            to="/records" // Link to the user's medical records page
            className="text-cyan-600 hover:underline"
          >
            View My Records
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
