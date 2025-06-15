// src/hooks/usePatient.js
import { useState, useCallback } from 'react';
import { useContract } from './useContract';

export const usePatient = () => {
  const { contract, isConnected, account } = useContract();
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const registerPatient = useCallback(async (name) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Invalid patient name');
    }

    try {
      setLoading(true);
      const tx = await contract.registerPatient(name.trim());
      const receipt = await tx.wait();
      
      // Extract patient ID from transaction receipt
      const patientID = receipt.events?.find(
        event => event.event === 'PatientRegistered'
      )?.args?.patientID;

      return patientID ? patientID.toString() : null;
    } catch (error) {
      console.error('Error registering patient:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const getPatientID = useCallback(async (walletAddress = null) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      const address = walletAddress || account;
      const patientID = await contract.addressToPatientID(address);
      return patientID.toString() !== '0' ? patientID.toString() : null;
    } catch (error) {
      console.error('Error getting patient ID:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, account]);

  const getPatientInfo = useCallback(async (patientID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!patientID || isNaN(patientID) || patientID <= 0) {
      throw new Error('Invalid patient ID');
    }

    try {
      setLoading(true);
      const patient = await contract.patients(patientID);
      
      const patientInfo = {
        patientID: patient.patientID.toString(),
        name: patient.name,
        wallet: patient.wallet
      };
      
      setPatientData(patientInfo);
      return patientInfo;
    } catch (error) {
      console.error('Error getting patient info:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const getTotalPatients = useCallback(async () => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      const total = await contract.totalPatients();
      return total.toString();
    } catch (error) {
      console.error('Error getting total patients:', error);
      return '0';
    }
  }, [contract, isConnected]);

  const isPatientRegistered = useCallback(async (walletAddress = null) => {
    try {
      const patientID = await getPatientID(walletAddress);
      return patientID !== null;
    } catch (error) {
      console.error('Error checking patient registration:', error);
      return false;
    }
  }, [getPatientID]);

  return {
    registerPatient,
    getPatientID,
    getPatientInfo,
    getTotalPatients,
    isPatientRegistered,
    patientData,
    loading
  };
};
