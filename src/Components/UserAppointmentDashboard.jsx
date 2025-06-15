// src/components/UserAppointmentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { usePatient } from '../hooks/usePatient';
import { useContract } from '../hooks/useContract';

const UserAppointmentDashboard = () => {
  const { isConnected, account } = useContract();
  const { patientID, getPatientID } = usePatient();
  const { fetchPatientAppointments, loading } = useAppointments();
  
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  // Helper function to get doctor name from address
  const getDoctorName = (address) => {
    const doctors = {
      '0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8': 'Dr. Sarah Johnson (Cardiology)',
      '0x8ba1f109551bD432803012645Aac136c30C85a1c': 'Dr. Michael Chen (Neurology)', 
      '0xc6272e8032853d7F12d2caDcb35eD742990D6C61': 'Dr. Emily Davis (Dermatology)',
      '0x4E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F': 'Dr. James Wilson (General Medicine)'
    };
    return doctors[address] || `Doctor (${address.slice(0, 6)}...${address.slice(-4)})`;
  };

  // Fetch patient's appointments
  useEffect(() => {
    const loadAppointments = async () => {
      if (!isConnected || !account) return;

      try {
        // Get patient ID first
        const currentPatientID = await getPatientID(account);
        if (!currentPatientID) {
          setError('You need to register as a patient first.');
          return;
        }

        // Fetch appointments for this patient
        const patientAppointments = await fetchPatientAppointments(currentPatientID);
        setAppointments(patientAppointments);
        setError('');
      } catch (error) {
        console.error('Error loading appointments:', error);
        setError('Failed to load appointments. Please try again.');
      }
    };

    loadAppointments();
  }, [isConnected, account, getPatientID, fetchPatientAppointments]);

  // Get appointment status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-800 bg-green-100';
      case 'Declined': return 'text-red-800 bg-red-100';
      default: return 'text-yellow-800 bg-yellow-100';
    }
  };

  // Get appointment counts
  const getAppointmentCounts = () => {
    const counts = {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'Pending').length,
      approved: appointments.filter(apt => apt.status === 'Approved').length,
      declined: appointments.filter(apt => apt.status === 'Declined').length
    };
    return counts;
  };

  const counts = getAppointmentCounts();

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Connect Your Wallet</h3>
        <p className="text-yellow-700 text-sm">
          To view your appointments, please connect your crypto wallet first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Appointment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{counts.approved}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-red-600">{counts.declined}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Appointments</h3>
        </div>
        
        <div className="p-6">
          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">Book your first appointment to get started</p>
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getDoctorName(appointment.doctor)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {appointments.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing {Math.min(5, appointments.length)} of {appointments.length} appointments
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAppointmentDashboard;
