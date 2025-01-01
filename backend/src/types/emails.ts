import { ImapFlow } from "imapflow";

export interface ImapClientEntry {
    client: ImapFlow;
    lastUsed: number; // timestamp for cleaning up unused clients
}

export type Config = {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        accessToken: string;
    };
    logger: any;
};
