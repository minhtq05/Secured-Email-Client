import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env.local"),
});

export const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
);

export const supabasePrivate = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
);
