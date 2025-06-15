// src/components/ProviderManagement.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useProvider } from '../hooks/useProvider';
import { useContract } from '../hooks/useContract';

const ProviderManagement = () => {
  const { authorizeProvider, revokeProvider, isAuthorizedProvider, loading } = useProvider();
  const { isConnected, isOwner, connectWallet } = useContract();
  const [providerAddress, setProviderAddress] = useState('');
  const [revokeAddress, setRevokeAddress] = useState('');
  const [checkAddress, setCheckAddress] = useState('');
  const [authorizationStatus, setAuthorizationStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleAuthorize = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!providerAddress.trim()) {
      setError('Please enter a provider address');
      return;
    }

    // Validate and checksum the address
    let validAddress;
    try {
      validAddress = ethers.utils.getAddress(providerAddress.trim());
    } catch (addressError) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      await authorizeProvider(validAddress);
      setSuccess(`Provider ${validAddress} has been authorized successfully!`);
      setProviderAddress('');
    } catch (error) {
      console.error('Authorization error:', error);
      setError('Failed to authorize provider. Make sure you are the contract owner.');
    }
  };
  const handleRevoke = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!revokeAddress.trim()) {
      setError('Please enter a provider address');
      return;
    }

    // Validate and checksum the address
    let validAddress;
    try {
      validAddress = ethers.utils.getAddress(revokeAddress.trim());
    } catch (addressError) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      await revokeProvider(validAddress);
      setSuccess(`Provider ${validAddress} has been revoked successfully!`);
      setRevokeAddress('');
    } catch (error) {
      console.error('Revoke error:', error);
      setError('Failed to revoke provider. Make sure the address is currently authorized.');
    }
  };
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setError('');
    setAuthorizationStatus(null);

    if (!checkAddress.trim()) {
      setError('Please enter a provider address');
      return;
    }

    // Validate and checksum the address
    let validAddress;
    try {
      validAddress = ethers.utils.getAddress(checkAddress.trim());
    } catch (addressError) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      const isAuthorized = await isAuthorizedProvider(validAddress);
      setAuthorizationStatus(isAuthorized);
    } catch (error) {
      console.error('Check status error:', error);
      setError('Failed to check provider status.');
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

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Connect Your Wallet</h3>
        <p className="text-yellow-700 text-sm mb-4">
          To manage healthcare providers, you need to connect your crypto wallet first.
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

  if (!isOwner) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-700 text-sm">
          Only the contract owner can manage healthcare providers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Healthcare Provider Management</h2>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Authorize Provider */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Authorize Provider</h3>
            <form onSubmit={handleAuthorize} className="space-y-3">
              <input
                type="text"
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
                placeholder="0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Authorizing...' : 'Authorize'}
              </button>
            </form>
          </div>

          {/* Revoke Provider */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Revoke Provider</h3>
            <form onSubmit={handleRevoke} className="space-y-3">
              <input
                type="text"
                value={revokeAddress}
                onChange={(e) => setRevokeAddress(e.target.value)}
                placeholder="0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Revoking...' : 'Revoke'}
              </button>
            </form>
          </div>

          {/* Check Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Check Status</h3>
            <form onSubmit={handleCheckStatus} className="space-y-3">
              <input
                type="text"
                value={checkAddress}
                onChange={(e) => setCheckAddress(e.target.value)}
                placeholder="0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {authorizationStatus !== null && (
              <div className={`p-3 rounded-lg border ${
                authorizationStatus 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  authorizationStatus ? 'text-green-800' : 'text-red-800'
                }`}>
                  Status: {authorizationStatus ? 'Authorized' : 'Not Authorized'}
                </p>
              </div>
            )}
          </div>
        </div>        {/* Common Provider Addresses (for testing) */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Test Provider Addresses:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-gray-600">
            <div>0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8</div>
            <div>0x8ba1f109551bD432803012645Aac136c30C85a1c</div>
            <div>0x9CD8362D2C6C64C7D2E7D4F5E6F7A8B9C0D1E2F3</div>
            <div>0x4E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderManagement;
