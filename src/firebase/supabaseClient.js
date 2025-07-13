// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://YOUR_PROJECT.supabase.co"; // Replace this
const supabaseKey = "YOUR_ANON_PUBLIC_KEY"; // Replace this

export const supabase = createClient(supabaseUrl, supabaseKey);
