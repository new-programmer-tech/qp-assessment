import express, { Router } from "express";
const router: Router = express.Router();
import { validateRequest } from "../middleware/validation";
const { body, validationResult ,param } = require("express-validator");


const { getGroceryItems, getGroceryItemById, createOrder, getSpecificOrderDetails, cancelOrder, getUserOrders } = require('../controllers/userController')
const {authenticateToken} =require('../middleware/authenticateToken ')



router.get("/grocery-items", authenticateToken, getGroceryItems);
router.get(
  "/grocery-items/:id",
  [authenticateToken, param("id").isInt(), validateRequest],
  getGroceryItemById
);

router.post("/create-orders", [authenticateToken, body("items").isArray({ min: 1 }), validateRequest], createOrder);
router.get("/all-orders-details", authenticateToken, getUserOrders);
router.get("/orders/:id", [authenticateToken, param("id").isInt(), validateRequest], getSpecificOrderDetails);
router.post("/orders/:id/cancel", [authenticateToken, param("id").isInt(), validateRequest], cancelOrder);


export default router;