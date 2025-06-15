// src/hooks/useAppointments.js
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
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
  }, []);  const bookAppointment = useCallback(async (patientID, doctorAddress) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    // Validate inputs
    if (!patientID || isNaN(patientID) || patientID <= 0) {
      throw new Error('Invalid patient ID');
    }

    // Validate and checksum the doctor address
    if (!doctorAddress || typeof doctorAddress !== 'string') {
      throw new Error('Invalid doctor address: address is required');
    }

    let validDoctorAddress;
    try {
      // Use ethers.js to validate and checksum the address
      validDoctorAddress = ethers.utils.getAddress(doctorAddress);
    } catch (addressError) {
      console.error('Address validation error:', addressError);
      throw new Error(`Invalid doctor address format: ${doctorAddress}`);
    }

    try {
      setLoading(true);
        // Convert patientID to BigNumber to ensure it's properly formatted
      const validPatientID = Math.floor(Number(patientID));
      
      console.log('Booking appointment with:', { 
        patientID: validPatientID, 
        doctor: validDoctorAddress 
      }); // Debug log
      
      const tx = await contract.bookAppointment(validPatientID, validDoctorAddress);
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
  }, [contract, isConnected]);const approveAppointment = useCallback(async (appointmentId, blockchainId) => {
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
  const getAppointmentDetails = useCallback(async (appointmentID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!appointmentID || isNaN(appointmentID) || appointmentID <= 0) {
      throw new Error('Invalid appointment ID');
    }

    try {
      setLoading(true);
      const appointment = await contract.getAppointment(appointmentID);
      
      return {
        appointmentID: appointment.appointmentID.toString(),
        patientID: appointment.patientID.toString(),
        doctor: appointment.doctor,
        timestamp: appointment.timestamp.toString(),
        status: appointment.status
      };
    } catch (error) {
      console.error('Error getting appointment details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const getPatientAppointments = useCallback(async (patientID) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    if (!patientID || isNaN(patientID) || patientID <= 0) {
      throw new Error('Invalid patient ID');
    }

    try {
      setLoading(true);
      const appointments = await contract.getPatientAppointments(patientID);
      
      return appointments.map(appointment => ({
        appointmentID: appointment.appointmentID.toString(),
        patientID: appointment.patientID.toString(),
        doctor: appointment.doctor,
        timestamp: appointment.timestamp.toString(),
        status: appointment.status
      }));
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  const getTotalAppointments = useCallback(async () => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    try {
      const total = await contract.totalAppointments();
      return total.toString();
    } catch (error) {
      console.error('Error getting total appointments:', error);
      return '0';
    }
  }, [contract, isConnected]);

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    approveAppointment,
    declineAppointment,
    getAppointmentDetails,
    getPatientAppointments,
    getTotalAppointments,
    fetchAppointments,
    setAppointments
  };
};
