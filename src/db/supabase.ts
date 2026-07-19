import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://oagblhsrmojwltlefcom.supabase.co";
// Clean up the URL if it has the "/rest/v1/" suffix so the SDK works correctly
const cleanSupabaseUrl = supabaseUrl.endsWith("/rest/v1/") 
  ? supabaseUrl.substring(0, supabaseUrl.length - 9) 
  : supabaseUrl;

// Service Role Key bypasses RLS, making it perfect for secure backend queries.
// Ensure it's a valid JWT (starts with 'eyJ') before using it.
const rawServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseServiceRoleKey = (rawServiceRoleKey && rawServiceRoleKey.trim().startsWith("eyJ"))
  ? rawServiceRoleKey.trim()
  : undefined;

const rawAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseAnonKey = (rawAnonKey && (rawAnonKey.trim().startsWith("eyJ") || rawAnonKey.trim().startsWith("sb_")))
  ? rawAnonKey.trim()
  : "sb_publishable_JTqNEDtLXD-zzr_HIxfVmQ_VJ7cu49s";

const apiKeyToUse = supabaseServiceRoleKey || supabaseAnonKey;
const usingServiceRole = !!supabaseServiceRoleKey;

// App Signature sent to satisfy RLS policy custom check in case we are using the Anon Key.
// If the app signature is missing, or is mistakenly set to the same value as the anon key, 
// fall back to the default signature to ensure compatibility with our SQL schema policies.
const rawAppSignature = process.env.SUPABASE_APP_SIGNATURE;
const appSignature = (rawAppSignature && rawAppSignature.trim() !== "" && rawAppSignature.trim() !== supabaseAnonKey)
  ? rawAppSignature.trim()
  : "default-secret-signature-123456";

export const supabase = createClient(cleanSupabaseUrl, apiKeyToUse, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      "x-app-signature": appSignature,
    },
  },
});

if (usingServiceRole) {
  console.log(`[Supabase] Initialized client with SERVICE_ROLE_KEY (bypassing RLS) targeting: ${cleanSupabaseUrl}`);
} else {
  console.log(`[Supabase] Initialized client with ANON_KEY & custom signature header targeting: ${cleanSupabaseUrl}`);
}
