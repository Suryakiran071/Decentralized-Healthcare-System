
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/login/Login';
import Signup from './Pages/signup/Signup.jsx';
import Healthcare from './Pages/healthcare/Healthcare';
import Navbar from './Components/Navbar';
import Appointments from './Pages/appointments/Appointments';  // Example Component
import Dashboard from './Pages/dashboard/Dashboard';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/healthcare" element={<Healthcare />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
