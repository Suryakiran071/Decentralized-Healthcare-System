// src/components/DoctorSelector.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useProvider } from '../hooks/useProvider';

const DoctorSelector = ({ onDoctorSelect, selectedDoctor }) => {
  const { isAuthorizedProvider } = useProvider();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);  // This would typically come from your backend/database
  // For now, we'll use a hardcoded list that should be replaced with actual data
  const rawDoctors = [
    {
      address: '0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      available: true
    },
    {
      address: '0xD9bc4687f972765cB21f42D69a872c83661e6800',
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      available: true
    },
    {
      address: '0xc6272e8032853d7F12d2caDcb35eD742990D6C61',
      name: 'Dr. Emily Davis',
      specialty: 'Dermatology',
      available: true
    },
    {
      address: '0x4E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F',
      name: 'Dr. James Wilson',
      specialty: 'General Medicine',
      available: true
    }
  ];
  // Checksum all addresses to prevent validation errors
  const availableDoctors = rawDoctors.map(doctor => {
    try {
      return {
        ...doctor,
        address: ethers.utils.getAddress(doctor.address)
      };
    } catch (error) {
      // Invalid address, skip this doctor
      return null;
    }
  }).filter(Boolean);

  useEffect(() => {
    setDoctors(availableDoctors);
  }, []);

  const handleDoctorSelect = (doctor) => {
    onDoctorSelect(doctor);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Healthcare Provider
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.address}
            onClick={() => handleDoctorSelect(doctor)}
            className={`
              p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
              ${selectedDoctor?.address === doctor.address 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {doctor.address.slice(0, 6)}...{doctor.address.slice(-4)}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {doctor.available && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                )}
                
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${selectedDoctor?.address === doctor.address 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedDoctor?.address === doctor.address && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">Selected:</span> {selectedDoctor.name} ({selectedDoctor.specialty})
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;
