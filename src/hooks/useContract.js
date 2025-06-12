// src/hooks/useContract.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x42f7504cc356348eb69864b39f56ccffe9653672";

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
        "name": "patientName",
        "type": "string"
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "appointmentID",
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
        "internalType": "string",
        "name": "doctor",
        "type": "string"
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
        "name": "appointmentID",
        "type": "uint256"
      }
    ],
    "name": "declineAppointment",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "appointmentID",
        "type": "uint256"
      }
    ],
    "name": "getAppointmentStatus",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
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
            "name": "patientName",
            "type": "string"
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
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      
      const signer = web3Provider.getSigner();
      const accountAddress = await signer.getAddress();
      
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Check if user is the owner
      const ownerAddress = await contractInstance.getOwner();
      const isContractOwner = accountAddress.toLowerCase() === ownerAddress.toLowerCase();

      setProvider(web3Provider);
      setSigner(signer);
      setContract(contractInstance);
      setAccount(accountAddress);
      setIsOwner(isContractOwner);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
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

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
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
