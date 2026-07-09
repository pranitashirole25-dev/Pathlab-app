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

export const updateTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, description } = req.body;

  try {
    const result = await query(
      'UPDATE catalog_tests SET price = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [price, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(500).json({ error: 'Failed to update catalog test' });
  }
};

export const createTest = async (req: Request, res: Response) => {
  const { name, category, price, description, type } = req.body;

  try {
    const result = await query(
      `INSERT INTO catalog_tests (name, category, price, description, type, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [name, category, price, description, type || 'TEST']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating test:', err);
    res.status(500).json({ error: 'Failed to create new catalog item' });
  }
};
