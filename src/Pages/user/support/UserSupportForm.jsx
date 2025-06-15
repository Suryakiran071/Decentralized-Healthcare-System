// src/Pages/support/UserSupportForm.js

import React, { useState } from 'react';

const UserSupportForm = () => {
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle ticket submission logic here
    // You can send the data to the backend or save it in the state
    console.log('Support Ticket Submitted:', { issue, description });
    setIssue('');
    setDescription('');
    // Maybe redirect to the user's ticket list page after submitting
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Submit a Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Issue</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter the issue or problem"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Describe the issue in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default UserSupportForm;
