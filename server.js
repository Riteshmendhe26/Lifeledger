const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
const emailTemplates = {
    donor: (data) => ({
        subject: '🫀 LifeLedger - Donor Registration Confirmed!',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #28a745; text-align: center;">🫀 Welcome to LifeLedger!</h2>
                    <p>Dear <strong>${data.fullname}</strong>,</p>
                    <p>Thank you for registering as an organ donor.</p>
                    
                    <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <h3>✅ Registration Details:</h3>
                        <p><strong>Medical ID:</strong> <code>${data.medicalId}</code></p>
                        <p><strong>Blood Type:</strong> ${data.bloodtype}</p>
                        <p><strong>Available Organs:</strong> ${data.organs}</p>
                    </div>
                    
                    <p>Best regards,<br><strong>LifeLedger Team</strong></p>
                </div>
            </div>
        `
    }),
    
    patient: (data) => ({
        subject: '🏥 LifeLedger - Patient Registration Confirmed!',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545; text-align: center;">🏥 LifeLedger Registration Confirmed</h2>
                    <p>Dear <strong>${data.fullname}</strong>,</p>
                    <p>Your registration as a patient has been completed.</p>
                    
                    <div style="background: #ffeaea; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                        <h3>✅ Registration Details:</h3>
                        <p><strong>Medical ID:</strong> <code>${data.medicalId}</code></p>
                        <p><strong>Required Organ:</strong> ${data.requiredOrgan}</p>
                        <p><strong>Blood Type:</strong> ${data.bloodtype}</p>
                    </div>
                    
                    <p>Best regards,<br><strong>LifeLedger Team</strong></p>
                </div>
            </div>
        `
    })
};

// ✅ ALL PAGE ROUTES (This fixes your routing issue)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/homepage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'homepage.html'));
});

app.get('/donor-registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'donor-registration.html'));
});

app.get('/patient-registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'patient-registration.html'));
});

app.get('/donor-pledge.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'donor-pledge.html'));
});

app.get('/view-donors.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'view-donors.html'));
});

app.get('/view-patients.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'view-patients.html'));
});

app.get('/view-pledges.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'view-pledges.html'));
});

app.get('/verify-pledges.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'verify-pledges.html'));
});

app.get('/transplant-matching.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'transplant-matching.html'));
});

app.get('/awareness.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'awareness.html'));
});

app.get('/about-us.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'about-us.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'contact.html'));
});

// API Routes
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, type, data } = req.body;
        
        const template = emailTemplates[type];
        if (!template) {
            return res.status(400).json({ success: false, error: 'Invalid email type' });
        }
        
        const emailContent = template(data);
        
        const mailOptions = {
            from: `"🫀 LifeLedger Platform" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html
        };
        
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully' });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        email: process.env.EMAIL_USER ? 'Configured ✅' : 'Not configured ❌',
        blockchain: 'Ready ✅',
        routes: 'All pages configured ✅'
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        platform: 'LifeLedger',
        version: '1.0.0',
        blockchain: 'Ethereum Hardhat',
        network: 'Localhost/Sepolia',
        email_service: process.env.EMAIL_USER ? 'Active ✅' : 'Inactive ❌',
        frontend_pages: [
            '/', '/homepage.html', '/donor-registration.html', '/patient-registration.html',
            '/donor-pledge.html', '/view-donors.html', '/view-patients.html', 
            '/view-pledges.html', '/verify-pledges.html', '/transplant-matching.html',
            '/awareness.html', '/about-us.html', '/contact.html'
        ],
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        requested_path: req.originalUrl,
        available_routes: [
            '/', '/homepage.html', '/donor-registration.html', '/patient-registration.html',
            '/donor-pledge.html', '/view-donors.html', '/view-patients.html', 
            '/view-pledges.html', '/verify-pledges.html', '/transplant-matching.html',
            '/awareness.html', '/about-us.html', '/contact.html',
            '/api/health', '/api/status', '/api/send-email'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 LifeLedger Platform Started Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log(`🔗 Blockchain: Ready for Hardhat connection`);
    console.log(`📁 All Frontend Pages: Configured ✅`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ All pages now accessible:');
    console.log('   • http://localhost:3000/');
    console.log('   • http://localhost:3000/donor-registration.html');
    console.log('   • http://localhost:3000/patient-registration.html');
    console.log('   • http://localhost:3000/homepage.html');
    console.log('   • And all other pages...');
});
