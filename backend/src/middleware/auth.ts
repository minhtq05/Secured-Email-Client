import express from "express";

const validate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.send({ error: "no auth header" });
        return;
    }

    next();
};

export { validate };
