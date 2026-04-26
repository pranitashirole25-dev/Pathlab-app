import { query } from '../config/db';
import WhatsAppService from './whatsappService';

class AllocationService {
  /**
   * Automates the assignment of a HOME booking to an available phlebotomist.
   * Simple Logic: Assigns to a random available phlebotomist (who is not on leave).
   * Advanced Logic: Will factor in radius/zones in the future.
   */
  static async autoAllocateHomeBooking(bookingId: string) {
    try {
      // 1. Fetch booking details
      const bookingResult = await query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
      const booking = bookingResult.rows[0];

      if (!booking || booking.collection_type !== 'HOME') {
        console.log('Skipping auto-allocation: Not a HOME booking.');
        return;
      }

      // 2. Find an available phlebotomist (basic round-robin or random selection)
      // Must have role = 'PHLEBOTOMIST' and not be on approved leave today
      const today = new Date().toISOString().split('T')[0];
      
      const phlebotomistResult = await query(`
        SELECT u.id, u.phone 
        FROM users u
        LEFT JOIN leaves l ON u.id = l.employee_id AND $1 BETWEEN l.start_date AND l.end_date AND l.status = 'APPROVED'
        WHERE u.role = 'PHLEBOTOMIST' AND l.id IS NULL
        LIMIT 1
      `, [today]);

      const assignedStaff = phlebotomistResult.rows[0];

      if (!assignedStaff) {
        console.warn(`No available phlebotomists found for booking ${bookingId}`);
        // In reality, this would flag for manual intervention by the Admin
        return;
      }

      // 3. Create the appointment record
      const scheduledStartTime = new Date(); // In reality, this comes from user slot selection
      scheduledStartTime.setHours(scheduledStartTime.getHours() + 24); // Schedule for tomorrow for now

      const apptResult = await query(
        `INSERT INTO appointments (booking_id, phlebotomist_id, scheduled_start_time, status) 
         VALUES ($1, $2, $3, 'SCHEDULED') RETURNING id`,
        [bookingId, assignedStaff.id, scheduledStartTime]
      );

      console.log(`Auto-allocated booking ${bookingId} to staff ${assignedStaff.id}`);

      // 4. Send WhatsApp Notification to Staff
      await WhatsAppService.sendOTP(assignedStaff.phone, 'NEW_APPOINTMENT_ALLOCATED'); 
      // Using sendOTP template temporarily, should be a specific 'new_appointment' template

      return apptResult.rows[0].id;
    } catch (err) {
      console.error('Error in auto allocation:', err);
    }
  }
}

export default AllocationService;
