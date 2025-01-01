import express from "express";
import { checkHealth } from "../controller/health.controller";

const healthRouter = express.Router();

healthRouter.get("/api/health", checkHealth);

export default healthRouter;
