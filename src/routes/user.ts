import express from 'express';
import {authenticateToken}  from '../middleware/auth';
import { pool } from '../db';

const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grocery_items WHERE inventory > 0');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grocery items' });
  }
});

router.post('/orders', authenticateToken, async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id',
      [userId, 'pending']
    );
    const orderId = orderResult.rows[0].id;

    let totalAmount = 0;

    // Process each item
    for (const item of items) {
      // Check inventory
      const inventoryResult = await client.query(
        'SELECT price, inventory FROM grocery_items WHERE id = $1',
        [item.groceryItemId]
      );

      if (inventoryResult.rows.length === 0) {
        throw new Error(`Item ${item.groceryItemId} not found`);
      }

      const { price, inventory } = inventoryResult.rows[0];

      if (inventory < item.quantity) {
        throw new Error(`Insufficient inventory for item ${item.groceryItemId}`);
      }

      // Update inventory
      await client.query(
        'UPDATE grocery_items SET inventory = inventory - $1 WHERE id = $2',
        [item.quantity, item.groceryItemId]
      );

      // Add order item
      await client.query(
        'INSERT INTO order_items (order_id, grocery_item_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
        [orderId, item.groceryItemId, item.quantity, price]
      );

      totalAmount += price * item.quantity;
    }

    // Update order total
    await client.query(
      'UPDATE orders SET total_amount = $1 WHERE id = $2',
      [totalAmount, orderId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      orderId,
      totalAmount,
      status: 'pending'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
});




export default router;