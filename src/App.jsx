// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/login/Login';
import Signup from './Pages/signup/Signup';
import Healthcare from './Pages/healthcare/Healthcare';
import Navbar from './Components/Navbar';
import AdminAppointments from './Pages/appointments/AppointmentList';
import UserAppointments from './Pages/appointments/AppointmentRequestForm';
import Dashboard from './Pages/dashboard/Dashboard';
import Layout from './Components/Layout';
import UserLayout from './Components/UserLayout';
import Support from './Pages/Support/Support';
import UserSupportForm from './Pages/Support/UserSupportForm';
import UserSupportList from './Pages/Support/UserSupportList';
import User from './Pages/user/user';
import UserRecords from './Pages/user/UserRecords';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout><AdminAppointments /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/healthcare" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout><Healthcare /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout><Support /></Layout>
              </ProtectedRoute>
            } 
          />

          {/* User routes */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout><User /></UserLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/appointments" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout><UserAppointments /></UserLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/records" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout><UserRecords /></UserLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/support" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout><UserSupportList /></UserLayout>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
