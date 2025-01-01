import express from "express";
import { getJWTToken } from "../utils/auth";
import EmailsService from "../service/emails.service";
import { parseQuery } from "../utils/api_parser";

const getMailboxes = async (req: express.Request, res: express.Response) => {
    const token = getJWTToken(req);
    const { data, error } = await EmailsService.getMailboxes(token);
    if (error) {
        res.statusCode = error.statusCode;
        res.send(error.message);
        return;
    }

    res.statusCode = 200;
    res.send(data);
};

const getMailboxEmails = async (
    req: express.Request,
    res: express.Response
) => {
    if (!req.query.mailbox) {
        res.statusCode = 400;
        res.send("no mailbox specified");
        return;
    }

    const { limit, offset, error: reqError } = parseQuery(req);
    if (reqError !== null || limit === null || offset === null) {
        res.statusCode = reqError!.statusCode;
        res.send(reqError!.message || "internal server error");
    }

    const token = getJWTToken(req);
    const mailboxPath = decodeURIComponent(req.query.mailbox as string);

    const { data, error } = await EmailsService.getMailboxEmails(
        token,
        mailboxPath,
        limit!,
        offset!
    );

    if (error) {
        res.statusCode = error.statusCode;
        res.send(error.message);
    }

    res.statusCode = 200;
    res.send(data);
};

const Emails = {
    getMailboxes,
    getMailboxEmails,
};

export default Emails;
