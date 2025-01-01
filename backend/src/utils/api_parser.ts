import express from "express";
import { HTTPError } from "../shared/error";

export const parseQuery = (
    req: express.Request
): { limit: number | null; offset: number | null; error: null | HTTPError } => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
    const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : null;
    let error = null;
    if (limit === null || offset === null)
        error = new HTTPError("missing limit or offset", 400);
    return { limit, offset, error };
};
