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

module.exports = { addGroceryItem };
