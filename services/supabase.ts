import { createClient } from '@supabase/supabase-js';
import { Product, Order, OrderStats } from '../types';

// NOTE: In a real scenario, these would come from process.env
// For this demo, we will check if they exist, otherwise use Mock Data mode
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Mock Data for demonstration purposes if Supabase is not connected
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Chemise Oxford Blanche', price: 15000, category: 'Chemises', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Pantalon Chino Beige', price: 12000, category: 'Pantalons', image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'T-shirt Noir Premium', price: 5000, category: 'T-shirts', image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Veste Jean Denim', price: 25000, category: 'Vestes', image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'Short Cargo Kaki', price: 8000, category: 'Shorts', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '6', name: 'Polo Bleu Marine', price: 9000, category: 'T-shirts', image_url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

let MOCK_ORDERS: Order[] = [
  {
    id: '1001',
    customer_phone: '0707070707',
    customer_city: 'Abidjan',
    customer_address: 'Cocody Riviera 2',
    total_amount: 16500,
    delivery_fee: 1500,
    items: [{ ...MOCK_PRODUCTS[0], quantity: 1 }],
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

// Service Layer
export const api = {
  getProducts: async (): Promise<Product[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data || [];
    }
    // Return mock data with a slight delay to simulate network
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 500));
  },

  createOrder: async (order: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order> => {
    if (supabase) {
      const { data, error } = await supabase.from('orders').insert([order]).select().single();
      if (error) throw error;
      return data;
    }
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    MOCK_ORDERS.unshift(newOrder);
    return new Promise((resolve) => setTimeout(() => resolve(newOrder), 800));
  },

  getOrders: async (): Promise<Order[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ORDERS), 500));
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    if (supabase) {
      const { data, error } = await supabase.from('products').insert([product]).select().single();
      if (error) throw error;
      return data;
    }
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    MOCK_PRODUCTS.push(newProduct);
    return new Promise((resolve) => setTimeout(() => resolve(newProduct), 500));
  },

  getStats: async (): Promise<OrderStats> => {
    // In a real supabase app, you might write a Postgres function or do client-side aggregation
    const orders = await api.getOrders();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total_amount, 0);
    
    // Mock monthly data for chart
    const monthlyRevenue = [
      { name: 'Jan', value: 150000 },
      { name: 'Fév', value: 230000 },
      { name: 'Mar', value: 180000 },
      { name: 'Avr', value: totalRevenue },
    ];

    return { totalOrders, totalRevenue, monthlyRevenue };
  }
};