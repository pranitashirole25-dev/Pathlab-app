import { Request, Response } from 'express';
import { query } from '../config/db';
import WhatsAppService from '../services/whatsappService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// In-memory store for OTPs (For production, use Redis)
const otpStore = new Map<string, { otp: string, expiresAt: number }>();

export const requestOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store with 5-minute expiration
    otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    try {
      // Send via WhatsApp if configured
      await WhatsAppService.sendOTP(phone, otp);
    } catch (waErr) {
      console.log(`[DEMO MODE] WhatsApp failed or not configured. OTP for ${phone} is ${otp}`);
      // Don't throw, just fall through for demo
    }

    res.json({ message: 'OTP sent successfully (Check console in demo mode)' });
  } catch (err) {
    console.error('OTP Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

  const storedData = otpStore.get(phone);
  
  // Accept 123456 as master OTP for demo purposes
  const isMasterOTP = otp === '123456';
  
  if (!isMasterOTP && (!storedData || storedData.otp !== otp || storedData.expiresAt < Date.now())) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    // Check if user exists, else create
    let result = await query('SELECT id, role FROM users WHERE phone = $1', [phone]);
    let user = result.rows[0];

    if (!user) {
      result = await query('INSERT INTO users (phone) VALUES ($1) RETURNING id, role', [phone]);
      user = result.rows[0];
    }

    // Clear OTP
    otpStore.delete(phone);

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    console.error('Verify Error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};
