// src/hooks/useAppointments.js
import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { 
  getAllAppointments, 
  updateAppointmentStatus, 
  subscribeToPendingAppointments 
} from '../services/appointmentService';

export const useAppointments = () => {
  const { contract, isConnected } = useContract();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  // Fetch appointments from Firestore
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const appointmentsData = await getAllAppointments();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates for pending appointments
  useEffect(() => {
    const unsubscribe = subscribeToPendingAppointments((appointmentsData) => {
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  const bookAppointment = useCallback(async (patientID, doctor) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    // Validate inputs
    if (!patientID || isNaN(patientID) || patientID <= 0) {
      throw new Error('Invalid patient ID');
    }

    if (!doctor || typeof doctor !== 'string' || doctor.trim().length === 0) {
      throw new Error('Invalid doctor name');
    }

    try {
      setLoading(true);
      
      // Convert patientID to BigNumber to ensure it's properly formatted
      const validPatientID = Math.floor(Number(patientID));
      const validDoctor = doctor.trim();
      
      console.log('Booking appointment with:', { patientID: validPatientID, doctor: validDoctor }); // Debug log
      
      const tx = await contract.bookAppointment(validPatientID, validDoctor);
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
  }, [contract, isConnected]);  const approveAppointment = useCallback(async (appointmentId, blockchainId) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    // Validate blockchainId
    if (!blockchainId || isNaN(blockchainId) || blockchainId <= 0) {
      throw new Error('Invalid blockchain appointment ID');
    }

    try {
      setLoading(true);
      const validAppointmentID = Math.floor(Number(blockchainId));
      
      console.log('Approving appointment with blockchain ID:', validAppointmentID);
      
      // Update on blockchain first
      const tx = await contract.approveAppointment(validAppointmentID);
      await tx.wait();
      
      // Update in Firestore
      await updateAppointmentStatus(appointmentId, 'approved', blockchainId);
      
      // Refresh appointments
      await fetchAppointments();
      
      return true;
    } catch (error) {
      console.error('Error approving appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, fetchAppointments]);

  const declineAppointment = useCallback(async (appointmentId, blockchainId) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    // Validate blockchainId
    if (!blockchainId || isNaN(blockchainId) || blockchainId <= 0) {
      throw new Error('Invalid blockchain appointment ID');
    }

    try {
      setLoading(true);
      const validAppointmentID = Math.floor(Number(blockchainId));
      
      console.log('Declining appointment with blockchain ID:', validAppointmentID);
      
      // Update on blockchain first
      const tx = await contract.declineAppointment(validAppointmentID);
      await tx.wait();
      
      // Update in Firestore
      await updateAppointmentStatus(appointmentId, 'declined', blockchainId);
      
      // Refresh appointments
      await fetchAppointments();
      
      return true;
    } catch (error) {
      console.error('Error declining appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, fetchAppointments]);
  const getAppointmentStatus = useCallback(async (appointmentID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    // Validate appointmentID
    if (!appointmentID || isNaN(appointmentID) || appointmentID <= 0) {
      throw new Error('Invalid appointment ID');
    }

    try {
      const validAppointmentID = Math.floor(Number(appointmentID));
      
      console.log('Getting status for appointment ID:', validAppointmentID); // Debug log
      
      const status = await contract.getAppointmentStatus(validAppointmentID);
      return status;
    } catch (error) {
      console.error('Error getting appointment status:', error);
      throw error;
    }
  }, [contract, isConnected]);
  return {
    appointments,
    loading,
    error,
    bookAppointment,
    approveAppointment,
    declineAppointment,
    getAppointmentStatus,
    fetchAppointments,
    setAppointments
  };
};
