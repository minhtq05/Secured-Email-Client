import express from "express";
import EmailsController from "../controller/emails.controller";

const emailRouter = express.Router();

emailRouter.get("/api/mail/mailboxes", EmailsController.getMailboxes);
emailRouter.get("/api/mail/", EmailsController.getMailboxEmails);

export default emailRouter;
