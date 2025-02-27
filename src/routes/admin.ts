import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { pool } from '../db';

const router = express.Router();

router.post('/items', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, inventory, description, category } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO grocery_items (name, price, inventory, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, inventory, description, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating grocery item' });
  }
});

router.put('/items/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, inventory, description, category } = req.body;

  try {
    const result = await pool.query(
      'UPDATE grocery_items SET name = $1, price = $2, inventory = $3, description = $4, category = $5 WHERE id = $6 RETURNING *',
      [name, price, inventory, description, category, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grocery item' });
  }
});

router.delete('/items/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM grocery_items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grocery item' });
  }
});

export default router;