const express = require("express");
const router = express.Router();

// Correct way to import using `require`
const {addGroceryItem} = require("../controllers/adminController");

const { authenticateToken ,isAdmin } = require('../middleware/authenticateToken ')
const { body } = require("express-validator");

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

export default router;
