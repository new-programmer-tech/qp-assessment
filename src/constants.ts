interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface OrderItem {
  grocery_item_id: number;
  quantity: number;
}

export { User, OrderItem };
