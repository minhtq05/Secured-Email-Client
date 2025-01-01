import express from "express";
import { HTTPError } from "../shared/error";
import { getClientFromToken } from "../utils/emails";

const getMailboxes = async (
    token: string
): Promise<{ data: any | null; error: null | HTTPError }> => {
    const { imapClient, error } = await getClientFromToken(token);

    if (error !== null || imapClient === null) {
        return {
            data: null,
            error: new HTTPError("internal server error", 500),
        };
    }

    const tree = await imapClient.listTree();

    return { data: tree, error: null };
};

const getMailboxEmails = async (
    token: string,
    mailboxPath: string,
    limit: number,
    offset: number
): Promise<{ data: any | null; error: null | HTTPError }> => {
    const { imapClient, error } = await getClientFromToken(token);

    if (error !== null || imapClient === null) {
        return {
            data: null,
            error: new HTTPError("internal server error", 500),
        };
    }

    try {
        const mailbox = await imapClient.mailboxOpen(mailboxPath);
        // const messages = await imapClient.fetchAll("1:30", {
        //     uid: true,
        //     envelope: true,
        // });
        const start = performance.now();

        const messages = await imapClient.fetchAll(
            `${Math.max(1, mailbox.exists - offset)}:${Math.max(
                1,
                mailbox.exists - offset - limit + 1
            )}`,
            {
                uid: true,
                envelope: true,
                bodyParts: ["0", "1"],
            }
        );

        messages.reverse();

        const end = performance.now();
        console.log(`Took ${end - start} ms`);

        return {
            data: messages.map((msg) => ({
                uid: msg.uid,
                envelope: msg.envelope,
            })),
            error: null,
        };
    } catch (error) {
        console.log(error);
        return {
            data: null,
            error: new HTTPError("internal server error", 500),
        };
    }
};

const EmailsService = {
    getMailboxes,
    getMailboxEmails,
};

export default EmailsService;
