"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.requestOTP = void 0;
const db_1 = require("../config/db");
const whatsappService_1 = __importDefault(require("../services/whatsappService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
// In-memory store for OTPs (For production, use Redis)
const otpStore = new Map();
const requestOTP = async (req, res) => {
    const { phone } = req.body;
    if (!phone)
        return res.status(400).json({ error: 'Phone number is required' });
    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store with 5-minute expiration
        otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
        // Send via WhatsApp
        await whatsappService_1.default.sendOTP(phone, otp);
        res.json({ message: 'OTP sent successfully via WhatsApp' });
    }
    catch (err) {
        console.error('OTP Error:', err);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};
exports.requestOTP = requestOTP;
const verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp)
        return res.status(400).json({ error: 'Phone and OTP required' });
    const storedData = otpStore.get(phone);
    if (!storedData || storedData.otp !== otp || storedData.expiresAt < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    try {
        // Check if user exists, else create
        let result = await (0, db_1.query)('SELECT id, role FROM users WHERE phone = $1', [phone]);
        let user = result.rows[0];
        if (!user) {
            result = await (0, db_1.query)('INSERT INTO users (phone) VALUES ($1) RETURNING id, role', [phone]);
            user = result.rows[0];
        }
        // Clear OTP
        otpStore.delete(phone);
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user });
    }
    catch (err) {
        console.error('Verify Error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
};
exports.verifyOTP = verifyOTP;
