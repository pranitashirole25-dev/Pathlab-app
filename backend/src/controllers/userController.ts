import { Request, Response } from 'express';
import { query } from '../config/db';

export const getPatients = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query(
      'SELECT id, first_name, last_name, dob, gender FROM patients WHERE user_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const addPatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, dob, gender } = req.body;
  try {
    const result = await query(
      'INSERT INTO patients (user_id, first_name, last_name, dob, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, first_name, last_name, dob, gender]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ error: 'Failed to add patient' });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query(
      'SELECT id, address_line, city, pincode FROM user_addresses WHERE user_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching addresses:', err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { address_line, city, pincode } = req.body;
  try {
    const result = await query(
      'INSERT INTO user_addresses (user_id, address_line, city, pincode) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, address_line, city, pincode]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding address:', err);
    res.status(500).json({ error: 'Failed to add address' });
  }
};
