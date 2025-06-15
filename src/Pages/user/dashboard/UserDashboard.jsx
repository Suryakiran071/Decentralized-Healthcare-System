import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useContract } from '../../../hooks/useContract';
import UserAppointmentDashboard from '../../../Components/UserAppointmentDashboard';

export default function User() {
  const { user } = useAuth();
  const { isConnected, account } = useContract();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to MedEase</h1>
        <p className="text-gray-600">Manage your healthcare appointments and records securely.</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Type</p>
            <p className="font-medium text-blue-600">Patient</p>
          </div>
          {isConnected && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-medium text-green-600">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/user/appointments" 
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-6 transition-colors"
        >
          <div className="text-blue-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Book Appointment</h3>
          <p className="text-sm text-gray-600">Schedule a new appointment with your healthcare provider</p>
        </Link>

        <Link 
          to="/user/records" 
          className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-6 transition-colors"
        >
          <div className="text-green-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">View Records</h3>
          <p className="text-sm text-gray-600">Access your medical records securely on the blockchain</p>
        </Link>

        <Link 
          to="/user/support" 
          className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-6 transition-colors"
        >
          <div className="text-purple-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Get Support</h3>
          <p className="text-sm text-gray-600">Submit support tickets for any issues or questions</p>
        </Link>      </div>

      {/* Appointment Status Dashboard */}
      <div className="mb-8">
        <UserAppointmentDashboard />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div>
              <p className="text-sm text-gray-800">Account created successfully</p>
              <p className="text-xs text-gray-500">Welcome to MedEase!</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div>
              <p className="text-sm text-gray-800">Security: Two-factor authentication recommended</p>
              <p className="text-xs text-gray-500">Enhance your account security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
