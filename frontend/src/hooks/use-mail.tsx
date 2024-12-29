import { ListTreeResponse } from "imapflow";
import { createContext, useContext, useEffect, useState } from "react";
import useAxiosPrivate from "./use-axios";
import useAuth from "./use-auth";
import useLocalStorage from "./use-local-storage";
import { Email, MailboxNode } from "@/types/emails";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

interface MailContextProps {
    selectedMailbox: MailboxNode | null;
    setSelectedMailbox: React.Dispatch<
        React.SetStateAction<MailboxNode | null>
    >;
    selectedEmail: Email | null;
    setSelectedEmail: React.Dispatch<React.SetStateAction<Email | null>>;
    mailboxes: MailboxNode | null;
}

const MailContext = createContext<MailContextProps>(null!);

const useMail = () => {
    return useContext(MailContext);
};

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
        return (
            "folder/" +
            encodeURIComponent(node.path.replace("[Gmail]/", "")).replace(
                "%20",
                "+"
            )
        );
    }
};

const parseTree = (node: ListTreeResponse): MailboxNode => {
    return {
        path: node.path,
        name: node.name === "INBOX" ? "Inbox" : node.name,
        specialUse: node.specialUse,
        folders: node.folders?.map((node: ListTreeResponse) => parseTree(node)),
        href: parseMailboxHref(node),
    };
};

export const MailProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedMailbox, setSelectedMailbox] = useState<MailboxNode | null>(
        null
    );
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [mailboxes, setMailboxes] = useState<MailboxNode | null>(null);
    const axiosPrivate = useAxiosPrivate();
    const { get, set } = useLocalStorage();
    const { auth } = useAuth();
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (selectedEmail !== null) {
            const newSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            newSearchParams.set("id", selectedEmail.id);
            router.push(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            });
        } else if (searchParams.has("id")) {
            const newSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            newSearchParams.delete("id");
            router.push(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            });
        }
    }, [selectedEmail]);

    useEffect(() => {
        get("mailboxes", []).then((res: MailboxNode) => {
            setMailboxes(res);
            if (params?.mailbox as string) {
                setSelectedMailbox(
                    res.folders?.find((mailbox) => mailbox.path === "INBOX") ||
                        null
                );
            }
        });
    }, []);

    useEffect(() => {
        if (auth?.access_token)
            axiosPrivate.get("/api/mail/mailboxes").then((res) => {
                setMailboxes(parseTree(res.data));
                set("mailboxes", res.data).catch((err) =>
                    console.error("cannot save mailboxes:", err)
                );
            });
    }, [auth]);

    return (
        <MailContext.Provider
            value={{
                selectedMailbox: selectedMailbox,
                setSelectedMailbox: setSelectedMailbox,
                selectedEmail: selectedEmail,
                setSelectedEmail: setSelectedEmail,
                mailboxes,
            }}
        >
            {children}
        </MailContext.Provider>
    );
};

export default useMail;
