# Grocery Store API Documentation

This document provides comprehensive details about all API endpoints in the grocery store application, including request bodies, responses, and authentication requirements.

## Table of Contents
- [Authentication](#authentication)
- [Auth Routes](#auth-routes)
- [Admin Routes](#admin-routes)
- [User Routes](#user-routes)

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the request header:

```
Authorization: Bearer your_jwt_token_here
```

## Auth Routes

### Register User

Creates a new user account.

**URL:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "User registration failed",
  "error": "..."
}
```

### Login

Authenticates a user and returns a JWT token.

**URL:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

**Response (404 Not Found):**
```json
{
  "message": "User not found"
}
```

## Admin Routes

> All admin routes require authentication with an admin role.

### Add New Grocery Item

Adds a new grocery item to the store.

**URL:** `POST /api/admin/add-grocery-items`

**Request Body:**
```json
{
  "name": "Organic Apples",
  "description": "Fresh organic apples from local farms",
  "price": 3.99,
  "inventory_count": 100,
  "unit": "kg"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Organic Apples",
  "description": "Fresh organic apples from local farms",
  "price": 3.99,
  "inventoryCount": 100,
  "unit": "kg",
  "isAvailable": true,
  "createdAt": "2025-02-28T12:00:00.000Z",
  "updatedAt": "2025-02-28T12:00:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Failed to add grocery item",
  "error": "..."
}
```

### Get All Grocery Items (Admin View)

Retrieves all grocery items with inventory details.

**URL:** `GET /api/admin/get-grocery-items`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Organic Apples",
    "description": "Fresh organic apples from local farms",
    "price": 3.99,
    "inventoryCount": 100,
    "unit": "kg",
    "isAvailable": true,
    "createdAt": "2025-02-28T12:00:00.000Z",
    "updatedAt": "2025-02-28T12:00:00.000Z"
  },
  {...}
]
```

### Update a Grocery Item

Updates an existing grocery item.

**URL:** `PUT /api/admin/grocery-items/:id`

**Request Body:** (all fields optional)
```json
{
  "name": "Organic Red Apples",
  "description": "Fresh organic red apples from local farms",
  "price": 4.29,
  "inventory_count": 85,
  "unit": "kg",
  "is_available": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Organic Red Apples",
  "description": "Fresh organic red apples from local farms",
  "price": 4.29,
  "inventoryCount": 85,
  "unit": "kg",
  "isAvailable": true,
  "createdAt": "2025-02-28T12:00:00.000Z",
  "updatedAt": "2025-02-28T12:05:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Grocery item not found"
}
```

### Delete a Grocery Item

Deletes a grocery item or marks it as unavailable if used in orders.

**URL:** `DELETE /api/admin/grocery-items/:id`

**Response (200 OK) - If deleted:**
```json
{
  "message": "Grocery item deleted successfully"
}
```

**Response (200 OK) - If marked unavailable:**
```json
{
  "message": "Item is used in orders. Marked as unavailable instead of deleting."
}
```

### Update Inventory Levels

Updates only the inventory count of a grocery item.

**URL:** `PATCH /api/admin/grocery-items/:id/inventory`

**Request Body:**
```json
{
  "inventory_count": 120
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Organic Red Apples",
  "description": "Fresh organic red apples from local farms",
  "price": 4.29,
  "inventoryCount": 120,
  "unit": "kg",
  "isAvailable": true,
  "createdAt": "2025-02-28T12:00:00.000Z",
  "updatedAt": "2025-02-28T12:10:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Grocery item not found"
}
```

### View All Orders (Admin)

Retrieves all orders in the system.

**URL:** `GET /api/admin/orders`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 2,
    "totalAmount": 29.97,
    "status": "pending",
    "createdAt": "2025-02-28T12:15:00.000Z",
    "updatedAt": "2025-02-28T12:15:00.000Z",
    "user": {
      "username": "janedoe",
      "email": "jane@example.com"
    }
  },
  {...}
]
```

### View Order Details (Admin)

Retrieves detailed information about a specific order.

**URL:** `GET /api/admin/orders/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 2,
  "totalAmount": 29.97,
  "status": "pending",
  "createdAt": "2025-02-28T12:15:00.000Z",
  "updatedAt": "2025-02-28T12:15:00.000Z",
  "user": {
    "username": "janedoe",
    "email": "jane@example.com"
  },
  "orderItems": [
    {
      "id": 1,
      "orderId": 1,
      "groceryItemId": 1,
      "quantity": 3,
      "unitPrice": 4.29,
      "groceryItem": {
        "name": "Organic Red Apples",
        "unit": "kg"
      }
    },
    {...}
  ]
}
```

**Response (404 Not Found):**
```json
{
  "message": "Order not found"
}
```

### Update Order Status

Updates the status of an order.

**URL:** `PATCH /api/admin/orders/:id/status`

**Request Body:**
```json
{
  "status": "confirmed"
}
```
(Allowed statuses: "pending", "confirmed", "cancelled", "delivered")

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 2,
  "totalAmount": 29.97,
  "status": "confirmed",
  "createdAt": "2025-02-28T12:15:00.000Z",
  "updatedAt": "2025-02-28T12:20:00.000Z"
}
```

## User Routes

> All user routes require authentication.

### Get Available Grocery Items

Retrieves all available grocery items with inventory > 0.

**URL:** `GET /api/grocery-items`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Organic Red Apples",
    "description": "Fresh organic red apples from local farms",
    "price": 4.29,
    "unit": "kg",
    "isAvailable": true
  },
  {...}
]
```

### Get Single Grocery Item Details

Retrieves details of a specific grocery item.

**URL:** `GET /api/grocery-items/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Organic Red Apples",
  "description": "Fresh organic red apples from local farms",
  "price": 4.29,
  "unit": "kg",
  "isAvailable": true
}
```

**Response (404 Not Found):**
```json
{
  "message": "Grocery item not found or unavailable"
}
```

### Create a New Order

Creates a new order with multiple items.

**URL:** `POST /api/create-orders`

**Request Body:**
```json
{
  "items": [
    {
      "grocery_item_id": 1,
      "quantity": 3
    },
    {
      "grocery_item_id": 2,
      "quantity": 2
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "total_amount": 29.97,
    "status": "pending",
    "items": [
      {
        "groceryItemId": 1,
        "quantity": 3,
        "unitPrice": 4.29
      },
      {
        "groceryItemId": 2,
        "quantity": 2,
        "unitPrice": 8.55
      }
    ]
  }
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Failed to create order",
  "error": "Not enough inventory for Organic Red Apples. Available: 2"
}
```

### Get User's Orders

Retrieves all orders placed by the authenticated user.

**URL:** `GET /api/all-orders-details`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 2,
    "totalAmount": 29.97,
    "status": "pending",
    "createdAt": "2025-02-28T12:15:00.000Z",
    "updatedAt": "2025-02-28T12:15:00.000Z"
  },
  {...}
]
```

### Get Specific Order Details

Retrieves detailed information about a specific order.

**URL:** `GET /api/orders/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 2,
  "totalAmount": 29.97,
  "status": "pending",
  "createdAt": "2025-02-28T12:15:00.000Z",
  "updatedAt": "2025-02-28T12:15:00.000Z",
  "orderItems": [
    {
      "id": 1,
      "orderId": 1,
      "groceryItemId": 1,
      "quantity": 3,
      "unitPrice": 4.29,
      "groceryItem": {
        "name": "Organic Red Apples",
        "unit": "kg"
      }
    },
    {...}
  ]
}
```

**Response (404 Not Found):**
```json
{
  "message": "Order not found"
}
```

### Cancel an Order

Cancels a pending order and restores inventory.

**URL:** `POST /api/orders/:id/cancel`

**Response (200 OK):**
```json
{
  "message": "Order cancelled successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Failed to cancel order",
  "error": "Only pending orders can be cancelled"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Failed to cancel order",
  "error": "Order not found"
}
```
