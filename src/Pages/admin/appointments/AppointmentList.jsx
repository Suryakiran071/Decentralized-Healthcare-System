import React, { useState, useEffect } from 'react';
import { useContract } from '../../../hooks/useContract';
import { useAppointments } from '../../../hooks/useAppointments';

const AppointmentList = () => {
  const { isConnected, connectWallet, account } = useContract();  
  const { 
    blockchainAppointments,
    approveAppointment, 
    declineAppointment, 
    loading, 
    error: appointmentsError,
    fetchBlockchainAppointments
  } = useAppointments();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch blockchain appointments on component mount
  useEffect(() => {
    if (isConnected) {
      fetchBlockchainAppointments();
    }
  }, [isConnected, fetchBlockchainAppointments]);

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
      
      // Use the appointment ID from blockchain (for blockchain appointments) or blockchainId (for legacy)
      const appointmentId = blockchainId || id;
      await approveAppointment(appointmentId);
      
      setSuccess(`Appointment approved successfully!`);
    } catch (error) {
      console.error('Error approving appointment:', error);
      setError('Failed to approve appointment. You may not be authorized or the appointment may not exist on blockchain.');
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
      
      // Use the appointment ID from blockchain (for blockchain appointments) or blockchainId (for legacy)
      const appointmentId = blockchainId || id;
      await declineAppointment(appointmentId);
      
      setSuccess(`Appointment declined successfully!`);
    } catch (error) {
      console.error('Error declining appointment:', error);
      setError('Failed to decline appointment. You may not be authorized or the appointment may not exist.');
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

      {appointmentsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{appointmentsError}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Display blockchain appointments if connected */}
      {isConnected ? (
        blockchainAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found on blockchain.</p>
          </div>
        ) : (
          blockchainAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="mb-4 p-4 border rounded-md border-gray-300 bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Appointment ID:</strong> {appointment.id}</p>
                  <p><strong>Patient ID:</strong> {appointment.patientID}</p>
                  <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Address: {appointment.doctor.slice(0, 10)}...{appointment.doctor.slice(-8)}
                  </p>
                </div>
                <div>
                  <p><strong>Timestamp:</strong> {appointment.timestamp.toLocaleString()}</p>
                  <p><strong>Status:</strong>{' '}
                    <span
                      className={
                        appointment.status === 'Pending'
                          ? 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs'
                          : appointment.status === 'Approved'
                          ? 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs'
                          : 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
                      }
                    >
                      {appointment.status}
                    </span>
                  </p>
                </div>
              </div>

              {appointment.status === 'Pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(appointment.id)}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
                  >
                    {loading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleDecline(appointment.id)}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
                  >
                    {loading ? 'Processing...' : 'Decline'}
                  </button>
                </div>
              )}
            </div>
          ))
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Please connect your wallet to manage blockchain appointments.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
