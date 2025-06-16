

import React, { useState, useEffect } from 'react';
import Calendar from '../../../Components/Calendar.jsx';
import { useAppointments } from '../../../hooks/useAppointments';
import { useContract } from '../../../hooks/useContract';

const Dashboard = () => {
  const { isConnected } = useContract();
  const { 
    blockchainAppointments, 
    fetchBlockchainAppointments, 
    loading, 
    error 
  } = useAppointments();
  
  const [appointments, setAppointments] = useState([]);

  // Fetch blockchain appointments when connected
  useEffect(() => {
    if (isConnected) {
      fetchBlockchainAppointments();
    }
  }, [isConnected, fetchBlockchainAppointments]);
  // Transform blockchain appointments to calendar format
  useEffect(() => {
    if (blockchainAppointments && blockchainAppointments.length > 0) {
      const transformedAppointments = blockchainAppointments.map(appointment => {
        // Convert appointmentTimestamp to date and time
        const appointmentDate = appointment.appointmentTimestamp || appointment.timestamp;
        const date = new Date(appointmentDate);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const timeString = date.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        return {
          id: appointment.id,
          name: `Patient ${appointment.patientID}`, // Since we don't have patient names in blockchain
          email: `patient${appointment.patientID}@healthcare.com`, // Generated email
          date: dateString,
          time: timeString,
          reason: appointment.reason || 'Healthcare Consultation',
          status: appointment.status,
          doctor: appointment.doctorName,
          blockchainId: appointment.id,
          patientID: appointment.patientID,
          appointmentTimestamp: appointment.appointmentTimestamp,
          bookingTimestamp: appointment.bookingTimestamp
        };
      });
      
      setAppointments(transformedAppointments);
    }
  }, [blockchainAppointments]);
  const handleDateClick = (dateString) => {
    const dateAppointments = appointments.filter(apt => apt.date === dateString);
    if (dateAppointments.length > 0) {
      // You can add navigation to a detailed view or open a modal here
    }
  };return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">

      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <p className="text-center text-yellow-800">
            Please connect your wallet to view blockchain appointments
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <p className="text-center text-blue-800">Loading appointments from blockchain...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-center text-red-800">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 flex gap-8">
        {/* Left: Calendar */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📅 Appointment Calendar
            </h1>
            <p className="text-gray-600 mt-2">Manage and view all your healthcare appointments</p>
          </div>
          <Calendar 
            appointments={appointments}
            onDateClick={handleDateClick}
          />
        </div>

        {/* Right: Notification Bar */}
        <div className="w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">🔔 Recent Notifications</h2>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                {appointments.filter(apt => apt.status === 'Pending').length} pending
              </span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* Dynamic Notifications based on blockchain appointments */}
              {isConnected && appointments.length > 0 ? (
                appointments
                  .filter(apt => apt.status === 'Pending')
                  .slice(0, 3)
                  .map((appointment) => (
                    <div key={appointment.id} className="group">
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">
                              ✨ New appointment request
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              from <span className="font-medium">{appointment.name}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Doctor: <span className="font-medium">{appointment.doctor}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span>{appointment.date} at {appointment.time}</span>
                            </p>
                          </div>
                          <div className="ml-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : !isConnected ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Connect wallet to view notifications
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    No pending appointments
                  </p>
                </div>
              )}              
              {/* Static notifications with enhanced styling */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-sm font-medium text-gray-800">🔐 Blockchain connection active</p>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-4">
                  {isConnected ? 'Connected to blockchain' : 'Wallet not connected'}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm font-medium text-gray-800">✅ Appointment data synchronized</p>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-4">
                  {blockchainAppointments.length} appointments loaded from blockchain
                </p>
              </div>
              
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-800">🚨 Blockchain connection issue</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-4">Check wallet connection</p>
                </div>
              )}
            </div>
            
            {/* Enhanced Quick Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                📊 Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200 hover:shadow-md transition-all duration-200">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">
                      {appointments.filter(apt => apt.status === 'Pending').length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                    <div className="w-full bg-amber-200 rounded-full h-1 mt-2">
                      <div 
                        className="bg-amber-500 h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${(appointments.filter(apt => apt.status === 'Pending').length / appointments.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {appointments.filter(apt => apt.status === 'Approved').length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Approved</p>
                    <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${(appointments.filter(apt => apt.status === 'Approved').length / appointments.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional stats */}
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{appointments.length}</p>
                  <p className="text-sm text-gray-600 font-medium">Total Appointments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
