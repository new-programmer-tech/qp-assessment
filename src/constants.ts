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

interface AdminInput {
  username: string;
  email: string;
  password: string;
}

export { User, OrderItem ,AdminInput};
