// LifeLedger - Hardhat Compatible main.js
// Fixed for browser compatibility and Hardhat blockchain

// Global Configuration
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Your Hardhat address
const MIN_GAS = 1000000;

// Contract ABI (extracted from your DonorContract.json)
const contractABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "fullname", "type": "string"},
            {"internalType": "uint256", "name": "age", "type": "uint256"},
            {"internalType": "string", "name": "gender", "type": "string"},
            {"internalType": "string", "name": "medical_id", "type": "string"},
            {"internalType": "string", "name": "blood_type", "type": "string"},
            {"internalType": "string[]", "name": "organ", "type": "string[]"},
            {"internalType": "uint256", "name": "weight", "type": "uint256"},
            {"internalType": "uint256", "name": "height", "type": "uint256"}
        ],
        "name": "setDonors",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "fullname", "type": "string"},
            {"internalType": "uint256", "name": "age", "type": "uint256"},
            {"internalType": "string", "name": "gender", "type": "string"},
            {"internalType": "string", "name": "medical_id", "type": "string"},
            {"internalType": "string", "name": "blood_type", "type": "string"},
            {"internalType": "string[]", "name": "organ", "type": "string[]"},
            {"internalType": "uint256", "name": "weight", "type": "uint256"},
            {"internalType": "uint256", "name": "height", "type": "uint256"}
        ],
        "name": "setPatients",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCountOfDonors",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCountOfPatients", 
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllDonorIDs",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllPatientIDs",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "medical_id", "type": "string"}],
        "name": "getDonor",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string[]", "name": "", "type": "string[]"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "medical_id", "type": "string"}],
        "name": "getPatient",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string[]", "name": "", "type": "string[]"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "medical_id", "type": "string"}],
        "name": "validateDonor",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "medical_id", "type": "string"}],
        "name": "validatePatient",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Utility Functions (keeping your existing ones)
function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function showWarning(user, message, color) {
    let userid = user + "InputCheck";
    var warning = document.querySelector(".alert.warning");
    if (warning) {
        warning.style.background = color;
        document.getElementById(userid).innerHTML = message;
        warning.style.opacity = "100";
        warning.style.display = "block";
    } else {
        alert(message);
    }
}

function checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height) {
    var color = "#ff9800";
    if (fullname == "")
        showWarning(user, "Enter your name", color);
    else if (age.length == 0)
        showWarning(user, "Enter your age", color);
    else if (user == "Pledge" && age < 18)
        showWarning(user, "You must be over 18 to pledge", color);
    else if (gender == null)
        showWarning(user, "Enter your gender", color);
    else if (medical_id.length == 0)
        showWarning(user, "Enter your Medical ID", color);
    else if (organ.length == 0)
        showWarning(user, "Enter organ(s)", color);
    else if (weight.length == 0)
        showWarning(user, "Enter your weight", color);
    else if (weight < 20 || weight > 200)
        showWarning(user, "Enter proper weight", color);
    else if (height.length == 0)
        showWarning(user, "Enter your height", color);
    else if (height < 54 || height > 272)
        showWarning(user, "Enter proper height", color);
    else {
        return true;
    }
    return false;
}

// Medical ID Generator
function generateMedicalID(userType, name) {
    const prefix = userType === "Donor" ? "DON" : "PAT";
    const initials = name.trim().substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${initials}-${randomNum}`;
}

// Main App Object
const App = {
    web3: null,
    contractInstance: null,
    accounts: null,

    start: async function() {
        try {
            // Get accounts from MetaMask
            this.accounts = await this.web3.eth.getAccounts();
            console.log('📋 Connected accounts:', this.accounts);

            // Create contract instance with browser-compatible ABI
            this.contractInstance = new this.web3.eth.Contract(
                contractABI,
                contractAddress
            );
            
            console.log('✅ Contract instance created');
            console.log('📍 Contract address:', contractAddress);
            return true;
        } catch (error) {
            console.error('❌ Failed to start App:', error);
            return false;
        }
    },

    closeAlert: async function() {
        var alert = document.querySelector(".alert.warning");
        if (alert) {
            alert.style.opacity = "0";
            setTimeout(function() { alert.style.display = "none"; }, 600);
        }
    },

    register: async function(user) {
        try {
            console.log('🔍 Registering:', user);
            
            const fullname = document.getElementById(user + 'FullName').value;
            const age = document.getElementById(user + 'Age').value;
            const selectedGender = document.querySelector("input[name='gender']:checked");
            const gender = (selectedGender) ? selectedGender.value : null;
            const medical_id = document.getElementById(user + 'MedicalID').value;
            const blood_type = document.getElementById(user + 'BloodType').value;
            
            let checkboxes = document.querySelectorAll("input[name='Organ']:checked");
            let organ = [];
            checkboxes.forEach((checkbox) => {
                organ.push(checkbox.value);
            });
            
            const weight = document.getElementById(user + 'Weight').value;
            const height = document.getElementById(user + 'Height').value;

            let checkedValues = checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height);
            
            if (checkedValues) {
                let validate = false;
                
                if (user == "Donor") {
                    validate = await this.contractInstance.methods.validateDonor(medical_id).call();
                } else if (user == "Patient") {
                    validate = await this.contractInstance.methods.validatePatient(medical_id).call();
                }

                if (!validate) {
                    console.log('📝 Submitting to blockchain:', {fullname, age, gender, medical_id, blood_type, organ, weight, height});
                    
                    if (user == "Donor") {
                        await this.setDonor(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                    } else if (user == "Patient") {
                        await this.setPatient(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                    }
                    
                    showWarning(user, "Registration Successful!", "#04AA6D");
                    
                    var warning = document.querySelector(".alert.warning");
                    if (warning) {
                        setTimeout(function() {
                            warning.style.opacity = "0";
                            setTimeout(function() { warning.style.display = "none"; }, 1200);
                        }, 5000);
                    }
                } else {
                    showWarning(user, "Medical ID already exists!", "#f44336");
                }
            }
        } catch (error) {
            console.error('❌ Registration failed:', error);
            showWarning(user, "Registration failed: " + error.message, "#f44336");
        }
    },

    setDonor: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        
        const result = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], 
            gas: Math.max(gas, MIN_GAS)
        });
        
        console.log('✅ Donor registered:', result);
        return result;
    },

    setPatient: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        
        const result = await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], 
            gas: Math.max(gas, MIN_GAS)
        });
        
        console.log('✅ Patient registered:', result);
        return result;
    },

    viewDonors: async function() {
        try {
            console.log('🔍 Loading donors from blockchain...');
            
            // Make sure we're connected
            if (!this.contractInstance) {
                if (typeof window.ethereum !== 'undefined') {
                    this.web3 = new Web3(window.ethereum);
                    await this.start();
                } else {
                    throw new Error('MetaMask not available');
                }
            }
            
            const DonorCount = await this.contractInstance.methods.getCountOfDonors().call();
            const DonorIDs = await this.contractInstance.methods.getAllDonorIDs().call();
            
            console.log('📊 Found donors:', DonorCount.toString());
            console.log('📋 Donor IDs:', DonorIDs);
            
            let table = document.querySelector("table");
            if (!table) {
                console.log('❌ No table found');
                return;
            }
            
            // Clear existing table
            table.innerHTML = "";
            
            let Donor;
            for (let i = 0; i < DonorCount; i++) {
                const result = await this.contractInstance.methods.getDonor(DonorIDs[i]).call();
                console.log(`Donor ${i + 1}:`, result);
                
                Donor = [
                    { 
                        Index: i + 1, 
                        "Full Name": result[0], 
                        Age: result[1], 
                        Gender: result[2], 
                        "Medical ID": DonorIDs[i], 
                        "Blood Type": result[3], 
                        "Organ(s)": result[4].join(", "), 
                        "Weight(kg)": result[5], 
                        "Height(cm)": result[6]
                    }
                ];

                let data = Object.keys(Donor[0]);
                if (i == 0) {
                    generateTableHead(table, data);
                }
                generateTable(table, Donor);
            }
            
            // Hide spinner
            const spinner = document.querySelector(".spinner");
            if (spinner && spinner.parentElement) {
                spinner.parentElement.style.display = "none";
            }
            
            console.log('✅ Donors loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load donors:', error);
            throw error;
        }
    },

    viewPatients: async function() {
        // Similar structure to viewDonors but for patients
        try {
            if (!this.contractInstance) {
                if (typeof window.ethereum !== 'undefined') {
                    this.web3 = new Web3(window.ethereum);
                    await this.start();
                }
            }
            
            const patientCount = await this.contractInstance.methods.getCountOfPatients().call();
            const patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
            
            let table = document.querySelector("table");
            if (!table) return;
            
            table.innerHTML = "";
            
            for (let i = 0; i < patientCount; i++) {
                const result = await this.contractInstance.methods.getPatient(patientIDs[i]).call();
                
                let patient = [
                    { 
                        Index: i + 1, 
                        "Full Name": result[0], 
                        Age: result[1], 
                        Gender: result[2], 
                        "Medical ID": patientIDs[i], 
                        "Blood Type": result[3], 
                        "Organ(s)": result[4].join(", "), 
                        "Weight(kg)": result[5], 
                        "Height(cm)": result[6]
                    }
                ];

                let data = Object.keys(patient[0]);
                if (i == 0) {
                    generateTableHead(table, data);
                }
                generateTable(table, patient);
            }
            
            const spinner = document.querySelector(".spinner");
            if (spinner && spinner.parentElement) {
                spinner.parentElement.style.display = "none";
            }
            
        } catch (error) {
            console.error('❌ Failed to load patients:', error);
            throw error;
        }
    }
};

// Auto-attach Medical ID generators
function attachMedicalIDGenerators() {
    const patientName = document.getElementById("PatientFullName");
    const patientID = document.getElementById("PatientMedicalID");

    if (patientName && patientID) {
        patientName.addEventListener("blur", function () {
            if (patientName.value.trim() !== "") {
                const generated = generateMedicalID("Patient", patientName.value);
                patientID.value = generated;
            }
        });
    }

    const donorName = document.getElementById("DonorFullName");
    const donorID = document.getElementById("DonorMedicalID");

    if (donorName && donorID) {
        donorName.addEventListener("blur", function () {
            if (donorName.value.trim() !== "") {
                const generated = generateMedicalID("Donor", donorName.value);
                donorID.value = generated;
            }
        });
    }
}

// Initialize Medical ID generators when DOM loads
window.addEventListener("DOMContentLoaded", function () {
    attachMedicalIDGenerators();
});

// Make App globally available
window.App = App;

console.log('📋 LifeLedger main.js loaded - ready for MetaMask connection');


// ===== ENHANCED DONOR SEARCH FUNCTIONALITY =====
// Add this at the END of your existing main.js file

// Enhanced Donor Search with Inline Display
App.searchDonor = async function() {
    try {
        console.log('🔍 Starting enhanced donor search...');
        
        // Get the input value
        const donorMedicalId = document.getElementById('inputDonorMedicalID')?.value.trim();
        
        if (!donorMedicalId) {
            updateSearchStatus('Please enter a donor medical ID', 'error');
            clearDonorDetails();
            return;
        }

        // Show loading state
        updateSearchStatus('🔍 Searching for donor...', 'loading');
        clearDonorDetails();

        // Ensure we have connection and contract
        if (!App.contractInstance) {
            if (typeof window.ethereum !== 'undefined') {
                App.web3 = new Web3(window.ethereum);
                const connected = await App.start();
                if (!connected) {
                    throw new Error('Failed to connect to blockchain');
                }
            } else {
                throw new Error('MetaMask not found. Please install MetaMask.');
            }
        }

        // Validate donor exists first
        console.log('📋 Validating donor ID:', donorMedicalId);
        const exists = await App.contractInstance.methods.validateDonor(donorMedicalId).call();
        
        if (!exists) {
            updateSearchStatus('❌ Donor not found. Please check the Medical ID.', 'error');
            clearDonorDetails();
            return;
        }

        // Fetch donor data using your existing ABI
        console.log('📋 Fetching donor data for ID:', donorMedicalId);
        const donorData = await App.contractInstance.methods.getDonor(donorMedicalId).call();

        // Extract donor information (your ABI returns array, not object)
        const donor = {
            fullname: donorData[0],
            age: parseInt(donorData[1]),
            gender: donorData[2],
            medicalid: donorMedicalId, // Use the input ID
            bloodtype: donorData[3],
            organs: donorData[4], // Array of organs
            weight: parseInt(donorData[5]),
            height: parseInt(donorData[6])
        };

        console.log('✅ Found donor data:', donor);

        // Display donor details inline
        displayDonorDetails(donor);
        
        // Hide the status message since we're showing results inline
        const statusElement = document.getElementById('searchDonorCheck');
        if (statusElement && statusElement.innerHTML.includes('Searching')) {
            statusElement.style.display = 'none';
        }

    } catch (error) {
        console.error('❌ Search failed:', error);
        
        let errorMessage = '❌ Search failed: ';
        if (error.message.includes('execution reverted') || error.message.includes('revert')) {
            errorMessage = '❌ Donor not found. Please check the Medical ID.';
        } else if (error.message.includes('User denied')) {
            errorMessage = '❌ MetaMask connection was denied.';
        } else if (error.message.includes('MetaMask not found')) {
            errorMessage = '❌ MetaMask not found. Please install MetaMask.';
        } else {
            errorMessage += error.message;
        }
        
        updateSearchStatus(errorMessage, 'error');
        clearDonorDetails();
    }
};


// Enhanced Display donor details in inline format (like Screenshot 110)
function displayDonorDetails(donor) {
    console.log('📋 Displaying donor details inline:', donor);
    
    // Create the detailed donor information HTML matching Screenshot 110 style
    const donorDetailsHTML = `
        <div style="
            background: linear-gradient(135deg, #2c7a7b 0%, #285e61 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-top: 15px;
            font-family: 'Montserrat', sans-serif;
            box-shadow: 0 4px 15px rgba(44, 122, 123, 0.3);
        ">
            <div style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">
                <strong>Full Name:</strong> ${donor.fullname}
            </div>
            <div style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">
                <strong>Age:</strong> ${donor.age}
            </div>
            <div style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">
                <strong>Gender:</strong> ${donor.gender}
            </div>
            <div style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">
                <strong>Blood Type:</strong> ${donor.bloodtype}
            </div>
            <div style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">
                <strong>Organ:</strong> ${Array.isArray(donor.organs) ? donor.organs.join(', ') : donor.organs}
            </div>
            <div style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">
                <strong>Weight:</strong> ${donor.weight}
            </div>
            <div style="margin-bottom: 0; font-size: 16px; font-weight: 600;">
                <strong>Height:</strong> ${donor.height}
            </div>
        </div>
    `;
    
    // Method 1: Try to find existing results container first
    let resultsContainer = document.getElementById('donorSearchResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = donorDetailsHTML;
        resultsContainer.style.display = 'block';
        return;
    }
    
    // Method 2: Find the search input and insert results after the search button
    const donorInput = document.getElementById('inputDonorMedicalID');
    if (donorInput) {
        // Remove any existing inline results
        const existingResult = donorInput.parentElement.querySelector('.donor-details-inline');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Create new results container
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'donor-details-inline';
        resultsDiv.innerHTML = donorDetailsHTML;
        
        // Find the search button and insert results after it
        const searchButton = donorInput.parentElement.querySelector('button');
        if (searchButton) {
            // Insert after the button
            if (searchButton.nextSibling) {
                searchButton.parentElement.insertBefore(resultsDiv, searchButton.nextSibling);
            } else {
                searchButton.parentElement.appendChild(resultsDiv);
            }
        } else {
            // Fallback: append to input container
            donorInput.parentElement.appendChild(resultsDiv);
        }
        return;
    }
    
    // Method 3: Fallback to searchDonorCheck element
    const searchCheckElement = document.getElementById('searchDonorCheck');
    if (searchCheckElement) {
        searchCheckElement.innerHTML = donorDetailsHTML;
        searchCheckElement.style.display = 'block';
        searchCheckElement.style.margin = '15px 0';
        searchCheckElement.style.padding = '0';
        searchCheckElement.style.background = 'transparent';
        searchCheckElement.style.border = 'none';
    } else {
        console.warn('❌ No suitable container found for donor details');
    }
}


// Enhanced Clear donor details
function clearDonorDetails() {
    // Clear existing results container
    const resultsContainer = document.getElementById('donorSearchResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    }
    
    // Clear inline results
    const inlineResults = document.querySelectorAll('.donor-details-inline');
    inlineResults.forEach(result => result.remove());
    
    // Clear individual detail elements (fallback)
    const detailIds = [
        'getDonorFullName', 
        'getDonorAge', 
        'getDonorGender', 
        'getDonorBloodType', 
        'getDonorOrgan', 
        'getDonorWeight', 
        'getDonorHeight'
    ];
    
    detailIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
            element.style.display = 'none';
        }
    });
}


// Update search status
function updateSearchStatus(message, type) {
    console.log(`📊 Status Update [${type}]: ${message}`);
    
    const statusElement = document.getElementById('searchDonorCheck');
    if (statusElement) {
        statusElement.innerHTML = message;
        statusElement.style.display = 'block';
        statusElement.style.padding = '12px';
        statusElement.style.borderRadius = '8px';
        statusElement.style.fontWeight = 'bold';
        statusElement.style.marginTop = '10px';
        statusElement.style.textAlign = 'center';
        
        switch(type) {
            case 'success':
                statusElement.style.backgroundColor = '#d4edda';
                statusElement.style.color = '#155724';
                statusElement.style.border = '2px solid #28a745';
                break;
            case 'error':
                statusElement.style.backgroundColor = '#f8d7da';
                statusElement.style.color = '#721c24';
                statusElement.style.border = '2px solid #dc3545';
                break;
            case 'loading':
                statusElement.style.backgroundColor = '#d1ecf1';
                statusElement.style.color = '#0c5460';
                statusElement.style.border = '2px solid #17a2b8';
                break;
            default:
                statusElement.style.backgroundColor = '#f8f9fa';
                statusElement.style.color = '#495057';
                statusElement.style.border = '2px solid #6c757d';
        }
    } else {
        console.warn('❌ searchDonorCheck element not found');
        // Fallback to alert if element not found
        alert(message);
    }
}

// Enhanced Patient Search (similar structure)
App.searchPatient = async function() {
    try {
        console.log('🔍 Starting enhanced patient search...');
        
        const patientMedicalId = document.getElementById('inputPatientMedicalID')?.value.trim();
        
        if (!patientMedicalId) {
            updatePatientSearchStatus('Please enter a patient medical ID', 'error');
            return;
        }

        updatePatientSearchStatus('🔍 Searching for patient...', 'loading');
        clearPatientDetails();

        if (!App.contractInstance) {
            if (typeof window.ethereum !== 'undefined') {
                App.web3 = new Web3(window.ethereum);
                await App.start();
            } else {
                throw new Error('MetaMask not found');
            }
        }

        const exists = await App.contractInstance.methods.validatePatient(patientMedicalId).call();
        
        if (!exists) {
            updatePatientSearchStatus('❌ Patient not found. Please check the Medical ID.', 'error');
            return;
        }

        const patientData = await App.contractInstance.methods.getPatient(patientMedicalId).call();

        const patient = {
            fullname: patientData[0],
            age: parseInt(patientData[1]),
            gender: patientData[2],
            medicalid: patientMedicalId,
            bloodtype: patientData[3],
            organs: patientData[4],
            weight: parseInt(patientData[5]),
            height: parseInt(patientData[6])
        };

        console.log('✅ Found patient data:', patient);
        displayPatientDetails(patient);
        updatePatientSearchStatus('✅ Patient found successfully!', 'success');

    } catch (error) {
        console.error('❌ Patient search failed:', error);
        updatePatientSearchStatus('❌ Patient search failed: ' + error.message, 'error');
        clearPatientDetails();
    }
};

// Display patient details (similar to donor)
function displayPatientDetails(patient) {
    const elements = {
        'getPatientFullName': `👤 <strong>Name:</strong> ${patient.fullname}`,
        'getPatientAge': `🎂 <strong>Age:</strong> ${patient.age} years`,
        'getPatientGender': `⚧ <strong>Gender:</strong> ${patient.gender}`,
        'getPatientBloodType': `🩸 <strong>Blood Type:</strong> ${patient.bloodtype}`,
        'getPatientOrgan': `🫀 <strong>Required Organs:</strong> ${Array.isArray(patient.organs) ? patient.organs.join(', ') : patient.organs}`,
        'getPatientWeight': `⚖️ <strong>Weight:</strong> ${patient.weight} kg`,
        'getPatientHeight': `📏 <strong>Height:</strong> ${patient.height} cm`
    };

    Object.entries(elements).forEach(([id, content]) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = content;
            element.style.display = 'block';
            element.style.color = '#2c3e50';
            element.style.fontWeight = '500';
            element.style.marginBottom = '8px';
            element.style.padding = '10px';
            element.style.backgroundColor = '#f8f9fa';
            element.style.borderRadius = '8px';
            element.style.border = '1px solid #dee2e6';
            element.style.borderLeft = '4px solid #dc3545';
        }
    });

    const patientInfo = `
        🆔 <strong>Medical ID:</strong> ${patient.medicalid}<br>
        🚨 <strong>Required Organs:</strong> ${Array.isArray(patient.organs) ? patient.organs.length : 1}<br>
        📋 <strong>Status:</strong> ✅ Awaiting Match<br>
        📊 <strong>BMI:</strong> ${(patient.weight / Math.pow(patient.height/100, 2)).toFixed(1)}
    `;

    const searchCheckElement = document.getElementById('searchPatientCheck');
    if (searchCheckElement) {
        searchCheckElement.innerHTML = patientInfo;
        searchCheckElement.style.display = 'block';
        searchCheckElement.style.color = '#495057';
        searchCheckElement.style.fontSize = '14px';
        searchCheckElement.style.marginTop = '15px';
        searchCheckElement.style.padding = '15px';
        searchCheckElement.style.backgroundColor = '#fee2e2';
        searchCheckElement.style.borderRadius = '10px';
        searchCheckElement.style.border = '3px solid #dc3545';
        searchCheckElement.style.lineHeight = '1.6';
    }
}

// Clear patient details
function clearPatientDetails() {
    const detailIds = [
        'getPatientFullName', 
        'getPatientAge', 
        'getPatientGender', 
        'getPatientBloodType', 
        'getPatientOrgan', 
        'getPatientWeight', 
        'getPatientHeight'
    ];
    
    detailIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
            element.style.display = 'none';
        }
    });
}

// Update patient search status
function updatePatientSearchStatus(message, type) {
    const statusElement = document.getElementById('searchPatientCheck');
    if (statusElement) {
        statusElement.innerHTML = message;
        statusElement.style.display = 'block';
        statusElement.style.padding = '12px';
        statusElement.style.borderRadius = '8px';
        statusElement.style.fontWeight = 'bold';
        statusElement.style.marginTop = '10px';
        statusElement.style.textAlign = 'center';
        
        switch(type) {
            case 'success':
                statusElement.style.backgroundColor = '#d4edda';
                statusElement.style.color = '#155724';
                statusElement.style.border = '2px solid #28a745';
                break;
            case 'error':
                statusElement.style.backgroundColor = '#f8d7da';
                statusElement.style.color = '#721c24';
                statusElement.style.border = '2px solid #dc3545';
                break;
            case 'loading':
                statusElement.style.backgroundColor = '#d1ecf1';
                statusElement.style.color = '#0c5460';
                statusElement.style.border = '2px solid #17a2b8';
                break;
            default:
                statusElement.style.backgroundColor = '#f8f9fa';
                statusElement.style.color = '#495057';
                statusElement.style.border = '2px solid #6c757d';
        }
    } else {
        alert(message);
    }
}

console.log('✅ Enhanced Search functionality added to LifeLedger');
