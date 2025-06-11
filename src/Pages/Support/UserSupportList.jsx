// src/Pages/support/UserSupportList.js

import React, { useState, useEffect } from 'react';

const UserSupportList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder: Fetch user's tickets
  useEffect(() => {
    // Here you can fetch data from your backend or blockchain (in case you're using blockchain to store tickets)
    const fetchedTickets = [
      {
        id: 1,
        issue: 'Login issue',
        description: 'Unable to log in with my account.',
        status: 'Pending',
      },
      {
        id: 2,
        issue: 'Appointment scheduling',
        description: 'The appointment I scheduled is not showing up.',
        status: 'Resolved',
      },
    ];
    setTickets(fetchedTickets);
    setLoading(false);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Your Support Tickets</h2>

      {loading ? (
        <p className="text-center">Loading your tickets...</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="mb-4 p-4 border rounded-md border-gray-300">
            <p><strong>Issue:</strong> {ticket.issue}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Status:</strong> 
              <span className={ticket.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'}>
                {ticket.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserSupportList;
