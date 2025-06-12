# Quick Setup Guide

## For First Time Users

### Step 1: Install Prerequisites
1. Install [MetaMask](https://metamask.io/) browser extension
2. Create or import an Ethereum wallet
3. Ensure you have some ETH for gas fees

### Step 2: Access the Application
1. Open http://localhost:5173 in your browser
2. Click "Sign Up" if you're a new user, or "Login" if you have an account

### Step 3: Create Account
**For Regular Users (Patients):**
- Use any email address except the admin ones listed below
- Choose email/password or Google authentication

**For Admin Users (Healthcare Providers):**
- Use one of these admin emails:
  - `admin@medease.com`
  - `healthcare@medease.com`  
  - `provider@medease.com`

## Quick Test Scenarios

### Scenario 1: Patient Journey
1. **Sign up** with email: `patient@test.com`
2. **Login** → Redirected to User Dashboard
3. **Connect Wallet** → Click "Connect Wallet" in any blockchain feature
4. **Book Appointment** → Go to "Book Appointment", fill details, submit
5. **View Records** → Go to "My Records", enter Patient ID (auto-generated)

### Scenario 2: Healthcare Provider Journey
1. **Sign up/Login** with email: `admin@medease.com`
2. **Login** → Redirected to Admin Dashboard
3. **Connect Wallet** → Required for blockchain operations
4. **Manage Appointments** → View and approve/decline patient appointments
5. **Add Medical Records** → Go to Healthcare section, add patient records
6. **Authorize Provider** → (Owner only) Add new provider wallet addresses

### Scenario 3: Testing Blockchain Integration
1. **Install MetaMask** and create a wallet
2. **Get Test ETH** (if using testnet)
3. **Connect Wallet** in the application
4. **Book Appointment** as patient
5. **Approve Appointment** as admin
6. **Add Medical Record** as admin
7. **View Records** as patient

## Admin Email Addresses

These emails have admin privileges:
- `admin@medease.com`
- `healthcare@medease.com`
- `provider@medease.com`

## Common Operations

### For Patients:
- **Patient ID**: Auto-generated from your user account
- **Booking**: Requires wallet connection
- **Records**: View only, added by healthcare providers

### For Admins:
- **Authorization**: Only contract owner can authorize new providers
- **Records**: Can add and view all patient records
- **Appointments**: Can approve/decline all appointments

## Troubleshooting

### MetaMask Issues:
- Refresh page after installing MetaMask
- Check if you're on the correct network
- Ensure you have ETH for gas fees

### Authentication Issues:
- Clear browser cache
- Try incognito/private browsing mode
- Check internet connection

### Role Issues:
- Admin access is email-based
- Use exact admin email addresses listed above
- Contact system admin to add new admin emails

## Test Data

### Sample Patient Information:
- Name: "John Doe"
- Email: "patient@test.com"
- Doctor: "Dr. Smith"
- Reason: "Annual checkup"

### Sample Medical Record:
- Patient ID: 123456
- Patient Name: "John Doe"
- Diagnosis: "Hypertension"
- Treatment: "Medication and lifestyle changes"

## Next Steps

After testing:
1. Customize admin email list in `src/contexts/AuthContext.js`
2. Deploy to your preferred Ethereum network
3. Update contract address in `.env` file
4. Configure Firebase for production
5. Deploy frontend to hosting service

## Support

For issues or questions:
1. Check the main README.md file
2. Review the Smart Contract documentation
3. Use the built-in support system in the app
4. Contact the development team
