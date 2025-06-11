// src/Dashboard.js

import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Dashboard</h1>
        <p className="text-center text-lg text-gray-700">
          Welcome to your dashboard! This is where you can access various features related to your account. 
          <br />
          (This is a placeholder page. You can implement the actual functionality later.)
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
