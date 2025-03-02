import { Request, Response } from 'express';
const { validationResult } = require("express-validator");
import { PrismaClient } from '@prisma/client';

import { User } from '../constants'

const prisma = new PrismaClient();

const addGroceryItem = async (req: Request & { user?: User }, res: Response) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, inventory_count, unit } = req.body;

    const groceryItem = await prisma.groceryItem.create({
      data: {
        name,
        description,
        price,
        inventoryCount: inventory_count,
        unit,
      },
    });

    res.status(201).json(groceryItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to add grocery item", error: err });
  }
};

// =======================================================================================

// Get all grocery items (Admin view with inventory details)

const getGroceryItems = async (req: Request, res: Response) => {
  try {
    const groceryItems = await prisma.groceryItem.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(groceryItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch grocery items", error: err });
  }
};


// =======================================================================================
// Update a grocery item

const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, inventory_count, unit, is_available } = req.body;

    // Check if item exists
    const existingItem = await prisma.groceryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    // Build the update data based on provided fields
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (inventory_count !== undefined) updateData.inventoryCount = inventory_count;
    if (unit !== undefined) updateData.unit = unit;
    if (is_available !== undefined) updateData.isAvailable = is_available;

    const updatedItem = await prisma.groceryItem.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to update grocery item", error: err });
  }
};

// =======================================================================================
// delete a grocery item
const deleteGroceryItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Check if item is used in any orders
    const orderItem = await prisma.orderItem.findFirst({
      where: { groceryItemId: id },
    });

    if (orderItem) {
      // Instead of deleting, mark as unavailable
      await prisma.groceryItem.update({
        where: { id },
        data: { isAvailable: false },
      });

      return res.json({ message: "Item is used in orders. Marked as unavailable instead of deleting." });
    }

    // If not used in orders, delete it
    await prisma.groceryItem.delete({
      where: { id },
    });

    res.json({ message: "Grocery item deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete grocery item", error: err });
  }
};

// =======================================================================================


//update inventory levels
 const updateInventory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { inventory_count } = req.body;

    const groceryItem = await prisma.groceryItem.update({
      where: { id },
      data: { inventoryCount: inventory_count }
    });

    if (!groceryItem) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.json(groceryItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to update inventory", error: err });
  }
};

// =======================================================================================

//  get all orders (admin only)
 const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};

// =======================================================================================

// Get order details by ID
const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        },
        orderItems: {
          include: {
            groceryItem: {
              select: {
                name: true,
                unit: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order details", error: err });
  }
};

// =======================================================================================

// Update Order Status
 const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Failed to update order status", error: err });
  }
};

module.exports = { addGroceryItem ,getGroceryItems ,updateGroceryItem ,deleteGroceryItem ,updateInventory ,getAllOrders ,getOrderById ,updateOrderStatus};
