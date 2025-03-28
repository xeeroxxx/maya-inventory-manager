import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define type definitions for our database tables
export type Product = {
  id: number;
  serial_number: string;
  name: string;
  cost_price: number;
  shipping_cost: number;
  sales_fee: number;
  selling_price: number;
  created_at?: string;
  updated_at?: string;
};

export type Sale = {
  id: number;
  product_id: number;
  quantity_sold: number;
  date: string;
  total_revenue: number;
  profit: number;
  created_at?: string;
  updated_at?: string;
}; 