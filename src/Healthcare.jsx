import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Healthcare = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [providerAddress, setProviderAddress] = useState("");

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
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

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        const contract = new ethers.Contract(contractAddress, contractABI);
        setContract(contract);

        const ownerAddress = await contract.getOwner();
        setIsOwner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());
      } catch (error) {
        console.error("Error connecting to Wallet: ", error);
      }
    };
    connectWallet();
  }, []);

  const authorizeProvider = async () => {
    try {
      const tx = await contract.authorizeProvider(providerAddress);
      await tx.wait();
    } catch (error) {
      console.error("Only contract owner can authorize different providers", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Healthcare Application</h1>

      {account && (
        <p className="text-lg text-center mb-4">
          Connected Account: <span className="font-semibold">{account}</span>
        </p>
      )}

      {isOwner && (
        <p className="text-lg text-center mb-4 text-green-600">
          You are the contract Owner
        </p>
      )}

      <div className="form-section bg-gray-100 p-6 rounded-md shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-4">Authorize Healthcare Provider</h2>
        <input
          type="text"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Provider Address"
          value={providerAddress}
          onChange={(e) => setProviderAddress(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={authorizeProvider}
        >
          Authorize Provider
        </button>
      </div>
    </div>
  );
};

export default Healthcare;
