// src/Pages/appointments/AppointmentList.js

import React, { useState } from 'react';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([
    // Placeholder data for demonstration
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      date: '2023-09-20',
      time: '14:00',
      reason: 'Checkup',
      status: 'Pending',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      date: '2023-09-21',
      time: '10:00',
      reason: 'Dental Cleaning',
      status: 'Pending',
    },
  ]);

  const handleApprove = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: 'Approved' }
          : appointment
      )
    );
  };

  const handleDecline = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: 'Declined' }
          : appointment
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Appointment Requests</h2>

      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="mb-4 p-4 border rounded-md border-gray-300"
        >
          <p>
            <strong>Name:</strong> {appointment.name}
          </p>
          <p>
            <strong>Email:</strong> {appointment.email}
          </p>
          <p>
            <strong>Date & Time:</strong> {appointment.date} at {appointment.time}
          </p>
          <p>
            <strong>Reason:</strong> {appointment.reason}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={
                appointment.status === 'Pending'
                  ? 'text-yellow-500'
                  : appointment.status === 'Approved'
                  ? 'text-green-500'
                  : 'text-red-500'
              }
            >
              {appointment.status}
            </span>
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleApprove(appointment.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={appointment.status !== 'Pending'}
            >
              Approve
            </button>
            <button
              onClick={() => handleDecline(appointment.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              disabled={appointment.status !== 'Pending'}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
