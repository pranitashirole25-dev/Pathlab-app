import { Request, Response } from 'express';
import { query } from '../config/db';

export const addPatient = async (req: Request, res: Response) => {
  const { userId, firstName, lastName, dob, gender } = req.body;

  try {
    const result = await query(
      `INSERT INTO patients (user_id, first_name, last_name, dob, gender) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, firstName, lastName, dob, gender]
    );

    res.status(201).json({ message: 'Patient added successfully', patient: result.rows[0] });
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ error: 'Failed to add patient' });
  }
};

export const getPatientsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await query(
      `SELECT * FROM patients WHERE user_id = $1 ORDER BY created_at ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};
