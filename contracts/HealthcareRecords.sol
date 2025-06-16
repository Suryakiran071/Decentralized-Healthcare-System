// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title HealthcareRecords – minimal EHR + appointment registry
/// @author 2025
/// @notice Stores patient records and manages appointment flow
contract HealthcareRecords {
    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    address public owner;

    enum AppointmentStatus {
        Pending,
        Approved,
        Declined
    }

    struct Patient {
        uint256 patientID;
        string  name;
        address wallet;        // patient's externally-owned account
    }

    struct Record {
        uint256 recordID;
        string  diagnosis;
        string  treatment;
        uint256 timestamp;
    }

    struct Appointment {
        uint256 appointmentID;
        uint256 patientID;
        address doctor;        // provider's address
        uint256 appointmentTimestamp;    // ACTUAL appointment date/time selected by user
        uint256 bookingTimestamp;        // when the appointment was booked on blockchain
        string  reason;                  // reason for appointment
        AppointmentStatus status;
    }

    // identity & access -------------------------------------------------------
    mapping(address => bool)           public authorizedProviders;
    mapping(uint256 => Patient)        public patients;              // patientID → Patient
    mapping(address => uint256)        public addressToPatientID;    // wallet  → patientID
    uint256 private patientCounter;

    // medical data ------------------------------------------------------------
    mapping(uint256 => Record[])       private patientRecords;       // patientID → records

    // appointments ------------------------------------------------------------
    mapping(uint256 => Appointment)    private appointments;         // appointmentID → Appointment
    mapping(uint256 => uint256[])      private patientAppointments;  // patientID     → [appointmentID]
    uint256 private appointmentCounter;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event ProviderAuthorized(address indexed provider);
    event ProviderRevoked    (address indexed provider);

    event PatientRegistered  (uint256 indexed patientID, address indexed wallet, string name);
    event RecordAdded        (uint256 indexed patientID, uint256 indexed recordID);

    event AppointmentBooked  (
        uint256 indexed appointmentID, 
        uint256 indexed patientID, 
        address indexed doctor,
        uint256 appointmentTimestamp,
        string reason
    );
    event AppointmentStatusChanged(uint256 indexed appointmentID, AppointmentStatus status);

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner only");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Provider only");
        _;
    }

    modifier onlyPatient(uint256 patientID) {
        require(patients[patientID].wallet == msg.sender, "Patient only");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                      ADMIN / ACCESS-CONTROL LOGIC
    //////////////////////////////////////////////////////////////*/

    function authorizeProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    function revokeProvider(address provider) external onlyOwner {
        require(authorizedProviders[provider], "Not authorized");
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider);
    }

    /*//////////////////////////////////////////////////////////////
                         PATIENT REGISTRATION
    //////////////////////////////////////////////////////////////*/

    function registerPatient(string calldata name) external returns (uint256) {
        require(addressToPatientID[msg.sender] == 0, "Already registered");

        patientCounter++;
        uint256 id = patientCounter;

        patients[id] = Patient(id, name, msg.sender);
        addressToPatientID[msg.sender] = id;

        emit PatientRegistered(id, msg.sender, name);
        return id;
    }

    /*//////////////////////////////////////////////////////////////
                         MEDICAL RECORDS
    //////////////////////////////////////////////////////////////*/

    function addRecord(
        uint256 patientID,
        string calldata diagnosis,
        string calldata treatment
    ) external onlyAuthorizedProvider
    {
        require(patients[patientID].wallet != address(0), "Unknown patient");

        uint256 recordID = patientRecords[patientID].length + 1;
        patientRecords[patientID].push(
            Record(recordID, diagnosis, treatment, block.timestamp)
        );

        emit RecordAdded(patientID, recordID);
    }

    /// @notice Patient or any authorized provider can view records
    function getPatientRecords(
        uint256 patientID
    ) external view returns (Record[] memory) {
        require(
            msg.sender == patients[patientID].wallet || authorizedProviders[msg.sender],
            "No permission"
        );
        return patientRecords[patientID];
    }

    /*//////////////////////////////////////////////////////////////
                         APPOINTMENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Book appointment with specific date/time
    /// @param patientID The patient's ID
    /// @param doctor The doctor's address
    /// @param appointmentTimestamp Unix timestamp of the actual appointment date/time
    /// @param reason Reason for the appointment
    function bookAppointment(
        uint256 patientID,
        address doctor,
        uint256 appointmentTimestamp,
        string calldata reason
    ) external onlyPatient(patientID) returns (uint256)
    {
        require(authorizedProviders[doctor], "Doctor not authorized");
        require(appointmentTimestamp > block.timestamp, "Appointment must be in the future");
        require(bytes(reason).length > 0, "Reason is required");

        appointmentCounter++;
        uint256 id = appointmentCounter;

        appointments[id] = Appointment({
            appointmentID         : id,
            patientID            : patientID,
            doctor               : doctor,
            appointmentTimestamp : appointmentTimestamp,
            bookingTimestamp     : block.timestamp,
            reason               : reason,
            status               : AppointmentStatus.Pending
        });

        patientAppointments[patientID].push(id);
        emit AppointmentBooked(id, patientID, doctor, appointmentTimestamp, reason);
        return id;
    }

    /// @notice Provider who is the doctor, or contract owner, may approve / decline
    function approveAppointment(uint256 id) external {
        _setAppointmentStatus(id, AppointmentStatus.Approved);
    }

    function declineAppointment(uint256 id) external {
        _setAppointmentStatus(id, AppointmentStatus.Declined);
    }

    function _setAppointmentStatus(uint256 id, AppointmentStatus newStatus) private {
        Appointment storage appt = appointments[id];
        require(appt.doctor != address(0), "Unknown appointment");

        // Only the assigned doctor OR the owner may change status
        require(
            msg.sender == appt.doctor || msg.sender == owner,
            "Not allowed"
        );

        appt.status = newStatus;
        emit AppointmentStatusChanged(id, newStatus);
    }

    /*//////////////////////////////////////////////////////////////
                         READ-ONLY HELPERS
    //////////////////////////////////////////////////////////////*/

    function getAppointment(uint256 id) external view returns (Appointment memory) {
        require(appointments[id].doctor != address(0), "Unknown appointment");
        return appointments[id];
    }

    function getPatientAppointmentIDs(
        uint256 patientID
    ) external view returns (uint256[] memory) {
        return patientAppointments[patientID];
    }

    function getPatientAppointments(
        uint256 patientID
    ) external view returns (Appointment[] memory result) {
        uint256[] storage ids = patientAppointments[patientID];
        result = new Appointment[](ids.length);
        for (uint256 i; i < ids.length; ++i) {
            result[i] = appointments[ids[i]];
        }
    }

    /// @notice Get all appointments (for admin dashboard)
    function getAllAppointments() external view returns (Appointment[] memory result) {
        result = new Appointment[](appointmentCounter);
        for (uint256 i = 1; i <= appointmentCounter; i++) {
            result[i-1] = appointments[i];
        }
    }

    function totalPatients() external view returns (uint256) {
        return patientCounter;
    }

    function totalAppointments() external view returns (uint256) {
        return appointmentCounter;
    }
}
