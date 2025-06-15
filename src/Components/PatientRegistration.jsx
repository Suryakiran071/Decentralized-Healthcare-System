// src/components/PatientRegistration.jsx
import React, { useState, useEffect } from 'react';
import { usePatient } from '../hooks/usePatient';
import { useContract } from '../hooks/useContract';

const PatientRegistration = ({ onRegistrationComplete }) => {
  const { registerPatient, getPatientID, isPatientRegistered, loading } = usePatient();
  const { isConnected, account, connectWallet } = useContract();
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [patientID, setPatientID] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (isConnected && account) {
      checkRegistrationStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [isConnected, account]);

  const checkRegistrationStatus = async () => {
    try {
      setCheckingStatus(true);
      const registered = await isPatientRegistered();
      setIsRegistered(registered);
      
      if (registered) {
        const id = await getPatientID();
        setPatientID(id);
        if (onRegistrationComplete) {
          onRegistrationComplete(id);
        }
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    try {
      const newPatientID = await registerPatient(name.trim());
      setPatientID(newPatientID);
      setIsRegistered(true);
      setSuccess(`Registration successful! Your Patient ID is: ${newPatientID}`);
      
      if (onRegistrationComplete) {
        onRegistrationComplete(newPatientID);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('Already registered')) {
        setError('You are already registered. Checking your patient ID...');
        await checkRegistrationStatus();
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setError('');
    } catch (error) {
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
    }
  };

  if (checkingStatus) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-blue-800">Checking registration status...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Connect Your Wallet</h3>
        <p className="text-yellow-700 text-sm mb-4">
          To register as a patient, you need to connect your crypto wallet first.
        </p>
        <button
          onClick={handleConnectWallet}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-green-800">Patient Registered</h3>
        </div>
        <p className="text-green-700 text-sm mb-2">
          You are successfully registered in the healthcare system.
        </p>
        <p className="text-green-600 text-sm font-mono">
          <span className="font-medium">Patient ID:</span> {patientID}
        </p>
        <p className="text-green-600 text-sm font-mono">
          <span className="font-medium">Wallet:</span> {account?.slice(0, 6)}...{account?.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Patient Registration Required</h3>
      <p className="text-gray-600 text-sm mb-4">
        To book appointments and access medical records, you need to register as a patient first.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register as Patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientRegistration;
