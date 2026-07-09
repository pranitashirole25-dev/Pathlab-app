import { Request, Response } from 'express';
import { query } from '../config/db';

export const createBooking = async (req: Request, res: Response) => {
  const { userId, patientId, testIds, collectionType, addressId } = req.body;

  try {
    if (!userId || !patientId || !testIds || !collectionType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Fetch Patient DOB to calculate age
    const patientRes = await query('SELECT dob FROM patients WHERE id = $1', [patientId]);
    if (patientRes.rowCount === 0) return res.status(404).json({ error: 'Patient not found' });
    
    const dob = new Date(patientRes.rows[0].dob);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // 2. Calculate subtotal from testIds
    const testIdsString = testIds.join(',');
    const testsRes = await query(`SELECT SUM(price) as subtotal FROM catalog_tests WHERE id = ANY($1::int[])`, [testIds]);
    const subtotal = parseFloat(testsRes.rows[0].subtotal || 0);

    // 3. Apply business logic
    let discountAmount = 0;
    if (age >= 60) {
      discountAmount = subtotal * 0.15; // 15% discount
    }

    let homeVisitFee = 0;
    if (collectionType === 'HOME') {
      homeVisitFee = 100.00;
    }

    const totalAmount = subtotal - discountAmount + homeVisitFee;

    // 4. Insert Booking
    const bookingResult = await query(
      `INSERT INTO bookings (user_id, patient_id, collection_type, address_id, subtotal, discount_amount, home_visit_fee, total_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, patientId, collectionType, addressId || null, subtotal, discountAmount, homeVisitFee, totalAmount]
    );

    const bookingId = bookingResult.rows[0].id;

    // 5. Insert booking_tests
    for (const testId of testIds) {
      await query(
        `INSERT INTO booking_tests (booking_id, test_id, price_at_booking) 
         SELECT $1, id, price FROM catalog_tests WHERE id = $2`,
        [bookingId, testId]
      );
    }

    res.status(201).json({ 
      message: 'Booking created successfully', 
      bookingId, 
      subtotal, 
      discountAmount, 
      homeVisitFee, 
      totalAmount 
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check scheduled time and status
    const apptRes = await query(
      `SELECT a.scheduled_date, a.scheduled_time, a.actual_arrival_time, b.home_visit_fee, b.total_amount 
       FROM bookings b 
       LEFT JOIN appointments a ON b.id = a.booking_id 
       WHERE b.id = $1`,
      [id]
    );

    if (apptRes.rowCount === 0) return res.status(404).json({ error: 'Booking not found' });

    const appt = apptRes.rows[0];
    let cancellationFee = 0;

    // If it's a home visit, check time diff
    if (appt.home_visit_fee > 0) {
      if (appt.actual_arrival_time) {
        cancellationFee = 100; // Technician already arrived
      } else if (appt.scheduled_date && appt.scheduled_time) {
        const dateStr = appt.scheduled_date.toISOString().split('T')[0];
        const timeStr = appt.scheduled_time;
        const scheduledDateTime = new Date(dateStr + 'T' + timeStr);
        const timeDiffMins = (scheduledDateTime.getTime() - Date.now()) / 60000;
        
        if (timeDiffMins < 30) {
          cancellationFee = 100; // Less than 30 mins
        }
      }
    }

    // Update booking
    await query(
      "UPDATE bookings SET status = 'CANCELLED', cancellation_fee = $1, payment_status = 'REFUNDED' WHERE id = $2",
      [cancellationFee, id]
    );

    res.json({ message: 'Booking cancelled', cancellationFee, refundAmount: appt.total_amount - cancellationFee });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

export const getBookingHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const history = await query(
      "SELECT b.id, b.created_at, b.status, b.total_amount, p.first_name, p.last_name, p.dob, r.local_file_path as report_url " +
      "FROM bookings b " +
      "JOIN patients p ON b.patient_id = p.id " +
      "LEFT JOIN reports r ON b.id = r.booking_id " +
      "WHERE b.user_id = $1 " +
      "ORDER BY b.created_at DESC", 
      [userId]
    );
    res.json(history.rows);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const getStaffAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await query(`
      SELECT b.id, p.first_name || ' ' || p.last_name AS patient, 
             a.scheduled_time AS time, 
             COALESCE(u.address_line || ', ' || u.city, 'Lab Visit') AS location,
             b.status,
             array_agg(ct.name) AS tests
      FROM bookings b
      JOIN patients p ON b.patient_id = p.id
      LEFT JOIN user_addresses u ON b.address_id = u.id
      LEFT JOIN appointments a ON b.id = a.booking_id
      LEFT JOIN booking_tests bt ON b.id = bt.booking_id
      LEFT JOIN catalog_tests ct ON bt.test_id = ct.id
      WHERE b.status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS')
      GROUP BY b.id, p.first_name, p.last_name, a.scheduled_time, u.address_line, u.city
      ORDER BY b.created_at ASC
    `);

    // Transform into the format the staff PWA expects
    const formatted = appointments.rows.map(row => ({
      id: row.id,
      patient: row.patient,
      time: row.time ? row.time.substring(0, 5) : 'Anytime',
      location: row.location,
      status: row.status,
      tests: row.tests.filter(Boolean)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching staff appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);

    if (status === 'COMPLETED') {
      // Set actual arrival time if it hasn't been set
      await query("UPDATE appointments SET actual_arrival_time = NOW() WHERE booking_id = $1 AND actual_arrival_time IS NULL", [id]);
    }

    res.json({ message: 'Booking status updated successfully', id, status });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};
