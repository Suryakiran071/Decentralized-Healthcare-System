import React from 'react';
import { Link } from 'react-router-dom';

const PatientLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      

      {/* Welcome Section */}
      <section className="text-center py-12 bg-white">
        <h1 className="text-4xl font-bold text-cyan-600 mb-4">Welcome to MedEase</h1>
        <p className="text-lg text-gray-700">Your healthcare, simplified. Book appointments, manage your health records, and get support anytime, anywhere.</p>
        <div className="mt-6">
          <Link
            to="/user_appointments"
            className="bg-cyan-600 text-white py-3 px-6 rounded-md hover:bg-cyan-700"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto py-12 text-center">
        <h2 className="text-3xl font-semibold mb-8">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-cyan-600 text-3xl mb-4">
              {/* Icon for feature */}
            </div>
            <h3 className="font-semibold text-xl">Book an Appointment</h3>
            <p className="text-gray-600">Easily schedule appointments with your preferred healthcare providers.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-cyan-600 text-3xl mb-4">
              {/* Icon for feature */}
            </div>
            <h3 className="font-semibold text-xl">View Medical Records</h3>
            <p className="text-gray-600">Access your complete medical history and stay on top of your health.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-cyan-600 text-3xl mb-4">
              {/* Icon for feature */}
            </div>
            <h3 className="font-semibold text-xl">Get Support</h3>
            <p className="text-gray-600">Submit support tickets and get assistance from healthcare providers or our support team.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-cyan-600 text-white text-center py-12">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-6">Start managing your health today by booking an appointment or accessing your records.</p>
        <Link
          to="/appointments"
          className="bg-white text-cyan-600 py-3 px-6 rounded-md hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <Link to="/about" className="text-gray-400 hover:text-white px-4">About Us</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white px-4">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white px-4">Terms & Conditions</Link>
          </div>
          <div className="text-gray-400">© 2025 MedEase. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default PatientLandingPage;