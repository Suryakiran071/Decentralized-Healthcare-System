# MedEase - UML Use Case Diagram

## System: Decentralized Healthcare Management System (MedEase)

### Actors:
- **Patient** (Primary Actor)
- **Healthcare Provider** (Primary Actor)
- **System Administrator** (Primary Actor)
- **MetaMask Wallet** (External System)
- **Firebase Authentication** (External System)
- **Ethereum Blockchain** (External System)

---

## Use Case Diagram (PlantUML Format)

```plantuml
@startuml MedEase_UseCase_Diagram

!define RECTANGLE class

title MedEase - Decentralized Healthcare Management System\nUse Case Diagram

left to right direction

' Actors
actor "Patient" as Patient
actor "Healthcare Provider" as Provider
actor "System Administrator" as Admin
actor "MetaMask Wallet" as MetaMask
actor "Firebase Auth" as Firebase
actor "Ethereum Blockchain" as Blockchain

' System Boundary
rectangle "MedEase System" {
  
  ' Authentication Use Cases
  usecase "Login to System" as UC1
  usecase "Signup for Account" as UC2
  usecase "Logout from System" as UC3
  usecase "Connect Wallet" as UC4
  usecase "Disconnect Wallet" as UC5
  
  ' Patient Use Cases
  usecase "Register as Patient" as UC6
  usecase "Book Appointment" as UC7
  usecase "View Personal Medical Records" as UC8
  usecase "View Appointment History" as UC9
  usecase "Submit Support Request" as UC10
  usecase "Track Appointment Status" as UC11
  usecase "View Calendar" as UC12
  
  ' Healthcare Provider Use Cases
  usecase "Approve Appointment" as UC13
  usecase "Decline Appointment" as UC14
  usecase "Add Medical Record" as UC15
  usecase "View Patient Records" as UC16
  usecase "Manage Patient Appointments" as UC17
  usecase "View Provider Dashboard" as UC18
  
  ' Admin Use Cases
  usecase "Authorize Healthcare Provider" as UC19
  usecase "Revoke Provider Access" as UC20
  usecase "Manage System Users" as UC21
  usecase "View System Analytics" as UC22
  usecase "Handle Support Tickets" as UC23
  
  ' Blockchain Operations
  usecase "Store Medical Record on Blockchain" as UC24
  usecase "Retrieve Patient Data from Blockchain" as UC25
  usecase "Process Appointment Transaction" as UC26
  usecase "Verify Provider Authorization" as UC27
  usecase "Generate Patient ID" as UC28
  
  ' System Operations
  usecase "Authenticate User Role" as UC29
  usecase "Validate Wallet Connection" as UC30
  usecase "Process Smart Contract Transaction" as UC31
  usecase "Update Real-time Calendar" as UC32
  usecase "Send Notifications" as UC33
}

' Patient Relationships
Patient --> UC1 : performs
Patient --> UC2 : performs
Patient --> UC3 : performs
Patient --> UC4 : performs
Patient --> UC5 : performs
Patient --> UC6 : performs
Patient --> UC7 : performs
Patient --> UC8 : performs
Patient --> UC9 : performs
Patient --> UC10 : performs
Patient --> UC11 : performs
Patient --> UC12 : performs

' Healthcare Provider Relationships
Provider --> UC1 : performs
Provider --> UC2 : performs
Provider --> UC3 : performs
Provider --> UC4 : performs
Provider --> UC5 : performs
Provider --> UC13 : performs
Provider --> UC14 : performs
Provider --> UC15 : performs
Provider --> UC16 : performs
Provider --> UC17 : performs
Provider --> UC18 : performs
Provider --> UC12 : performs

' Admin Relationships
Admin --> UC1 : performs
Admin --> UC3 : performs
Admin --> UC19 : performs
Admin --> UC20 : performs
Admin --> UC21 : performs
Admin --> UC22 : performs
Admin --> UC23 : performs
Admin --> UC18 : accesses

' External System Relationships
UC1 --> Firebase : <<uses>>
UC2 --> Firebase : <<uses>>
UC29 --> Firebase : <<uses>>

UC4 --> MetaMask : <<uses>>
UC5 --> MetaMask : <<uses>>
UC30 --> MetaMask : <<uses>>
UC31 --> MetaMask : <<uses>>

UC24 --> Blockchain : <<uses>>
UC25 --> Blockchain : <<uses>>
UC26 --> Blockchain : <<uses>>
UC27 --> Blockchain : <<uses>>
UC28 --> Blockchain : <<uses>>
UC31 --> Blockchain : <<uses>>

' Include Relationships
UC7 ..> UC4 : <<include>>
UC7 ..> UC6 : <<include>>
UC7 ..> UC26 : <<include>>

UC15 ..> UC27 : <<include>>
UC15 ..> UC24 : <<include>>

UC13 ..> UC27 : <<include>>
UC13 ..> UC26 : <<include>>

UC14 ..> UC27 : <<include>>
UC14 ..> UC26 : <<include>>

UC8 ..> UC25 : <<include>>
UC16 ..> UC25 : <<include>>
UC16 ..> UC27 : <<include>>

UC19 ..> UC31 : <<include>>
UC20 ..> UC31 : <<include>>

UC1 ..> UC29 : <<include>>

' Extend Relationships
UC32 ..> UC7 : <<extend>>
UC32 ..> UC13 : <<extend>>
UC32 ..> UC14 : <<extend>>

UC33 ..> UC7 : <<extend>>
UC33 ..> UC13 : <<extend>>
UC33 ..> UC14 : <<extend>>

@enduml
```

---

## Detailed Use Case Descriptions

### Authentication & Access Control

**UC1 - Login to System**
- **Actor:** Patient, Healthcare Provider, System Administrator
- **Description:** User authenticates using email/password or Google OAuth
- **Preconditions:** User has valid account credentials
- **Flow:** User enters credentials → Firebase validates → Role determined → Dashboard accessed
- **Postconditions:** User is authenticated and redirected to role-specific dashboard

**UC4 - Connect Wallet**
- **Actor:** Patient, Healthcare Provider
- **Description:** User connects MetaMask wallet for blockchain operations
- **Preconditions:** MetaMask installed, user authenticated
- **Flow:** User clicks connect → MetaMask prompts → Wallet connected → Smart contract access enabled
- **Postconditions:** Wallet connected, blockchain operations available

### Patient Operations

**UC7 - Book Appointment**
- **Actor:** Patient
- **Description:** Patient schedules appointment with healthcare provider
- **Preconditions:** Patient registered, wallet connected
- **Flow:** Patient fills form → Wallet transaction → Smart contract records → Provider notified
- **Postconditions:** Appointment stored on blockchain, pending provider approval

**UC8 - View Personal Medical Records**
- **Actor:** Patient
- **Description:** Patient accesses their medical history from blockchain
- **Preconditions:** Patient authenticated, wallet connected
- **Flow:** Patient requests records → Smart contract queries → Records retrieved → Displayed
- **Postconditions:** Patient views complete medical history

### Healthcare Provider Operations

**UC13 - Approve Appointment**
- **Actor:** Healthcare Provider
- **Description:** Provider approves pending patient appointment
- **Preconditions:** Provider authorized, appointment exists, wallet connected
- **Flow:** Provider reviews → Clicks approve → Wallet transaction → Smart contract updates → Patient notified
- **Postconditions:** Appointment approved, status updated on blockchain

**UC15 - Add Medical Record**
- **Actor:** Healthcare Provider
- **Description:** Provider adds new medical record for patient
- **Preconditions:** Provider authorized, patient exists, wallet connected
- **Flow:** Provider enters diagnosis/treatment → Wallet transaction → Smart contract stores → Record immutable
- **Postconditions:** Medical record permanently stored on blockchain

### Administrative Operations

**UC19 - Authorize Healthcare Provider**
- **Actor:** System Administrator
- **Description:** Admin grants provider access to system
- **Preconditions:** Admin is contract owner, provider wallet address known
- **Flow:** Admin enters provider address → Smart contract transaction → Provider authorized
- **Postconditions:** Provider can access patient data and perform medical operations

### Blockchain Operations

**UC24 - Store Medical Record on Blockchain**
- **Actor:** System (triggered by UC15)
- **Description:** Medical record data is permanently stored on Ethereum
- **Preconditions:** Valid medical record data, authorized provider
- **Flow:** Smart contract validates → Data stored → Event emitted → Frontend updated
- **Postconditions:** Immutable medical record created with timestamp

**UC26 - Process Appointment Transaction**
- **Actor:** System (triggered by UC7, UC13, UC14)
- **Description:** Appointment data processed through smart contract
- **Preconditions:** Valid appointment data, sufficient gas fees
- **Flow:** Transaction submitted → Blockchain validates → State updated → Event emitted
- **Postconditions:** Appointment status updated on blockchain

---

## Use Case Relationships

### Include Relationships:
- **Book Appointment** includes **Connect Wallet**, **Register as Patient**, **Process Appointment Transaction**
- **Add Medical Record** includes **Verify Provider Authorization**, **Store Medical Record on Blockchain**
- **View Patient Records** includes **Retrieve Patient Data from Blockchain**, **Verify Provider Authorization**

### Extend Relationships:
- **Update Real-time Calendar** extends appointment-related use cases
- **Send Notifications** extends appointment status changes

### Dependencies:
- All blockchain operations depend on **MetaMask Wallet** connectivity
- Authentication operations depend on **Firebase Authentication**
- Medical data operations depend on **Ethereum Blockchain**

---

## Notes:
1. This diagram represents the core functionality of the MedEase system
2. All medical data operations require blockchain connectivity
3. Role-based access control is enforced throughout the system
4. External systems (Firebase, MetaMask, Ethereum) are essential for system operation
5. The system ensures patient data ownership through blockchain technology
