import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useContract } from '../../hooks/useContract';
import { useAppointments } from '../../hooks/useAppointments';
import appointment from '../../assets/Appointment.jpg';

const AppointmentRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected, connectWallet, account } = useContract();
  const { bookAppointment, loading } = useAppointments();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [doctor, setDoctor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setError('');
    } catch (error) {
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isConnected) {
      setError('Please connect your wallet first to book an appointment on the blockchain.');
      return;
    }

    if (!doctor.trim()) {
      setError('Please specify the doctor you want to see.');
      return;
    }

    try {
      // Generate a patient ID based on user UID
      const patientID = user?.uid ? parseInt(user.uid.slice(-8), 16) % 1000000 : Math.floor(Math.random() * 1000000);
      
      // Book appointment on blockchain
      const appointmentID = await bookAppointment(patientID, doctor);
      
      setSuccess(`Appointment booked successfully! Your appointment ID is: ${appointmentID}`);
      
      // Reset form
      setName('');
      setDate('');
      setTime('');
      setReason('');
      setDoctor('');

      // Redirect to user dashboard after 3 seconds
      setTimeout(() => {
        navigate('/user');
      }, 3000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Image Section */}
      <div className="hidden md:block w-1/2 bg-blue-200 relative">
        <img
          src={appointment}
          alt="Appointment booking illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Book An Appointment Online!</h2>
          <p className="text-gray-500 mb-6">
            We have the best specialists in your region. Quality, guarantee and professionalism are our slogan!
          </p>

          {/* Wallet Connection Status */}
          {!isConnected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Connect Your Wallet</h3>
              <p className="text-yellow-700 text-sm mb-3">
                To book appointments on the blockchain, you need to connect your crypto wallet.
              </p>
              <button
                onClick={handleConnectWallet}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                <span className="font-semibold">Wallet Connected:</span> {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
          )}

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor/Specialist</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter doctor name or specialty"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
              />
            </div>

            {/* Date and Time in One Line */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Your Message</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your reason for the appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="2"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isConnected}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Submit'}
              {!loading && (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l9 6 9-6m-9 6v10m-9-10h18a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"
                  />
                </svg>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            By clicking Submit, you agree to our updated{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequestForm;