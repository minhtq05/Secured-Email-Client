"use server";

import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const {
            data: { session },
            error,
        } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (session) {
                const { error } = await supabase
                    .from("user_tokens")
                    .insert({
                        id: session.user.id,
                        access_token: session.provider_token,
                        token_type: session.token_type,
                        refresh_token: session.provider_refresh_token,
                        expires_in: session.expires_in,
                        expires_at: session.expires_at,
                    })
                    .eq("id", session.user.id);
                if (error) {
                    if (error.message.startsWith("duplicate")) {
                        const { error } = await supabase
                            .from("user_tokens")
                            .update({
                                id: session.user.id,
                                access_token: session.provider_token,
                                token_type: session.token_type,
                                refresh_token: session.provider_refresh_token,
                                expires_in: session.expires_in,
                                expires_at: session.expires_at,
                            })
                            .eq("id", session.user.id);
                        if (error) {
                            return NextResponse.redirect(
                                `${origin}/auth/auth-token-error`
                            );
                        }
                    } else {
                        return NextResponse.redirect(
                            `${origin}/auth/auth-token-error`
                        );
                    }
                }
            }

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
