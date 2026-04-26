import { query } from '../config/db';

class ScorecardService {
  /**
   * Calculates penalty based on delayed arrival.
   * Logic: For every 15 minutes of delay, ₹10 is deducted from incentive_pool.
   * If delay <= 15 mins, no penalty.
   */
  static async calculateAndApplyPenalty(appointmentId: string, scheduledTime: Date, actualArrivalTime: Date) {
    const delayMs = actualArrivalTime.getTime() - scheduledTime.getTime();
    const delayMinutes = Math.floor(delayMs / 60000);

    if (delayMinutes <= 15) {
      console.log(`Appointment ${appointmentId}: Arrival on time or within grace period.`);
      return 0; // No penalty
    }

    // Calculate penalty chunks (every 15 min past the first 15 min grace, or total?)
    // "for every 15 min delay 10 rupees will be reduced"
    const penaltyChunks = Math.floor(delayMinutes / 15);
    const penaltyAmount = penaltyChunks * 10;

    try {
      // Find the phlebotomist ID for this appointment
      const apptResult = await query('SELECT phlebotomist_id FROM appointments WHERE id = $1', [appointmentId]);
      const phlebotomistId = apptResult.rows[0]?.phlebotomist_id;

      if (!phlebotomistId) throw new Error('Phlebotomist not found for appointment');

      // Apply penalty to their current month's scorecard
      const monthStart = new Date(actualArrivalTime.getFullYear(), actualArrivalTime.getMonth(), 1);
      
      const scorecardResult = await query(
        `UPDATE scorecards 
         SET penalties = penalties + $1, updated_at = NOW() 
         WHERE employee_id = $2 AND month_start = $3 
         RETURNING *`,
        [penaltyAmount, phlebotomistId, monthStart]
      );

      // If scorecard doesn't exist for the month, create one (in production this should be a CRON job at month start)
      if (scorecardResult.rowCount === 0) {
         await query(
           `INSERT INTO scorecards (employee_id, month_start, incentive_pool, penalties) 
            VALUES ($1, $2, 0, $3)`,
           [phlebotomistId, monthStart, penaltyAmount]
         );
      }

      console.log(`Applied penalty of ₹${penaltyAmount} for a ${delayMinutes} minute delay.`);
      return penaltyAmount;
      
    } catch (err) {
      console.error('Error applying penalty:', err);
      throw err;
    }
  }

  /**
   * Stop penalty timer by recording arrival time (when OTP is verified)
   */
  static async recordArrival(appointmentId: string) {
    const arrivalTime = new Date();
    
    // Update appointment status to IN_PROGRESS
    const result = await query(
      `UPDATE appointments 
       SET status = 'IN_PROGRESS', actual_start_time = $1 
       WHERE id = $2 RETURNING scheduled_start_time`,
      [arrivalTime, appointmentId]
    );

    const scheduledTime = new Date(result.rows[0].scheduled_start_time);
    
    // Calculate penalty
    await this.calculateAndApplyPenalty(appointmentId, scheduledTime, arrivalTime);
  }
}

export default ScorecardService;
