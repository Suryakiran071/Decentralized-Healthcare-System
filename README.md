# MedEase - Decentralized Healthcare System

A decentralized healthcare management system built with React, Firebase, and Ethereum smart contracts. This application provides secure, blockchain-based management of healthcare records and appointments.

## Features

### For Patients (Users)
- **Secure Authentication**: Firebase-based email/password and Google authentication
- **Book Appointments**: Schedule appointments with healthcare providers on the blockchain
- **View Medical Records**: Access personal medical records stored securely on the blockchain
- **Support System**: Submit and track support tickets

### For Healthcare Providers (Admins)
- **Appointment Management**: Approve or decline patient appointments via smart contract
- **Medical Records**: Add and manage patient medical records on the blockchain
- **Provider Authorization**: Contract owners can authorize new healthcare providers
- **Support Management**: Handle patient support requests

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: Firebase Auth
- **Blockchain**: Ethereum, Ethers.js
- **Smart Contract**: Solidity (deployed at `0x42f7504cc356348eb69864b39f56ccffe9653672`)
- **Routing**: React Router DOM
- **Icons**: React Icons

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension installed
3. **Ethereum wallet** with some ETH for gas fees (on the network where the contract is deployed)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Decentralized-Healthcare-System
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
The `.env` file is already configured with the contract address:
```
REACT_APP_CONTRACT_ADDRESS=0x42f7504cc356348eb69864b39f56ccffe9653672
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## User Roles and Access

### Admin Users
Admin users have access to the full dashboard with the following capabilities:
- Manage all appointments
- Add medical records
- Authorize healthcare providers
- Handle support tickets

**Admin Emails** (configured in the application):
- `admin@medease.com`
- `healthcare@medease.com`
- `provider@medease.com`

### Regular Users (Patients)
Regular users have access to patient-specific features:
- Book new appointments
- View their medical records
- Submit support tickets

## Smart Contract Integration

The application integrates with a deployed Ethereum smart contract that handles:

### Contract Functions
- `bookAppointment(patientID, doctor)`: Book a new appointment
- `approveAppointment(appointmentID)`: Approve an appointment (providers only)
- `declineAppointment(appointmentID)`: Decline an appointment (providers only)
- `addRecord(patientID, patientName, diagnosis, treatment)`: Add medical record (providers only)
- `getPatientRecords(patientID)`: Retrieve patient records (providers only)
- `authorizeProvider(providerAddress)`: Authorize new provider (owner only)

### Contract Address
`0x42f7504cc356348eb69864b39f56ccffe9653672`

## Usage Instructions

### For New Users

1. **Sign Up**: Create an account using email/password or Google authentication
2. **Connect Wallet**: Connect your MetaMask wallet to interact with blockchain features
3. **Role Assignment**: Your role (Admin/Patient) is determined by your email address

### For Patients

1. **Dashboard**: Access overview of your account and quick actions
2. **Book Appointment**: 
   - Navigate to "Book Appointment"
   - Connect your wallet if not already connected
   - Fill in appointment details including doctor name
   - Submit to record on blockchain
3. **View Records**: 
   - Go to "My Records"
   - Enter your Patient ID (auto-generated from your account)
   - View medical records stored on blockchain
4. **Support**: Submit support tickets for any issues

### For Healthcare Providers (Admins)

1. **Dashboard**: Overview of system activity and notifications
2. **Manage Appointments**:
   - View all pending appointments
   - Approve or decline appointments (requires wallet connection)
   - Actions are recorded on blockchain
3. **Healthcare Management**:
   - Authorize new healthcare providers (contract owner only)
   - Add medical records for patients
   - Retrieve patient records
4. **Support**: Manage patient support tickets

## Wallet Connection

To use blockchain features:

1. Install MetaMask browser extension
2. Create or import an Ethereum wallet
3. Ensure you have ETH for gas fees
4. Click "Connect Wallet" in the application
5. Approve the connection in MetaMask

## Security Features

- **Firebase Authentication**: Secure user authentication and authorization
- **Role-based Access Control**: Different interfaces for admins and patients
- **Blockchain Security**: Immutable records and transparent appointment management
- **Smart Contract Authorization**: Only authorized providers can access certain functions

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks for blockchain interaction
├── pages/              # Page components
└── assets/             # Static assets
```

### Key Files
- `src/hooks/useContract.js`: Main blockchain interaction hook
- `src/hooks/useAppointments.js`: Appointment management hook
- `src/hooks/useHealthcareRecords.js`: Medical records management hook
- `src/contexts/AuthContext.js`: Authentication context provider

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Troubleshooting

### Common Issues

1. **MetaMask Not Detected**
   - Ensure MetaMask extension is installed and enabled
   - Refresh the page after installing MetaMask

2. **Transaction Failures**
   - Check if you have sufficient ETH for gas fees
   - Ensure you're connected to the correct network
   - Verify you're authorized for the action (for provider functions)

3. **Authentication Issues**
   - Clear browser cache and cookies
   - Try signing out and signing back in
   - Check Firebase configuration

4. **Role Access Issues**
   - Admin access is restricted to specific email addresses
   - Contact system administrator to add your email to admin list

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For technical support or questions about the application, please use the built-in support system or contact the development team.
