import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { User, OrderItem } from '../constants'

// Get available grocery items
const getGroceryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const groceryItems = await prisma.groceryItem.findMany({
      where: {
        isAvailable: true,
        inventoryCount: {
          gt: 0
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        unit: true,
        isAvailable: true
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json(groceryItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch grocery items", error: err });
  }
};

// ================================================================================
// Get single grocery item details

const getGroceryItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const groceryItem = await prisma.groceryItem.findFirst({
      where: {
        id,
        isAvailable: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        unit: true,
        isAvailable: true
      }
    });

    if (!groceryItem) {
      res.status(404).json({ message: "Grocery item not found or unavailable" });
      return;
    }

    res.json(groceryItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch grocery item details", error: err });
  }
};


// ================================================================================
// Create a new order

const createOrder = async (req: Request & { user?: User }, res: Response) => {
  try {
    const userId = req.user!.id;
    const items: OrderItem[] = req.body.items;

    const result = await prisma.$transaction(async (prisma) => {
      let totalAmount = 0;
      let validatedItems = [];

      for (const item of items) {
        const { grocery_item_id, quantity } = item;
        const groceryItem = await prisma.groceryItem.findFirst({
          where: { id: grocery_item_id, isAvailable: true },
        });
        if (!groceryItem || groceryItem.inventoryCount < quantity) {
          throw new Error(`Invalid item or insufficient stock`);
        }

        totalAmount += parseFloat(groceryItem.price.toString()) * quantity;
        validatedItems.push({
          groceryItemId: grocery_item_id,
          quantity,
          unitPrice: groceryItem.price,
        });

        await prisma.groceryItem.update({
          where: { id: grocery_item_id },
          data: { inventoryCount: { decrement: quantity } },
        });
      }

      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          orderItems: { create: validatedItems },
        },
        include: { orderItems: true },
      });

      return { order, items: validatedItems };
    });

    res.status(201).json({
      message: "Order created successfully",
      order: result.order,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to create order", error: err });
  }
};


// =====================================================================================

// Get user's orders

const getUserOrders = async (req: Request & { user?: User }, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};

// =====================================================================================
//Get specific order details

const getSpecificOrderDetails = async (req: Request & { user?: User }, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderItems: {
          include: {
            groceryItem: { select: { name: true, unit: true } },
          },
        },
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order details", error: err });
  }
};

// =====================================================================================
// Cancel an order (only if pending)

const cancelOrder = async (req: Request & { user?: User }, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user!.id;

    await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { orderItems: true },
      });

      if (!order || order.status !== "pending") {
        throw new Error("Order not found or cannot be cancelled");
      }

      await prisma.order.update({ where: { id: orderId }, data: { status: "cancelled" } });
      for (const item of order.orderItems) {
        await prisma.groceryItem.update({
          where: { id: item.groceryItemId },
          data: { inventoryCount: { increment: item.quantity } },
        });
      }
    });

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to cancel order", error: err });
  }
};




module.exports = { getGroceryItems, getGroceryItemById, createOrder, getSpecificOrderDetails, cancelOrder, getUserOrders }