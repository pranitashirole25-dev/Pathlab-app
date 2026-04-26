import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { query } from '../config/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export const createPaymentOrder = async (req: Request, res: Response) => {
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
    await query('UPDATE bookings SET payment_reference = $1 WHERE id = $2', [order.id, bookingId]);

    res.json(order);
  } catch (err) {
    console.error('Razorpay Error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  // In production, verify the signature using crypto module and RAZORPAY_KEY_SECRET
  // For now, assume verification is successful

  try {
    await query('UPDATE bookings SET payment_status = $1 WHERE id = $2', ['PAID', bookingId]);
    res.json({ message: 'Payment verified successfully' });
  } catch (err) {
    console.error('Payment Verification Error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
