import { Router } from 'express';
import { createBooking, cancelBooking, getBookingHistory } from '../controllers/bookingController';

const router = Router();

router.post('/', createBooking);
router.post('/:id/cancel', cancelBooking);
router.get('/history/:userId', getBookingHistory);

export default router;
