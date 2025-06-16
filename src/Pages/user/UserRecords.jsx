// src/Pages/user/UserRecords.jsx
import React, { useState, useEffect } from 'react';
import { useHealthcareRecords } from '../../hooks/useHealthcareRecords';
import { useContract } from '../../hooks/useContract';
import { useAuth } from '../../contexts/AuthContext';

const UserRecords = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet, account } = useContract();
  const { records, loading, getPatientRecords } = useHealthcareRecords();
  const [patientID, setPatientID] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      // Use a simplified patient ID based on user UID
      const numericPatientID = parseInt(user.uid.slice(-8), 16) % 1000000;
      setPatientID(numericPatientID.toString());
    }
  }, [user]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setError('');
    } catch (error) {
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
    }
  };

  const handleFetchRecords = async () => {
    if (!patientID) {
      setError('Patient ID is required');
      return;
    }

    try {
      setError('');
      await getPatientRecords(parseInt(patientID));
    } catch (error) {
      setError('Failed to fetch records. You may not be authorized to view these records.');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Medical Records</h1>

      {!isConnected ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Connect Your Wallet</h2>
          <p className="text-blue-600 mb-4">
            To access your medical records, you need to connect your crypto wallet (MetaMask).
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">
            <span className="font-semibold">Wallet Connected:</span> {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Patient ID
            </label>
            <input
              type="text"
              value={patientID}
              onChange={(e) => setPatientID(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your patient ID"
            />
          </div>
          <button
            onClick={handleFetchRecords}
            disabled={loading || !isConnected}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Fetch Records'}
          </button>
        </div>
      </div>

      {records.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Medical Records</h2>
          {records.map((record, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Record ID</h3>
                  <p className="text-gray-600">{record.recordID?.toString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Patient Name</h3>
                  <p className="text-gray-600">{record.patientName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Diagnosis</h3>
                  <p className="text-gray-600">{record.diagnosis}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Treatment</h3>
                  <p className="text-gray-600">{record.treatment}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700">Date</h3>
                  <p className="text-gray-600">{formatTimestamp(record.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && isConnected && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No medical records found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Your healthcare provider needs to add records to your patient ID.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default UserRecords;
