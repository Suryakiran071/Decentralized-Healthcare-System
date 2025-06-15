import React, { useState } from 'react';
import { useContract } from '../../../hooks/useContract';
import { useHealthcareRecords } from '../../../hooks/useHealthcareRecords';

const Healthcare = () => {
  const { isConnected, connectWallet, account, isOwner } = useContract();
  const { authorizeProvider, addRecord, getPatientRecords, records, loading } = useHealthcareRecords();
  
  const [providerAddress, setProviderAddress] = useState("");

  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [recordPatientID, setRecordPatientID] = useState("");
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

  const handleAuthorizeProvider = async () => {
    if (!providerAddress.trim()) {
      setError('Please enter a valid provider address.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await authorizeProvider(providerAddress);
      setSuccess('Provider authorized successfully!');
      setProviderAddress('');
    } catch (error) {
      console.error('Error authorizing provider:', error);
      setError('Only contract owner can authorize providers.');
    }
  };

  const handleAddRecord = async () => {
    if (!patientID || !patientName || !diagnosis || !treatment) {
      setError('Please fill in all fields for the medical record.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await addRecord(parseInt(patientID), patientName, diagnosis, treatment);
      setSuccess('Medical record added successfully!');
      
      // Reset form
      setPatientID('');
      setPatientName('');
      setDiagnosis('');
      setTreatment('');
    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add record. You may not be authorized.');
    }
  };

  const handleGetRecords = async () => {
    if (!recordPatientID) {
      setError('Please enter a patient ID to retrieve records.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await getPatientRecords(parseInt(recordPatientID));
      setSuccess('Records retrieved successfully!');
    } catch (error) {
      console.error('Error getting records:', error);
      setError('Failed to retrieve records. You may not be authorized.');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-6">Healthcare Management</h1>

      {/* Wallet Connection Status */}
      {!isConnected ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Connect Your Wallet</h2>
          <p className="text-blue-600 mb-4">
            To manage healthcare records on the blockchain, you need to connect your crypto wallet.
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
          {isOwner && (
            <p className="text-green-600 text-sm mt-1">
              You are the contract owner and can authorize providers.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authorize Provider Section */}
        {isOwner && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Authorize Healthcare Provider</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Provider Wallet Address (0x...)"
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
              />
              <button
                onClick={handleAuthorizeProvider}
                disabled={loading || !isConnected}
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Authorize Provider'}
              </button>
            </div>
          </div>
        )}

        {/* Add Medical Record Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add Medical Record</h2>
          <div className="space-y-4">
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Patient ID"
              value={patientID}
              onChange={(e) => setPatientID(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Treatment"
              rows="3"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
            />
            <button
              onClick={handleAddRecord}
              disabled={loading || !isConnected}
              className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </div>

        {/* Get Patient Records Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Retrieve Patient Records</h2>
          <div className="flex gap-4 mb-6">
            <input
              type="number"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Patient ID"
              value={recordPatientID}
              onChange={(e) => setRecordPatientID(e.target.value)}
            />
            <button
              onClick={handleGetRecords}
              disabled={loading || !isConnected}
              className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Records'}
            </button>
          </div>

          {/* Display Records */}
          {records.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Records</h3>
              {records.map((record, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Record ID</h4>
                      <p className="text-gray-600">{record.recordID?.toString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Patient Name</h4>
                      <p className="text-gray-600">{record.patientName}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Diagnosis</h4>
                      <p className="text-gray-600">{record.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Treatment</h4>
                      <p className="text-gray-600">{record.treatment}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-700">Date Added</h4>
                      <p className="text-gray-600">{formatTimestamp(record.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Healthcare;