"use client";

import { Email, MailboxNode } from "@/types/emails";
import { useEffect } from "react";
import useAxiosPrivate from "./use-axios";
import { FetchMessageObject, ListTreeResponse } from "imapflow";
import { apiParser } from "@/utils/api/api-parser";
import toast from "react-hot-toast";
import { EmailCache, EmailDirectory, Status } from "./use-mail-provider";
import { useRouter } from "next/navigation";
import useAuth from "./use-auth";

const parseMailboxHref = (node: ListTreeResponse): string => {
    if (node.root) return "root";
    if (
        node.path.startsWith("[Gmail]") ||
        (node.specialUse && node.specialUse.startsWith("\\"))
    ) {
        return encodeURIComponent(node.path.replace("[Gmail]/", ""))
            .replace("%20", "+")
            .toLowerCase();
    } else {
        return `folder/${encodeURIComponent(
            node.path.replace("[Gmail]/", "")
        ).replace("%20", "+")}`;
    }
};

const parseTree = (node: ListTreeResponse): MailboxNode => {
    return {
        path: node.path, // initial path, for querying with api server
        name: node.name === "INBOX" ? "Inbox" : node.name,
        specialUse: node.specialUse,
        folders: node.folders?.map((node: ListTreeResponse) => parseTree(node)),
        href: parseMailboxHref(node), // for displaying in client
    };
};

// should only be used by EmailProvider
export const useMailboxes = (
    setCurrentMailbox: React.Dispatch<React.SetStateAction<MailboxNode | null>>,
    setUserMailboxes: React.Dispatch<React.SetStateAction<MailboxNode | null>>
) => {
    const { auth } = useAuth();
    // const { get, set } = useLocalStorage();
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (auth.user !== null) {
            const toastId = toast.loading("fetching mailboxes");
            axiosPrivate
                .get("/api/mail/mailboxes")
                .then((res) => {
                    setUserMailboxes(parseTree(res.data));
                    setCurrentMailbox(
                        res.data.folders.find(
                            (mailbox: MailboxNode) => mailbox.path === "INBOX"
                        )
                    );
                    toast.success("mailboxes loaded", { id: toastId });
                    router.replace("/mail/inbox");
                    // set("mailboxes", parseTree(res.data)).catch((err) =>
                    //     console.error("cannot save mailboxes:", err)
                    // );
                })
                .catch((err) => {
                    toast.error("unable to fetch mailboxes", { id: toastId });
                });
        }
    }, [auth]);

    // useEffect(() => {
    //     get("mailboxes", null).then((res: MailboxNode | null) => {
    //         if (res !== null) setUserMailboxes(res);

    //         setCurrentMailbox(
    //             res.folders?.find((mailbox) => mailbox.path === "INBOX") || null
    //         );
    //         router.replace("/mail/inbox");
    //     });
    // }, []);
};

// should only be used by EmailProvider
export const useMailboxEmails = (
    allEmails: EmailDirectory,
    handleAddMailboxEmails: (emails: EmailCache) => void,
    currentMailbox: MailboxNode | null,
    setCurrentMailboxEmails: React.Dispatch<
        React.SetStateAction<EmailCache | null>
    >
) => {
    const axiosPrivate = useAxiosPrivate();

    const handleFetchEmails = async (mailbox: string): Promise<EmailCache> => {
        const toastId = toast.loading(`fetching new emails from ${mailbox}`);
        const params = apiParser({
            mailbox: mailbox,
            offset: 0,
            limit: 50,
        });
        const lastSync = Date.now();
        return axiosPrivate
            .get(`/api/mail`, { params })
            .then((res) => {
                toast.success(`success loading emails from ${mailbox}`, {
                    id: toastId,
                });
                return {
                    mailbox: mailbox,
                    emails: res.data.map((msg: FetchMessageObject) => ({
                        id: msg.uid,
                        date: msg.envelope.date,
                        from: msg.envelope.from[0],
                        to: msg.envelope.to,
                        subject: msg.envelope.subject,
                        body: "",
                    })),
                    status: Status.Completed,
                    lastSync: lastSync,
                };
            })
            .catch(() => {
                toast.error(
                    `cannot fetch new emails from mailbox '${mailbox}'`,
                    { id: toastId }
                );
                throw Error(
                    `cannot fetch new emails from mailbox '${mailbox}'`
                );
            });
    };

    const updateEmails = async (mailbox: string) => {
        if (!allEmails.has(mailbox)) {
            const emails = {
                mailbox: mailbox,
                emails: [],
                lastSync: Date.now(),
                status: Status.IsLoading,
            };
            handleAddMailboxEmails(emails);
            handleFetchEmails(mailbox).then((res) => {
                handleAddMailboxEmails(res);
            });
            return;
        }
        const { lastSync, status } = allEmails.get(mailbox) as EmailCache;
        if (status === Status.IsLoading) return;
        if (Date.now() - lastSync > 60 * 60 * 1000) {
            handleFetchEmails(mailbox).then((res) => {
                handleAddMailboxEmails(res);
            });
        }
    };

    useEffect(() => {
        if (currentMailbox !== null) {
            const mailbox = currentMailbox.path;
            updateEmails(mailbox);
            if (allEmails.has(mailbox)) {
                setCurrentMailboxEmails(allEmails.get(mailbox)!);
            }
            // TODO: find a way to only fetch when the mailbox is outdated
        }
    }, [currentMailbox, allEmails]);

    useEffect(() => {
        console.log("fetch email");
    }, [allEmails]);
};
