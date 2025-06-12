// src/services/appointmentService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

const APPOINTMENTS_COLLECTION = 'appointments';

// Create a new appointment in Firestore
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get appointments by status
export const getAppointmentsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments by status:', error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status, blockchainId = null) => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (blockchainId) {
      updateData.blockchainId = blockchainId;
    }
    
    await updateDoc(appointmentRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

// Listen to appointments in real-time
export const subscribeToAppointments = (callback) => {
  const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const appointments = [];
    snapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(appointments);
  });
};

// Listen to pending appointments in real-time
export const subscribeToPendingAppointments = (callback) => {
  const q = query(
    collection(db, APPOINTMENTS_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const appointments = [];
    snapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(appointments);
  });
};