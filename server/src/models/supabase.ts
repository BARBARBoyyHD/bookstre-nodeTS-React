import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string; // Ensure it's treated as a string
if (!supabaseKey) {
  throw new Error("SUPABASE_ANON_KEY is missing in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
