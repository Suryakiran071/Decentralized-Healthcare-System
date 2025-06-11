// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/login/Login';
import Signup from './Pages/signup/Signup';
import Healthcare from './Pages/healthcare/Healthcare';
import Navbar from './Components/Navbar';
import AdminAppointments from './Pages/appointments/AppointmentList';
import UserAppointments from './Pages/appointments/AppointmentRequestForm';
import Dashboard from './Pages/dashboard/Dashboard';
import Layout from '../src/Components/Layout';
import Support from './Pages/Support/Support';
import UserSupportForm from './Pages/Support/UserSupportForm';
import UserSupportList from './Pages/Support/UserSupportList';
import PatientLandingPage from './Pages/Home/PatientLandingPage';


const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar can be placed globally for all routes */}
      <Routes>
        {/* Routes that don't need the sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user_appointments" element={<UserAppointments />} />
        <Route path="/patientlanding" element={<PatientLandingPage />} />

        
        {/* Routes that need the sidebar */}
        <Route path="/healthcare" element={<Layout><Healthcare /></Layout>} />
        <Route path="/appointments" element={<Layout><AdminAppointments /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />

        {/* User Support Routes */}
        <Route path="/usersupport" element={<Layout><UserSupportList /></Layout>} />
        <Route path="/support/submit" element={<Layout><UserSupportForm /></Layout>} />

      </Routes>
    </Router>
  );
};

export default App;
