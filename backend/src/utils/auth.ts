import express from "express";
import { supabasePrivate } from "../shared/supabase";
import { HTTPError } from "../shared/error";

export const getJWTToken = (req: express.Request) => {
    const auth = req.headers.authorization;
    return (auth as string).split(" ")[1];
};

export const getGoogleOauthToken = async (
    userId: string
): Promise<{ data: any | null; error: null | HTTPError }> => {
    const { data, error: queryError } = await supabasePrivate
        .from("user_tokens")
        .select("*")
        .eq("id", userId)
        .limit(1)
        .single();

    if (queryError !== null || data === null) {
        console.log(queryError);
        return {
            data: null,
            error: new HTTPError("unable to retrieve token", 500),
        };
    }

    if (data.expires_at < Date.now()) {
        const currentTime = Date.now();

        const { token, error } = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
                    refresh_token: data.refresh_token,
                    grant_type: "refresh_token",
                }),
            }
        )
            .then((res) => res.json())
            .then((data) => ({
                token: data,
                error: null,
            }))
            .catch((error) => ({
                token: null,
                error: error,
            }));

        if (error !== null) {
            return {
                data: null,
                error: new HTTPError("unable to refresh token", 500),
            };
        }

        const expires_at = currentTime + token.expires_in;
        const { error: updateError } = await supabasePrivate
            .from("user_tokens")
            .update({
                access_token: token.access_token,
                expires_in: token.expires_in,
                expires_at: expires_at,
            })
            .eq("id", userId);

        if (updateError !== null) {
            return {
                data: null,
                error: new HTTPError("unable to update token", 500),
            };
        }

        data.access_token = token.access_token;
    }

    return { data: data, error: null };
};
