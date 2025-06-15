# 🎯 FRONTEND INTEGRATION GUIDE - NEW SMART CONTRACT

## ✅ COMPLETED BACKEND INTEGRATION

### 1. **Updated Contract Integration**
- ✅ Updated `useContract.js` with new smart contract ABI
- ✅ Fixed `owner()` method call
- ✅ Created `usePatient.js` hook for patient management
- ✅ Created `useProvider.js` hook for provider authorization
- ✅ Updated `useAppointments.js` to use doctor addresses
- ✅ Updated `useHealthcareRecords.js` to remove patient name requirement

### 2. **New Components Created**
- ✅ `PatientRegistration.jsx` - Patient registration component
- ✅ `DoctorSelector.jsx` - Doctor selection with addresses
- ✅ `ProviderManagement.jsx` - Admin provider management

### 3. **Updated Existing Components**
- ✅ Updated `AppointmentRequestForm.jsx` to use new components
- ✅ Updated `Healthcare.jsx` to include provider management

---

## 🎯 REQUIRED FRONTEND UPDATES

### **1. CRITICAL UPDATES - HIGH PRIORITY**

#### **A. Update Your Doctor Database/Service**
**Location:** You need to create or update your doctor service
```javascript
// src/services/doctorService.js (CREATE THIS FILE)
export const availableDoctors = [
  {
    address: '0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    available: true,
    email: 'sarah.johnson@hospital.com',
    phone: '+1-555-0123'
  },
  {
    address: '0x8ba1f109551bD432803012645Hac136c30C85a1c',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    available: true,
    email: 'michael.chen@hospital.com',
    phone: '+1-555-0124'
  },
  // Add more doctors with their wallet addresses
];

export const getDoctorByAddress = (address) => {
  return availableDoctors.find(doctor => 
    doctor.address.toLowerCase() === address.toLowerCase()
  );
};

export const getAuthorizedDoctors = async () => {
  // Implement logic to check which doctors are authorized on blockchain
  // Use the useProvider hook to verify authorization status
};
```

#### **B. Update User Dashboard to Show Patient Status**
**Location:** `src/Pages/user/dashboard/UserDashboard.jsx`
```jsx
// Add this to the top of your component
import { usePatient } from '../../../hooks/usePatient';
import PatientRegistration from '../../../Components/PatientRegistration';

// In your component:
const { isPatientRegistered, getPatientID, patientData } = usePatient();
const [patientID, setPatientID] = useState(null);
const [registrationStatus, setRegistrationStatus] = useState('checking');

// Add registration check in useEffect
useEffect(() => {
  checkPatientRegistration();
}, [isConnected]);

const checkPatientRegistration = async () => {
  if (isConnected) {
    const registered = await isPatientRegistered();
    if (registered) {
      const id = await getPatientID();
      setPatientID(id);
      setRegistrationStatus('registered');
    } else {
      setRegistrationStatus('not-registered');
    }
  }
};

// Add registration component before appointment booking
{registrationStatus === 'not-registered' && (
  <PatientRegistration onRegistrationComplete={setPatientID} />
)}
```

#### **C. Update Appointment Display Components**
**Location:** `src/Pages/admin/appointments/AppointmentList.jsx`
```jsx
// Add doctor name resolution
import { getDoctorByAddress } from '../../../services/doctorService';

// In your appointment rendering:
const getDoctorName = (address) => {
  const doctor = getDoctorByAddress(address);
  return doctor ? doctor.name : `Doctor (${address.slice(0,6)}...${address.slice(-4)})`;
};

// Update appointment display:
<p><strong>Doctor:</strong> {getDoctorName(appointment.doctor)}</p>
```

### **2. MEDIUM PRIORITY UPDATES**

#### **A. Add Appointment Status Enum Helper**
**Location:** `src/utils/appointmentUtils.js` (CREATE THIS FILE)
```javascript
export const AppointmentStatus = {
  PENDING: 0,
  APPROVED: 1,
  DECLINED: 2
};

export const getStatusText = (status) => {
  switch(status) {
    case AppointmentStatus.PENDING: return 'Pending';
    case AppointmentStatus.APPROVED: return 'Approved';
    case AppointmentStatus.DECLINED: return 'Declined';
    default: return 'Unknown';
  }
};

export const getStatusColor = (status) => {
  switch(status) {
    case AppointmentStatus.PENDING: return 'yellow';
    case AppointmentStatus.APPROVED: return 'green';
    case AppointmentStatus.DECLINED: return 'red';
    default: return 'gray';
  }
};
```

#### **B. Update Calendar Component**
**Location:** `src/Components/Calendar.jsx`
```jsx
// Update to handle blockchain appointment data
import { getAppointmentDetails, getPatientAppointments } from '../hooks/useAppointments';
import { getStatusText, getStatusColor } from '../utils/appointmentUtils';

// Add blockchain data fetching for appointments
const fetchBlockchainAppointments = async () => {
  // Implement fetching appointments from blockchain
  // Combine with Firebase data for complete view
};
```

#### **C. Add Patient Records Viewer Component**
**Location:** `src/Pages/user/records/UserRecords.jsx`
```jsx
// Update to use patient ID from registration
import { usePatient } from '../../../hooks/usePatient';
import { useHealthcareRecords } from '../../../hooks/useHealthcareRecords';

const UserRecords = () => {
  const { getPatientID } = usePatient();
  const { getPatientRecords } = useHealthcareRecords();
  
  // Auto-fetch records using patient ID
  useEffect(() => {
    fetchUserRecords();
  }, []);
  
  const fetchUserRecords = async () => {
    const patientID = await getPatientID();
    if (patientID) {
      await getPatientRecords(patientID);
    }
  };
};
```

### **3. ADMIN DASHBOARD UPDATES**

#### **A. Add Provider Status Dashboard**
**Location:** `src/Pages/admin/dashboard/Dashboard.jsx`
```jsx
// Add provider management stats
import { useProvider } from '../../../hooks/useProvider';

// Add stats for authorized providers
const [providerStats, setProviderStats] = useState({
  totalAuthorized: 0,
  recentlyAuthorized: []
});

// Display provider information in dashboard
```

#### **B. Enhanced Healthcare Management**
**Location:** `src/Pages/admin/healthcare/Healthcare.jsx`
```jsx
// The file has already been updated with ProviderManagement component
// Additional features you might want to add:

// 1. Bulk patient record import
// 2. Patient search functionality
// 3. Advanced record filtering
// 4. Export patient data functionality
```

### **4. CONTRACT DEPLOYMENT UPDATES**

#### **A. Update Contract Address**
**Location:** `src/hooks/useContract.js`
```javascript
// UPDATE THIS WITH YOUR NEW DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "YOUR_NEW_CONTRACT_ADDRESS_HERE";
```

#### **B. Environment Configuration**
**Location:** `.env` file (CREATE IF NOT EXISTS)
```env
VITE_CONTRACT_ADDRESS=YOUR_NEW_CONTRACT_ADDRESS_HERE
VITE_CHAIN_ID=1337
VITE_NETWORK_NAME=localhost
```

### **5. TESTING CHECKLIST**

#### **Must Test Before Production:**
- [ ] **Patient Registration:** New users can register and get patient IDs
- [ ] **Doctor Selection:** Appointment booking uses doctor addresses
- [ ] **Provider Authorization:** Only owner can authorize/revoke providers  
- [ ] **Medical Records:** Adding records works without patient name
- [ ] **Appointment Flow:** End-to-end appointment booking and approval
- [ ] **Wallet Integration:** All wallet connection flows work
- [ ] **Error Handling:** Proper error messages for failed transactions

#### **Test Data Needed:**
```javascript
// Test doctor addresses (make sure these are authorized)
const testDoctors = [
  '0x742d35Cc6635C0532925a3b8D5c9B3b5E2E5B9D8',
  '0x8ba1f109551bD432803012645Hac136c30C85a1c',
  '0x9CD8362D2C6C64C7D2E7D4F5E6F7A8B9C0D1E2F3'
];

// Test patient registration flow
// Test appointment booking with authorized doctors
// Test medical record creation
```

---

## 🚀 DEPLOYMENT STEPS

### **1. Deploy New Smart Contract**
```bash
# Deploy the new contract to your network
npx hardhat run scripts/deploy.js --network localhost
# Note the deployed contract address
```

### **2. Update Frontend Configuration**
```bash
# Update contract address in useContract.js
# Test all functionality locally
# Deploy to your hosting platform
```

### **3. Provider Setup**
```bash
# As contract owner, authorize initial healthcare providers
# Add doctor information to your database
# Test complete appointment flow
```

---

## ⚠️ IMPORTANT NOTES

1. **Contract Address:** Update the contract address in `useContract.js` after deployment
2. **Doctor Addresses:** You need real wallet addresses for doctors - they must be authorized before appointments can be booked
3. **Patient Registration:** Users MUST register as patients before booking appointments
4. **Database Migration:** Existing appointment data may need migration to include doctor addresses
5. **Testing:** Thoroughly test the new appointment flow in a development environment first

---

## 💡 RECOMMENDATIONS

1. **Add Doctor Management:** Create an admin interface to manage doctor profiles and addresses
2. **Patient Dashboard:** Show patient ID prominently after registration
3. **Error Messages:** Provide clear instructions when users need to register or connect wallets
4. **Loading States:** Add loading indicators for blockchain transactions
5. **Gas Estimation:** Show estimated gas costs for transactions
6. **Transaction History:** Display transaction hashes and status for user reference

The integration is now complete! Focus on testing the critical flows first, then implement the additional features as needed.
