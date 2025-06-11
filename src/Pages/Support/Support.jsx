// src/Pages/support/Support.js

import React, { useState, useEffect } from 'react';

const Support = () => {
  // Sample data for tickets
  const [tickets, setTickets] = useState([
    {
      id: 1,
      patient: 'John Doe',
      issue: 'Appointment not confirmed',
      status: 'Pending',
      description: 'Patient is unable to confirm their appointment.',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      issue: 'Healthcare provider authorization',
      status: 'In Progress',
      description: 'Patient waiting for healthcare provider authorization.',
    },
    {
      id: 3,
      patient: 'Mark Lee',
      issue: 'Billing Issue',
      status: 'Resolved',
      description: 'Patient reported an issue with the billing amount.',
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleResolve = (id) => {
    setTickets(tickets.map(ticket =>
      ticket.id === id ? { ...ticket, status: 'Resolved' } : ticket
    ));
    setSelectedTicket(null); // Close the ticket details
  };

  const handleAddComment = () => {
    // Here we would typically update the ticket with the new comment in the database or state
    if (selectedTicket) {
      selectedTicket.comments.push(newComment);
      setNewComment(''); // Reset comment field
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Support Tickets</h2>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 bg-gray-100 rounded-md border border-gray-300 cursor-pointer"
            onClick={() => handleTicketClick(ticket)}
          >
            <p className="font-semibold">{ticket.patient}</p>
            <p>{ticket.issue}</p>
            <p className={`text-sm ${ticket.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'}`}>
              {ticket.status}
            </p>
          </div>
        ))}
      </div>

      {/* Ticket Details Section */}
      {selectedTicket && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Ticket Details</h3>
          <p><strong>Issue:</strong> {selectedTicket.issue}</p>
          <p><strong>Description:</strong> {selectedTicket.description}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>

          {/* Ticket Comments Section */}
          <div className="mt-4">
            <h4 className="font-semibold">Comments</h4>
            <ul className="space-y-2">
              {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                selectedTicket.comments.map((comment, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{comment}</li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </ul>
          </div>

          {/* Add Comment Section */}
          <textarea
            className="w-full mt-4 p-2 border border-gray-300 rounded-md"
            rows="4"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          ></textarea>
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Comment
          </button>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => handleResolve(selectedTicket.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Resolve
            </button>
            <button
              onClick={() => setSelectedTicket(null)} // Close ticket details
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
