import { createClient } from "@supabase/supabase-js";

// Server-only: never exposed to browser. Requires SUPABASE_SERVICE_ROLE_KEY in env.
const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin = createClient(url, serviceRole);
