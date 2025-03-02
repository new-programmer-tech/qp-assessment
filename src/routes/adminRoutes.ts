import { validateRequest } from "../middleware/validation";

const express = require("express");
const router = express.Router();
const { body, validationResult ,param } = require("express-validator");

const {addGroceryItem , getGroceryItems ,updateGroceryItem ,deleteGroceryItem ,updateInventory ,getAllOrders ,getOrderById ,updateOrderStatus} = require("../controllers/adminController");

const { authenticateToken, isAdmin } = require('../middleware/authenticateToken ');

// Add Grocery Item
router.post(
  "/add-grocery-items",
  [
   authenticateToken,
    isAdmin,
    body("name").isLength({ min: 2 }).trim(),
    body("price").isFloat({ min: 0.01 }),
    body("inventory_count").isInt({ min: 0 }),
    body("unit").isLength({ min: 1 }),
  ],
  addGroceryItem
);

// Get Grocery Items
router.get("/get-grocery-items", authenticateToken, isAdmin, getGroceryItems);

// Update Grocery Item
router.put(
  "/grocery-items/:id",
  [
    authenticateToken,
    isAdmin,
    param("id").isInt(),
    body("name").optional().isLength({ min: 2 }).trim(),
    body("price").optional().isFloat({ min: 0.01 }),
    body("inventory_count").optional().isInt({ min: 0 }),
    validateRequest,
  ],
  updateGroceryItem
);

// Delete Grocery Item
router.delete(
  "/grocery-items/:id",
  [
    authenticateToken,
    isAdmin,
    param("id").isInt(),
    validateRequest,
  ],
  deleteGroceryItem
);

// Update Inventory
router.patch(
  "/grocery-items/:id/inventory",
  [
    authenticateToken,
    isAdmin,
    param("id").isInt(),
    body("inventory_count").isInt({ min: 0 }),
    validateRequest
  ],
  updateInventory
);

// Get All Orders
router.get("/orders", [authenticateToken, isAdmin], getAllOrders);

// Get Order By ID
router.get(
  "/orders/:id",
  authenticateToken,
  isAdmin,
  param("id").isInt(),
  validateRequest,
  getOrderById
);

// Update Order Status
router.patch(
  "/orders/:id/status",
  authenticateToken,
  isAdmin,
  param("id").isInt(),
  body("status").isIn(["pending", "confirmed", "cancelled", "delivered"]),
  validateRequest,
  updateOrderStatus
);

export default router;
