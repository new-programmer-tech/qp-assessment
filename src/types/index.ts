export interface GroceryItem {
  id: number;
  name: string;
  price: number;
  inventory: number;
  description?: string;
  category?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface OrderItem {
  groceryItemId: number;
  quantity: number;
  priceAtTime: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
}