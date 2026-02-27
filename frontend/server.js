const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('frontend'));

// Email transporter
const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
const emailTemplates = {
    donor: (data) => ({
        subject: 'LifeLedger - Donor Registration Confirmation',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h2 style="color: #28a745;">Welcome to LifeLedger!</h2>
                <p>Dear <strong>${data.fullname}</strong>,</p>
                <p>Thank you for registering as an organ donor. Your registration has been successfully completed on the blockchain.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Registration Details:</h3>
                    <p><strong>Medical ID:</strong> ${data.medicalId}</p>
                    <p><strong>Blood Type:</strong> ${data.bloodtype}</p>
                    <p><strong>Available Organs:</strong> ${data.organs}</p>
                    <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p>You are now part of our life-saving community! Your information is securely stored on the Ethereum blockchain.</p>
                <p>We will notify you when there are any matching requests.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p>Best regards,<br><strong>LifeLedger Team</strong></p>
                    <p style="font-size: 12px; color: #666;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </div>
        `
    }),
    
    patient: (data) => ({
        subject: 'LifeLedger - Patient Registration Confirmation',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h2 style="color: #dc3545;">LifeLedger Registration Confirmed</h2>
                <p>Dear <strong>${data.fullname}</strong>,</p>
                <p>Your registration as a patient has been successfully completed on our blockchain platform.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Registration Details:</h3>
                    <p><strong>Medical ID:</strong> ${data.medicalId}</p>
                    <p><strong>Required Organ:</strong> ${data.requiredOrgan}</p>
                    <p><strong>Blood Type:</strong> ${data.bloodtype}</p>
                    <p><strong>Urgency Level:</strong> ${data.urgencyLevel}/5</p>
                    <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p>We will actively search for matching donors and notify you immediately when a compatible donor is found.</p>
                <p>Your data is securely stored on the blockchain, ensuring transparency and immutability.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p>Best regards,<br><strong>LifeLedger Team</strong></p>
                    <p style="font-size: 12px; color: #666;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </div>
        `
    })
};

// API Routes
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, type, data } = req.body;
        
        if (!email || !type || !data) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }
        
        const template = emailTemplates[type];
        if (!template) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email type' 
            });
        }
        
        const emailContent = template(data);
        
        const mailOptions = {
            from: `"LifeLedger Platform" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Email sent successfully' 
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 LifeLedger server running on port ${PORT}`);
    console.log(`📧 Email service configured with ${process.env.EMAIL_USER}`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});
