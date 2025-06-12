// src/hooks/useHealthcareRecords.js
import { useState, useCallback } from 'react';
import { useContract } from './useContract';

export const useHealthcareRecords = () => {
  const { contract, isConnected } = useContract();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const addRecord = useCallback(async (patientID, patientName, diagnosis, treatment) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      const tx = await contract.addRecord(patientID, patientName, diagnosis, treatment);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const getPatientRecords = useCallback(async (patientID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      const patientRecords = await contract.getPatientRecords(patientID);
      setRecords(patientRecords);
      return patientRecords;
    } catch (error) {
      console.error('Error getting patient records:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const authorizeProvider = useCallback(async (providerAddress) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
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
  }, [contract, isConnected]);

  return {
    records,
    loading,
    addRecord,
    getPatientRecords,
    authorizeProvider,
    setRecords
  };
};
