// src/hooks/useContract.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x2101a334eaec9578db0bf3434e2d168681318cfb";

const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "diagnosis",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "treatment",
				"type": "string"
			}
		],
		"name": "addRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "appointmentID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctor",
				"type": "address"
			}
		],
		"name": "AppointmentBooked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "appointmentID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum HealthcareRecords.AppointmentStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"name": "AppointmentStatusChanged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "approveAppointment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			}
		],
		"name": "authorizeProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "doctor",
				"type": "address"
			}
		],
		"name": "bookAppointment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "declineAppointment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "PatientRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			}
		],
		"name": "ProviderAuthorized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			}
		],
		"name": "ProviderRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "recordID",
				"type": "uint256"
			}
		],
		"name": "RecordAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "registerPatient",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			}
		],
		"name": "revokeProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "addressToPatientID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "authorizedProviders",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getAppointment",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "appointmentID",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "patientID",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "doctor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "enum HealthcareRecords.AppointmentStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct HealthcareRecords.Appointment",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			}
		],
		"name": "getPatientAppointmentIDs",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			}
		],
		"name": "getPatientAppointments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "appointmentID",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "patientID",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "doctor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "enum HealthcareRecords.AppointmentStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct HealthcareRecords.Appointment[]",
				"name": "result",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			}
		],
		"name": "getPatientRecords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "recordID",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "diagnosis",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "treatment",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct HealthcareRecords.Record[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patients",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "patientID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalAppointments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPatients",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const useContract = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const connectWallet = async () => {
    try {
      setLoading(true);
      console.log('Starting wallet connection...');
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      console.log('MetaMask detected, requesting accounts...');
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      
      const signer = web3Provider.getSigner();
      const accountAddress = await signer.getAddress();
      console.log('Connected account:', accountAddress);
        console.log('Creating contract instance with address:', CONTRACT_ADDRESS);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Check if user is the owner (with error handling)
      let isContractOwner = false;
      try {
        console.log('Checking contract owner...');
        const ownerAddress = await contractInstance.owner();
        console.log('Contract owner:', ownerAddress);
        isContractOwner = accountAddress.toLowerCase() === ownerAddress.toLowerCase();
        console.log('Is user the owner?', isContractOwner);
      } catch (ownerError) {
        console.warn('Could not check contract owner (contract may not be deployed):', ownerError.message);
        console.log('Proceeding without owner check...');
      }      setProvider(web3Provider);
      setSigner(signer);
      setContract(contractInstance);
      setAccount(accountAddress);
      setIsOwner(isContractOwner);
      setIsConnected(true);
      
      console.log('Wallet connection successful!');
      console.log('Account:', accountAddress);
      console.log('Is connected:', true);
      console.log('Is owner:', isContractOwner);} catch (error) {
      console.error('Error connecting wallet:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        data: error.data
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setIsOwner(false);
    setIsConnected(false);
  };

  useEffect(() => {    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          console.log('Checking existing wallet connection...');
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          console.log('Existing accounts:', accounts);
          if (accounts.length > 0) {
            console.log('Found existing connection, attempting to connect...');
            await connectWallet();
          } else {
            console.log('No existing accounts found');
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      } else {
        console.log('MetaMask not detected');
      }
    };
    
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    provider,
    signer,
    contract,
    account,
    isOwner,
    isConnected,
    loading,
    connectWallet,
    disconnectWallet
  };
};
