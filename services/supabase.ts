import { createClient } from '@supabase/supabase-js';
import { Product, Order, OrderStats } from '../types';

const SUPABASE_URL = 'https://aginojasznmezgyekayp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaW5vamFzem5tZXpneWVrYXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzkwMDcsImV4cCI6MjA4MDM1NTAwN30.uieHMjDaNM319PnIW8KBUN5vTrjaXdxlNO_MFY0YaCU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service Layer
export const api = {
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data || [];
  },

  createOrder: async (order: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order> => {
    const { data, error } = await supabase.from('orders').insert([order]).select().single();
    if (error) throw error;
    return data;
  },

  getOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data || [];
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) throw error;
    return data;
  },

  getStats: async (): Promise<OrderStats> => {
    const { data: orders, error } = await supabase.from('orders').select('total_amount, created_at');
    
    if (error || !orders) {
      return { totalOrders: 0, totalRevenue: 0, monthlyRevenue: [] };
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
    
    // Monthly aggregation
    const monthlyData: Record<string, number> = {};
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    orders.forEach(order => {
      if (order.created_at) {
        const d = new Date(order.created_at);
        const monthName = monthNames[d.getMonth()];
        monthlyData[monthName] = (monthlyData[monthName] || 0) + order.total_amount;
      }
    });

    // Ensure we have at least the current month if empty
    if (Object.keys(monthlyData).length === 0) {
      const currentMonth = monthNames[new Date().getMonth()];
      monthlyData[currentMonth] = 0;
    }

    const monthlyRevenue = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));

    return { totalOrders, totalRevenue, monthlyRevenue };
  }
};