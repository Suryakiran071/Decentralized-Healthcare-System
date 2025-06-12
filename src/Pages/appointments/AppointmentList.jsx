import React, { useState, useEffect } from 'react';
import { useContract } from '../../hooks/useContract';
import { useAppointments } from '../../hooks/useAppointments';

const AppointmentList = () => {
  const { isConnected, connectWallet, account } = useContract();
  const { approveAppointment, declineAppointment, loading } = useAppointments();
  
  const [appointments, setAppointments] = useState([
    // Placeholder data for demonstration - in a real app, this would come from your backend
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      date: '2023-09-20',
      time: '14:00',
      reason: 'Checkup',
      doctor: 'Dr. Smith',
      status: 'Pending',
      blockchainId: 1
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      date: '2023-09-21',
      time: '10:00',
      reason: 'Dental Cleaning',
      doctor: 'Dr. Johnson',
      status: 'Pending',
      blockchainId: 2
    },
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setError('');
    } catch (error) {
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
    }
  };

  const handleApprove = async (id, blockchainId) => {
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      // Update blockchain
      await approveAppointment(blockchainId);
      
      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: 'Approved' }
            : appointment
        )
      );
      
      setSuccess(`Appointment ${id} approved successfully on blockchain!`);
    } catch (error) {
      console.error('Error approving appointment:', error);
      setError('Failed to approve appointment. You may not be authorized.');
    }
  };

  const handleDecline = async (id, blockchainId) => {
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      // Update blockchain
      await declineAppointment(blockchainId);
      
      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: 'Declined' }
            : appointment
        )
      );
      
      setSuccess(`Appointment ${id} declined successfully on blockchain!`);
    } catch (error) {
      console.error('Error declining appointment:', error);
      setError('Failed to decline appointment. You may not be authorized.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Appointment Requests</h2>

      {/* Wallet Connection Status */}
      {!isConnected ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Connect Your Wallet</h3>
          <p className="text-yellow-700 text-sm mb-3">
            To manage appointments on the blockchain, you need to connect your crypto wallet.
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <span className="font-semibold">Wallet Connected:</span> {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
          <p className="text-green-600 text-xs mt-1">
            You can now approve or decline appointments on the blockchain.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="mb-4 p-4 border rounded-md border-gray-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Name:</strong> {appointment.name}</p>
              <p><strong>Email:</strong> {appointment.email}</p>
              <p><strong>Doctor:</strong> {appointment.doctor}</p>
            </div>
            <div>
              <p><strong>Date & Time:</strong> {appointment.date} at {appointment.time}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Blockchain ID:</strong> {appointment.blockchainId}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={
                  appointment.status === 'Pending'
                    ? 'text-yellow-500'
                    : appointment.status === 'Approved'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {appointment.status}
              </span>
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => handleApprove(appointment.id, appointment.blockchainId)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={appointment.status !== 'Pending' || loading || !isConnected}
              >
                {loading ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleDecline(appointment.id, appointment.blockchainId)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={appointment.status !== 'Pending' || loading || !isConnected}
              >
                {loading ? 'Processing...' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {appointments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No appointment requests found.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
