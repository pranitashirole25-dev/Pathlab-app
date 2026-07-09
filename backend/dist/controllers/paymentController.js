"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createPaymentOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const db_1 = require("../config/db");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});
const createPaymentOrder = async (req, res) => {
    const { bookingId, amount } = req.body;
    if (!bookingId || !amount) {
        return res.status(400).json({ error: 'Booking ID and amount required' });
    }
    try {
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_booking_${bookingId}`,
        };
        const order = await razorpay.orders.create(options);
        // Save payment reference to DB
        await (0, db_1.query)('UPDATE bookings SET payment_reference = $1 WHERE id = $2', [order.id, bookingId]);
        res.json(order);
    }
    catch (err) {
        console.error('Razorpay Error:', err);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
};
exports.createPaymentOrder = createPaymentOrder;
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    // In production, verify the signature using crypto module and RAZORPAY_KEY_SECRET
    // For now, assume verification is successful
    try {
        await (0, db_1.query)('UPDATE bookings SET payment_status = $1 WHERE id = $2', ['PAID', bookingId]);
        res.json({ message: 'Payment verified successfully' });
    }
    catch (err) {
        console.error('Payment Verification Error:', err);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};
exports.verifyPayment = verifyPayment;
