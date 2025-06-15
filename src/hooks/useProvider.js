// src/hooks/useProvider.js
import { useState, useCallback } from 'react';
import { useContract } from './useContract';

export const useProvider = () => {
  const { contract, isConnected, isOwner, account } = useContract();
  const [loading, setLoading] = useState(false);

  const authorizeProvider = useCallback(async (providerAddress) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!isOwner) {
      throw new Error('Only contract owner can authorize providers');
    }

    if (!providerAddress || !providerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid provider address');
    }

    try {
      setLoading(true);
      const tx = await contract.authorizeProvider(providerAddress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error authorizing provider:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, isOwner]);

  const revokeProvider = useCallback(async (providerAddress) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!isOwner) {
      throw new Error('Only contract owner can revoke providers');
    }

    if (!providerAddress || !providerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid provider address');
    }

    try {
      setLoading(true);
      const tx = await contract.revokeProvider(providerAddress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error revoking provider:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, isOwner]);

  const isAuthorizedProvider = useCallback(async (providerAddress) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!providerAddress || !providerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid provider address');
    }

    try {
      const isAuthorized = await contract.authorizedProviders(providerAddress);
      return isAuthorized;
    } catch (error) {
      console.error('Error checking provider authorization:', error);
      return false;
    }
  }, [contract, isConnected]);
  const checkCurrentUserAuthorization = useCallback(async () => {
    if (!contract || !isConnected || !account) {
      return false;
    }

    try {
      return await isAuthorizedProvider(account);
    } catch (error) {
      console.error('Error checking current user authorization:', error);
      return false;
    }
  }, [contract, isConnected, account, isAuthorizedProvider]);

  return {
    authorizeProvider,
    revokeProvider,
    isAuthorizedProvider,
    checkCurrentUserAuthorization,
    loading
  };
};
