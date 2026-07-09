import { Request, Response } from 'express';
import { query } from '../config/db';

export const uploadReport = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { pdfUrl } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: 'pdfUrl is required' });
  }

  try {
    // Upsert report for this booking
    const existing = await query('SELECT id FROM reports WHERE booking_id = $1', [bookingId]);
    if (existing.rowCount! > 0) {
      await query('UPDATE reports SET local_file_path = $1, uploaded_at = NOW() WHERE booking_id = $2', [pdfUrl, bookingId]);
    } else {
      await query('INSERT INTO reports (booking_id, local_file_path) VALUES ($1, $2)', [bookingId, pdfUrl]);
    }

    res.json({ message: 'Report uploaded successfully', pdfUrl });
  } catch (err) {
    console.error('Error uploading report:', err);
    res.status(500).json({ error: 'Failed to upload report' });
  }
};
