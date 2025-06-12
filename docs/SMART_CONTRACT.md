# Smart Contract Documentation

## HealthcareRecords Contract

**Contract Address**: `0x42f7504cc356348eb69864b39f56ccffe9653672`

This document describes the Solidity smart contract that powers the MedEase healthcare system.

## Contract Overview

The HealthcareRecords contract manages patient medical records and appointments on the Ethereum blockchain. It implements role-based access control to ensure only authorized healthcare providers can access sensitive medical data.

## Data Structures

### Record Struct
```solidity
struct Record {
    uint256 recordID;
    string patientName;
    string diagnosis;
    string treatment;
    uint256 timestamp;
}
```

### Appointment Struct
```solidity
struct Appointment {
    uint256 appointmentID;
    uint256 patientID;
    uint256 timestamp;
    string doctor;
    string status; // "pending", "approved", "declined"
}
```

## State Variables

- `address owner`: Contract owner (deployer)
- `mapping(uint256 => Record[]) private patientRecords`: Patient ID to their medical records
- `mapping(address => bool) private authorizedProviders`: Authorized healthcare providers
- `mapping(uint256 => Appointment) private appointments`: Appointment ID to appointment details
- `uint256 private appointmentCounter`: Counter for generating appointment IDs

## Modifiers

### onlyOwner
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can perform this function");
    _;
}
```
Restricts function access to the contract owner only.

### onlyAuthorizedProvider
```solidity
modifier onlyAuthorizedProvider() {
    require(authorizedProviders[msg.sender], "Not an authorized provider");
    _;
}
```
Restricts function access to authorized healthcare providers only.

## Functions

### Public View Functions

#### getOwner()
```solidity
function getOwner() public view returns (address)
```
Returns the address of the contract owner.

#### getAppointmentStatus(uint256 appointmentID)
```solidity
function getAppointmentStatus(uint256 appointmentID) public view returns (string memory)
```
Returns the status of a specific appointment.
- **Parameters**: `appointmentID` - The ID of the appointment
- **Returns**: Status string ("pending", "approved", or "declined")

### Owner-Only Functions

#### authorizeProvider(address provider)
```solidity
function authorizeProvider(address provider) public onlyOwner
```
Authorizes a healthcare provider to access medical records and manage appointments.
- **Parameters**: `provider` - Wallet address of the healthcare provider
- **Access**: Contract owner only

### Provider-Only Functions

#### addRecord(uint256 patientID, string memory patientName, string memory diagnosis, string memory treatment)
```solidity
function addRecord(uint256 patientID, string memory patientName, string memory diagnosis, string memory treatment) public onlyAuthorizedProvider
```
Adds a new medical record for a patient.
- **Parameters**:
  - `patientID` - Unique identifier for the patient
  - `patientName` - Patient's full name
  - `diagnosis` - Medical diagnosis
  - `treatment` - Prescribed treatment
- **Access**: Authorized providers only

#### getPatientRecords(uint256 patientID)
```solidity
function getPatientRecords(uint256 patientID) public view onlyAuthorizedProvider returns (Record[] memory)
```
Retrieves all medical records for a specific patient.
- **Parameters**: `patientID` - Unique identifier for the patient
- **Returns**: Array of medical records
- **Access**: Authorized providers only

#### approveAppointment(uint256 appointmentID)
```solidity
function approveAppointment(uint256 appointmentID) public onlyAuthorizedProvider
```
Approves a pending appointment.
- **Parameters**: `appointmentID` - The ID of the appointment to approve
- **Access**: Authorized providers only

#### declineAppointment(uint256 appointmentID)
```solidity
function declineAppointment(uint256 appointmentID) public onlyAuthorizedProvider
```
Declines a pending appointment.
- **Parameters**: `appointmentID` - The ID of the appointment to decline
- **Access**: Authorized providers only

### Public Functions

#### bookAppointment(uint256 patientID, string memory doctor)
```solidity
function bookAppointment(uint256 patientID, string memory doctor) public returns (uint256)
```
Books a new appointment for a patient.
- **Parameters**:
  - `patientID` - Unique identifier for the patient
  - `doctor` - Name or specialty of the requested doctor
- **Returns**: The generated appointment ID
- **Access**: Public (any user can book an appointment)

## Usage Examples

### For Contract Owner

1. **Deploy Contract**: The deployer becomes the owner
2. **Authorize Providers**: Call `authorizeProvider()` with provider wallet addresses

### For Healthcare Providers

1. **Get Authorization**: Contact contract owner to be authorized
2. **Add Records**: Use `addRecord()` to store patient medical records
3. **View Records**: Use `getPatientRecords()` to retrieve patient history
4. **Manage Appointments**: Use `approveAppointment()` or `declineAppointment()`

### For Patients

1. **Book Appointments**: Call `bookAppointment()` with patient ID and doctor preference
2. **Check Status**: Use `getAppointmentStatus()` to check appointment status

## Security Considerations

1. **Access Control**: Functions are protected by modifiers ensuring only authorized users can access sensitive data
2. **Data Privacy**: Medical records are private and can only be accessed by authorized providers
3. **Immutability**: Once recorded, medical data cannot be deleted or modified (only new records can be added)
4. **Transparency**: Appointment bookings and status changes are transparent and verifiable

## Gas Considerations

- **addRecord()**: Medium gas cost due to storage operations
- **bookAppointment()**: Low to medium gas cost
- **approveAppointment()/declineAppointment()**: Low gas cost (only status update)
- **getPatientRecords()**: No gas cost (view function)
- **authorizeProvider()**: Low gas cost

## Integration with Frontend

The React frontend integrates with this contract using:
- **ethers.js**: For blockchain interactions
- **MetaMask**: For wallet connection and transaction signing
- **Custom React Hooks**: For managing contract state and operations

## Error Handling

The contract includes proper error messages for common failures:
- "Only owner can perform this function"
- "Not an authorized provider"
- "Appointment does not exist"

## Future Enhancements

Potential improvements to consider:
1. Event emissions for better frontend integration
2. Patient consent mechanisms
3. Record versioning and updates
4. Multi-signature requirements for sensitive operations
5. Integration with IPFS for large medical files
