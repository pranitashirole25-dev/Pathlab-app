import { Request, Response } from 'express';
import { query } from '../config/db';

export const getTests = async (req: Request, res: Response) => {
  const { category } = req.query;
  try {
    let result;
    if (category) {
      result = await query('SELECT * FROM catalog_tests WHERE is_active = true AND category = $1 ORDER BY name ASC', [category]);
    } else {
      result = await query('SELECT * FROM catalog_tests WHERE is_active = true ORDER BY name ASC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
};
