import express from "express";

const checkHealth = async (req: express.Request, res: express.Response) => {
    res.json({
        status: "ok",
        version: "1.0.0",
        description: "Secured Email Client",
    });
};

export { checkHealth };
