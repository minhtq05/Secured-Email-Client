export type Email = {
    id: string;
    from: { name: string; address: string };
    to: string;
    subject: string;
    body: string | null;
    date: string;
};

export type MailboxNode = {
    path: string; // for browser
    name: string;
    specialUse?: string;
    folders: MailboxNode[];
    href: string; // for server side
};
