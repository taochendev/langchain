import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey || 
    supabaseUrl.includes('your_supabase_url_here') || 
    supabaseServiceKey.includes('your_supabase_service_key_here')) {
  console.error('❌ Missing or invalid Supabase environment variables!');
  console.error('Please update your backend/.env file with real Supabase values:');
  console.error('- SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('- SUPABASE_SERVICE_KEY=your-actual-service-key');
  console.error('\nGet these values from: https://supabase.com/dashboard/project/[your-project]/settings/api');
  process.exit(1);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;
