// src/hooks/useAppointments.js
import { useState, useCallback } from 'react';
import { useContract } from './useContract';

export const useAppointments = () => {
  const { contract, isConnected } = useContract();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const bookAppointment = useCallback(async (patientID, doctor) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      const tx = await contract.bookAppointment(patientID, doctor);
      const receipt = await tx.wait();
      
      // Extract appointment ID from transaction receipt
      const appointmentID = receipt.events?.find(
        event => event.event === 'AppointmentBooked'
      )?.args?.appointmentID || Date.now(); // Fallback to timestamp

      return appointmentID;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const approveAppointment = useCallback(async (appointmentID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      const tx = await contract.approveAppointment(appointmentID);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error approving appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const declineAppointment = useCallback(async (appointmentID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      const tx = await contract.declineAppointment(appointmentID);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error declining appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const getAppointmentStatus = useCallback(async (appointmentID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      const status = await contract.getAppointmentStatus(appointmentID);
      return status;
    } catch (error) {
      console.error('Error getting appointment status:', error);
      throw error;
    }
  }, [contract, isConnected]);

  return {
    appointments,
    loading,
    bookAppointment,
    approveAppointment,
    declineAppointment,
    getAppointmentStatus,
    setAppointments
  };
};
