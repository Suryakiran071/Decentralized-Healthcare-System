// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/auth/Login';
import Signup from './Pages/auth/Signup';
import Healthcare from './Pages/admin/healthcare/Healthcare';
import Navbar from './Components/Navbar';
import AdminAppointments from './Pages/admin/appointments/AppointmentList';
import UserAppointments from './Pages/user/appointments/AppointmentRequestForm';
import Dashboard from './Pages/admin/dashboard/Dashboard';
import Layout from './Components/Layout';
import UserLayout from './Components/UserLayout';
import Support from './Pages/admin/support/Support';
import UserSupportForm from './Pages/user/support/UserSupportForm';
import UserSupportList from './Pages/user/support/UserSupportList';

import User from './Pages/user/dashboard/UserDashboard';
import UserRecords from './Pages/user/records/UserRecords';

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
