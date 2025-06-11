
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../src/Pages/Login';
import Signup from '../src/Pages/Signup';
import Healthcare from './Healthcare';
import Navbar from './Components/Navbar';
import Appointments from './Pages/Appointments';  // Example Component
import Dashboard from './Pages/Dashboard';


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
