export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  customer_name?: string; // Optional if we just want phone
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  total_amount: number;
  delivery_fee: number;
  items: CartItem[];
  status: 'pending' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { name: string; value: number }[];
}