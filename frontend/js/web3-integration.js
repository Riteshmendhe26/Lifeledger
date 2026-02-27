// Web3 Integration for LifeLedger Hardhat
let web3;
let contract;
let userAccount;
let contractAddress;
let contractABI;

// Contract configuration - will be updated after deployment
const HARDHAT_NETWORK_ID = 31337; // Localhost
const SEPOLIA_NETWORK_ID = 11155111; // Sepolia Testnet

// Initialize Web3 connection
async function initWeb3() {
    console.log('🔗 Initializing Web3 connection...');
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Create Web3 instance
            web3 = new Web3(window.ethereum);
            
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            userAccount = accounts[0];
            
            // Check network
            const networkId = await web3.eth.net.getId();
            console.log('📡 Connected to network:', networkId);
            
            // Load contract if deployed
            await loadContract();
            
            console.log('✅ Web3 initialized successfully!');
            console.log('👤 Account:', userAccount);
            
            return true;
            
        } catch (error) {
            console.error('❌ Web3 initialization failed:', error);
            alert('Please connect your MetaMask wallet!');
            return false;
        }
    } else {
        alert('🦊 Please install MetaMask to use blockchain features!');
        return false;
    }
}

// Load deployed contract
async function loadContract() {
    try {
        // Try to load contract address from environment or localStorage
        contractAddress = localStorage.getItem('contractAddress') || 'NOT_DEPLOYED';
        
        if (contractAddress === 'NOT_DEPLOYED') {
            console.log('⚠️ Contract not deployed yet. Deploy contract first.');
            return false;
        }
        
        // Load contract ABI (you'll need to update this after compilation)
        const response = await fetch('/artifacts/contracts/DonorContract.sol/DonorContract.json');
        const artifact = await response.json();
        contractABI = artifact.abi;
        
        // Create contract instance
        contract = new web3.eth.Contract(contractABI, contractAddress);
        
        console.log('📄 Contract loaded:', contractAddress);
        return true;
        
    } catch (error) {
        console.log('⚠️ Contract not available:', error.message);
        return false;
    }
}

// Register Donor on Blockchain
async function registerDonorBlockchain(formData) {
    if (!contract || !userAccount) {
        throw new Error('Blockchain not connected. Please connect wallet first.');
    }
    
    try {
        const receipt = await contract.methods.setDonors(
            formData.fullname,
            parseInt(formData.age),
            formData.gender,
            formData.medicalId,
            formData.bloodtype,
            formData.organs.join(','), // Convert array to string
            parseInt(formData.weight),
            parseInt(formData.height),
            formData.email,
            formData.phone
        ).send({ 
            from: userAccount,
            gas: 3000000 
        });
        
        console.log('✅ Donor registered on blockchain:', receipt.transactionHash);
        return receipt;
        
    } catch (error) {
        console.error('❌ Blockchain registration failed:', error);
        throw error;
    }
}

// Register Patient on Blockchain  
async function registerPatientBlockchain(formData) {
    if (!contract || !userAccount) {
        throw new Error('Blockchain not connected. Please connect wallet first.');
    }
    
    try {
        const receipt = await contract.methods.setPatients(
            formData.fullname,
            parseInt(formData.age),
            formData.gender,
            formData.medicalId,
            formData.bloodtype,
            formData.requiredOrgan,
            parseInt(formData.weight),
            parseInt(formData.height),
            formData.email,
            formData.phone,
            parseInt(formData.urgencyLevel)
        ).send({ 
            from: userAccount,
            gas: 3000000 
        });
        
        console.log('✅ Patient registered on blockchain:', receipt.transactionHash);
        return receipt;
        
    } catch (error) {
        console.error('❌ Blockchain registration failed:', error);
        throw error;
    }
}

// Get blockchain stats
async function getBlockchainStats() {
    if (!contract) return { donors: 0, patients: 0, pledges: 0 };
    
    try {
        const donorCount = await contract.methods.getDonorCount().call();
        const patientCount = await contract.methods.getPatientCount().call();
        const pledgeCount = await contract.methods.getPledgeCount().call();
        
        return {
            donors: donorCount,
            patients: patientCount,
            pledges: pledgeCount
        };
    } catch (error) {
        console.error('Error getting blockchain stats:', error);
        return { donors: 0, patients: 0, pledges: 0 };
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 LifeLedger Blockchain Integration Loading...');
    
    // Auto-initialize Web3 if MetaMask available
    if (typeof window.ethereum !== 'undefined') {
        await initWeb3();
    }
});

// Global functions
window.initWeb3 = initWeb3;
window.registerDonorBlockchain = registerDonorBlockchain;
window.registerPatientBlockchain = registerPatientBlockchain;
window.getBlockchainStats = getBlockchainStats;
