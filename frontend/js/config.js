// Contract Configuration
const CONFIG = {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || "0x...",
    SEPOLIA_NETWORK_ID: 11155111,
    CONTRACT_ABI: [
        // Contract ABI will be loaded from artifacts
    ],
    
    // Email API endpoints
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : 'http://localhost:3000',
    
    // Medical ID prefixes
    DONOR_ID_PREFIX: 'DON',
    PATIENT_ID_PREFIX: 'PAT',
    PLEDGE_ID_PREFIX: 'PLD',
    
    // Validation rules
    VALIDATION: {
        MIN_AGE_DONOR: 18,
        MAX_AGE_DONOR: 70,
        MIN_AGE_PATIENT: 1,
        MAX_AGE_PATIENT: 80,
        MIN_WEIGHT: 40,
        MAX_WEIGHT: 150,
        MIN_HEIGHT: 120,
        MAX_HEIGHT: 220
    }
};

module.exports = CONFIG;
