import React, { useState } from 'react';
import appointment from '../../assets/Appointment.jpg'; // Import the image

const AppointmentRequestForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment Request:', { name, email, date, time, reason });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Image Section */}
      <div className="hidden md:block w-1/2 bg-blue-200 relative">
        <img
          src={appointment}
          alt="Appliances illustration with refrigerator, washing machine, and microwave"
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
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              Submit
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