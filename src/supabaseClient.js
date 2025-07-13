// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ibocbmitswzfxdgkofwe.supabase.co"; // Replace this
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlib2NibWl0c3d6ZnhkZ2tvZndlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTMwMjM4OCwiZXhwIjoyMDY2ODc4Mzg4fQ.U5yFvmn4EFlVlEI4jSJamfaskfbGeaZSNA0MCvhiCXM"; // Replace this

export const supabase = createClient(supabaseUrl, supabaseKey);
