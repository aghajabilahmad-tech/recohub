import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  streak: number;
  level: number;
  created_at: string;
};

export type SavedRecommendation = {
  id: string;
  category: string;
  title: string;
  snippet: string;
  created_at: string;
};
