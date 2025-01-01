import express from "express";
import { supabasePublic } from "../shared/supabase";
import { getGoogleOauthToken } from "./auth";
import { ImapFlow } from "imapflow";
import { Config, ImapClientEntry } from "../types/emails";
import { HTTPError } from "../shared/error";

const clientCache = new Map<string, ImapClientEntry>();

export async function createImapClient(
    username: string,
    config: Config
): Promise<ImapFlow> {
    const client = new ImapFlow(config);
    await client.connect();
    clientCache.set(username, { client, lastUsed: Date.now() });
    return client;
}

export async function getImapClient(
    id: string,
    config: Config
): Promise<ImapFlow> {
    if (clientCache.has(id)) {
        const entry = clientCache.get(id)!;
        entry.lastUsed = Date.now();
        return entry.client;
    }
    return await createImapClient(id, config);
}

export const getClientFromToken = async (
    token: string
): Promise<{ imapClient: ImapFlow | null; error: null | HTTPError }> => {
    const {
        data: { user },
        error: authError,
    } = await supabasePublic.auth.getUser(token);

    if (authError !== null || user === null) {
        return {
            imapClient: null,
            error: new HTTPError("invalid credentials", 400),
        };
    }

    const {
        data: { access_token },
        error,
    } = await getGoogleOauthToken(user.id);

    if (error !== null) {
        return {
            imapClient: null,
            error: new HTTPError("invalid credentials", 400),
        };
    }

    const imapClient = await getImapClient(user.id, {
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: user.email as string,
            accessToken: access_token as string,
        },
        logger: false,
    });

    return { imapClient, error: null };
};
