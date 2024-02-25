// Import the createClient method from the supabase-js library
import { createClient } from "@supabase/supabase-js";

// Create a single Supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export default supabase;
