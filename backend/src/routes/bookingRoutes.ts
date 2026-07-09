import { Router } from 'express';
import { createBooking, cancelBooking, getBookingHistory, getStaffAppointments, updateBookingStatus, getAdminBookings } from '../controllers/bookingController';

const router = Router();

router.post('/', createBooking);
router.post('/:id/cancel', cancelBooking);
router.get('/history/:userId', getBookingHistory);
router.get('/staff', getStaffAppointments);
router.get('/admin/completed', getAdminBookings);
router.put('/:id/status', updateBookingStatus);

export default router;
