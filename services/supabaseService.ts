import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Create client with fallback values to prevent build errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

// Types for our database
export interface User {
  id: string;
  email: string;
  created_at: string;
  plan: string;
  credits: number;
  drafts: number;
}

export interface Flyer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  style_key: string;
  aspect_ratio: string;
  media_type: string;
  image_quality: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPlan {
  id: string;
  name: string;
  price: number;
  credits_hd: number | string; // Can be number or string (TEXT in DB)
  drafts: number | string; // Can be number or string
  features: string[];
}