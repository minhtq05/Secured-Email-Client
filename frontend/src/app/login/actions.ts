"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/helpers";

export async function handleSignInWithGoogle() {
    const supabase = await createClient();

    const redirectUrl = getURL("/auth/callback");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
            scopes: "https://mail.google.com",
        },
    });

    if (error) {
        redirect("/error");
    }

    // revalidatePath("/", "layout");
    // redirect("/");
    return redirect(data.url);
}
