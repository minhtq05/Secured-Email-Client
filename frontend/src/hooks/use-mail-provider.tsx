import { ListTreeResponse } from "imapflow";
import React, { createContext, useContext, useState } from "react";
import { Email, MailboxNode } from "@/types/emails";
import { useMailboxes, useMailboxEmails } from "./use-mailboxes";
import { useUserCurrentEmail } from "./use-user-emails";
import { prefetchDNS } from "react-dom";

export type MailboxCache = {
    mailboxes: MailboxNode; // must be root
    lastSync: number;
};

export enum Status {
    IsLoading = "loading",
    Completed = "Completed",
}

export type EmailCache = {
    mailbox: string;
    emails: Email[];
    status: Status;
    lastSync: number;
};

export type EmailDirectory = Map<string, EmailCache>;

interface MailContextProps {
    currentMailbox: MailboxNode | null;
    setCurrentMailbox: React.Dispatch<React.SetStateAction<MailboxNode | null>>;
    currentEmail: Email | null;
    setCurrentEmail: React.Dispatch<React.SetStateAction<Email | null>>;
    allEmails: EmailDirectory;
    currentMailboxEmails: EmailCache | null;
    setCurrentMailboxEmails: React.Dispatch<
        React.SetStateAction<EmailCache | null>
    >;
    userMailboxes: MailboxNode | null;
}

// TODO: Fix the rest of context hooks to fetch data during app startup

export const EmailContext = createContext<MailContextProps>(null!);

const useEmail = () => {
    const context = useContext(EmailContext);
    return context;
};

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentMailbox, setCurrentMailbox] = useState<MailboxNode | null>(
        null
    );
    const [currentMailboxEmails, setCurrentMailboxEmails] =
        useState<EmailCache | null>(null); // null at startup
    const [userMailboxes, setUserMailboxes] = useState<MailboxNode | null>(
        null
    );
    const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
    const [allEmails, setAllEmails] = useState(new Map());

    const handleAddMailboxEmails = (emails: EmailCache) => {
        setAllEmails((prev: EmailDirectory) => {
            const mailbox = emails.mailbox;
            const ref = prev.get(mailbox) || null;
            if (
                ref === null ||
                ref.lastSync < emails.lastSync ||
                ref.status !== emails.status
            ) {
                const newMap = new Map(prev);
                newMap.set(emails.mailbox, emails);
                return newMap;
            }
            return prev;
        });
    };

    // () => {
    //     if (currentMailboxEmails === null) return allEmailsRef.current; // init
    //     const mailbox = currentMailboxEmails.mailbox;
    //     if (
    //         !allEmailsRef.current.has(mailbox) ||
    //         Date.now() - allEmailsRef.current.get(mailbox)!.lastSync >
    //             60 * 60 * 1000
    //     ) {
    //         const newMap: EmailDirectory = new Map(allEmailsRef.current);
    //         allEmailsRef.current = newMap;
    //         newMap.set(mailbox, currentMailboxEmails);
    //         return newMap;
    //     }
    //     return allEmailsRef.current;
    // }, [currentMailboxEmails]);

    useMailboxes(setCurrentMailbox, setUserMailboxes); // managing mailboxes at startup
    useMailboxEmails(
        allEmails,
        handleAddMailboxEmails,
        currentMailbox,
        setCurrentMailboxEmails
    ); // managing mailboxes emails, especially when user choose a new mailbox
    useUserCurrentEmail(currentEmail); // changing url params

    return (
        <EmailContext.Provider
            value={{
                currentMailbox,
                setCurrentMailbox,
                currentEmail,
                setCurrentEmail,
                userMailboxes,
                allEmails,
                currentMailboxEmails,
                setCurrentMailboxEmails,
            }}
        >
            {children}
        </EmailContext.Provider>
    );
};

export default useEmail;
