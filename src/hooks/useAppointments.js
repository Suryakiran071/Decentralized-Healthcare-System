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
  const [blockchainAppointments, setBlockchainAppointments] = useState([]);
  const [error, setError] = useState('');

  // Helper function to get doctor name from address (you might want to move this to a service)
  const getDoctorName = (address) => {
    const doctors = {
      '0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8': 'Dr. Sarah Johnson',
      '0x8ba1f109551bD432803012645Aac136c30C85a1c': 'Dr. Michael Chen', 
      '0xc6272e8032853d7F12d2caDcb35eD742990D6C61': 'Dr. Emily Davis',
      '0x4E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F': 'Dr. James Wilson'
    };
    return doctors[address] || `Unknown Doctor (${address.slice(0, 6)}...${address.slice(-4)})`;
  };

  // Fetch all appointments from blockchain
  const fetchBlockchainAppointments = useCallback(async () => {
    if (!contract || !isConnected) return;

    try {
      setLoading(true);
      const totalAppointments = await contract.totalAppointments();
      const appointmentsList = [];

      for (let i = 1; i <= totalAppointments.toNumber(); i++) {
        try {
          const appointment = await contract.getAppointment(i);
          appointmentsList.push({
            id: appointment.appointmentID.toNumber(),
            patientID: appointment.patientID.toNumber(),
            doctor: appointment.doctor,
            doctorName: getDoctorName(appointment.doctor),
            timestamp: new Date(appointment.timestamp.toNumber() * 1000),
            status: ['Pending', 'Approved', 'Declined'][appointment.status],
            blockchainId: appointment.appointmentID.toNumber()
          });
        } catch (err) {
          console.warn(`Failed to fetch appointment ${i}:`, err);
        }
      }

      setBlockchainAppointments(appointmentsList);
    } catch (error) {
      console.error('Error fetching blockchain appointments:', error);
      setError('Failed to fetch appointments from blockchain');
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  // Fetch patient's appointments from blockchain
  const fetchPatientAppointments = useCallback(async (patientID) => {
    if (!contract || !isConnected) return [];

    try {
      const appointments = await contract.getPatientAppointments(patientID);
      return appointments.map(appointment => ({
        id: appointment.appointmentID.toNumber(),
        patientID: appointment.patientID.toNumber(),
        doctor: appointment.doctor,
        doctorName: getDoctorName(appointment.doctor),
        timestamp: new Date(appointment.timestamp.toNumber() * 1000),
        status: ['Pending', 'Approved', 'Declined'][appointment.status],
        blockchainId: appointment.appointmentID.toNumber()
      }));
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  }, [contract, isConnected]);

  // Fetch appointments from Firestore (legacy)
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

  // Auto-fetch blockchain appointments when contract is available
  useEffect(() => {
    if (contract && isConnected) {
      fetchBlockchainAppointments();
    }
  }, [contract, isConnected, fetchBlockchainAppointments]);

  // Subscribe to real-time updates for pending appointments (legacy)
  useEffect(() => {
    const unsubscribe = subscribeToPendingAppointments((appointmentsData) => {
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);const bookAppointment = useCallback(async (patientID, doctorAddress) => {
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

      // Refresh blockchain appointments after booking
      await fetchBlockchainAppointments();

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

    // Use blockchainId if provided, otherwise use appointmentId
    const validID = blockchainId || appointmentId;
    if (!validID || isNaN(validID) || validID <= 0) {
      throw new Error('Invalid appointment ID');
    }

    try {
      setLoading(true);
      const validAppointmentID = Math.floor(Number(validID));
      
      console.log('Approving appointment with ID:', validAppointmentID);
      
      // Update on blockchain
      const tx = await contract.approveAppointment(validAppointmentID);
      await tx.wait();
      
      // Refresh blockchain appointments to get updated status
      await fetchBlockchainAppointments();
      
      return true;
    } catch (error) {
      console.error('Error approving appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, fetchBlockchainAppointments]);
  const declineAppointment = useCallback(async (appointmentId, blockchainId) => {
    if (!contract || !isConnected) {
      throw new Error('Contract not connected');
    }

    // Use blockchainId if provided, otherwise use appointmentId
    const validID = blockchainId || appointmentId;
    if (!validID || isNaN(validID) || validID <= 0) {
      throw new Error('Invalid appointment ID');
    }

    try {
      setLoading(true);
      const validAppointmentID = Math.floor(Number(validID));
      
      console.log('Declining appointment with ID:', validAppointmentID);
      
      // Update on blockchain
      const tx = await contract.declineAppointment(validAppointmentID);
      await tx.wait();
      
      // Refresh blockchain appointments to get updated status
      await fetchBlockchainAppointments();
      
      return true;
    } catch (error) {
      console.error('Error declining appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, fetchBlockchainAppointments]);
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
    blockchainAppointments,
    loading,
    error,
    bookAppointment,
    approveAppointment,
    declineAppointment,
    getAppointmentDetails,
    getPatientAppointments,
    getTotalAppointments,
    fetchAppointments,
    fetchBlockchainAppointments,
    fetchPatientAppointments,
    setAppointments
  };
};
