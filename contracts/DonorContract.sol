// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DonorContract {
    
    struct Donor {
        string fullname;
        uint256 age;
        string gender;
        string medicalid;
        string bloodtype;
        string[] organs;
        uint256 weight;
        uint256 height;
        string email;
        string phone;
        bool isActive;
        uint256 registrationTime;
    }
    
    struct Patient {
        string fullname;
        uint256 age;
        string gender;
        string medicalid;
        string bloodtype;
        string requiredOrgan;
        uint256 weight;
        uint256 height;
        string email;
        string phone;
        bool isActive;
        uint256 urgencyLevel;
        uint256 registrationTime;
    }
    
    struct Pledge {
        string fullname;
        uint256 age;
        string gender;
        string bloodtype;
        string organs;
        string email;
        string phone;
        bool isVerified;
        uint256 pledgeTime;
    }
    
    mapping(string => Donor) public donors;
    mapping(string => Patient) public patients;
    mapping(string => Pledge) public pledges;
    
    string[] public donorIds;
    string[] public patientIds;
    string[] public pledgeIds;
    
    event DonorRegistered(string medicalId, string fullname, string bloodtype);
    event PatientRegistered(string medicalId, string fullname, string requiredOrgan);
    event PledgeMade(string pledgeId, string fullname, string bloodtype);
    event OrganMatched(string donorId, string patientId, string organ);
    
    // Donor Functions
    function setDonors(
        string memory _fullname,
        uint256 _age,
        string memory _gender,
        string memory _medicalid,
        string memory _bloodtype,
        string[] memory _organs,
        uint256 _weight,
        uint256 _height,
        string memory _email,
        string memory _phone
    ) public {
        require(bytes(donors[_medicalid].fullname).length == 0, "Donor already exists");
        require(_age >= 18 && _age <= 70, "Age must be between 18-70");
        require(_weight >= 40 && _weight <= 150, "Weight must be between 40-150 kg");
        require(_height >= 120 && _height <= 220, "Height must be between 120-220 cm");
        
        donors[_medicalid] = Donor({
            fullname: _fullname,
            age: _age,
            gender: _gender,
            medicalid: _medicalid,
            bloodtype: _bloodtype,
            organs: _organs,
            weight: _weight,
            height: _height,
            email: _email,
            phone: _phone,
            isActive: true,
            registrationTime: block.timestamp
        });
        
        donorIds.push(_medicalid);
        emit DonorRegistered(_medicalid, _fullname, _bloodtype);
    }
    
    function setPatients(
        string memory _fullname,
        uint256 _age,
        string memory _gender,
        string memory _medicalid,
        string memory _bloodtype,
        string memory _requiredOrgan,
        uint256 _weight,
        uint256 _height,
        string memory _email,
        string memory _phone,
        uint256 _urgencyLevel
    ) public {
        require(bytes(patients[_medicalid].fullname).length == 0, "Patient already exists");
        require(_age >= 1 && _age <= 80, "Age must be between 1-80");
        require(_urgencyLevel >= 1 && _urgencyLevel <= 5, "Urgency level must be 1-5");
        
        patients[_medicalid] = Patient({
            fullname: _fullname,
            age: _age,
            gender: _gender,
            medicalid: _medicalid,
            bloodtype: _bloodtype,
            requiredOrgan: _requiredOrgan,
            weight: _weight,
            height: _height,
            email: _email,
            phone: _phone,
            isActive: true,
            urgencyLevel: _urgencyLevel,
            registrationTime: block.timestamp
        });
        
        patientIds.push(_medicalid);
        emit PatientRegistered(_medicalid, _fullname, _requiredOrgan);
    }
    
    function setPledge(
        string memory _pledgeId,
        string memory _fullname,
        uint256 _age,
        string memory _gender,
        string memory _bloodtype,
        string memory _organs,
        string memory _email,
        string memory _phone
    ) public {
        require(bytes(pledges[_pledgeId].fullname).length == 0, "Pledge already exists");
        require(_age >= 18, "Age must be at least 18");
        
        pledges[_pledgeId] = Pledge({
            fullname: _fullname,
            age: _age,
            gender: _gender,
            bloodtype: _bloodtype,
            organs: _organs,
            email: _email,
            phone: _phone,
            isVerified: false,
            pledgeTime: block.timestamp
        });
        
        pledgeIds.push(_pledgeId);
        emit PledgeMade(_pledgeId, _fullname, _bloodtype);
    }
    
    // Getter Functions
    function getDonor(string memory _medicalid) public view returns (Donor memory) {
        return donors[_medicalid];
    }
    
    function getPatient(string memory _medicalid) public view returns (Patient memory) {
        return patients[_medicalid];
    }
    
    function getPledge(string memory _pledgeId) public view returns (Pledge memory) {
        return pledges[_pledgeId];
    }
    
    function validateDonor(string memory _medicalid) public view returns (bool) {
        return bytes(donors[_medicalid].fullname).length > 0;
    }
    
    function validatePatient(string memory _medicalid) public view returns (bool) {
        return bytes(patients[_medicalid].fullname).length > 0;
    }
    
    function getDonorCount() public view returns (uint256) {
        return donorIds.length;
    }
    
    function getPatientCount() public view returns (uint256) {
        return patientIds.length;
    }
    
    function getPledgeCount() public view returns (uint256) {
        return pledgeIds.length;
    }
    
    function getAllDonors() public view returns (string[] memory) {
        return donorIds;
    }
    
    function getAllPatients() public view returns (string[] memory) {
        return patientIds;
    }
    
    function getAllPledges() public view returns (string[] memory) {
        return pledgeIds;
    }
    
    // Admin Functions
    function verifyPledge(string memory _pledgeId) public {
        require(bytes(pledges[_pledgeId].fullname).length > 0, "Pledge does not exist");
        pledges[_pledgeId].isVerified = true;
    }
    
    function deactivateDonor(string memory _medicalid) public {
        require(bytes(donors[_medicalid].fullname).length > 0, "Donor does not exist");
        donors[_medicalid].isActive = false;
    }
    
    function deactivatePatient(string memory _medicalid) public {
        require(bytes(patients[_medicalid].fullname).length > 0, "Patient does not exist");
        patients[_medicalid].isActive = false;
    }
}
