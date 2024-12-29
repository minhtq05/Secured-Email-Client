"use client";

import { MailCard } from "@/components/mail-card";
import { MailViewBox } from "@/components/mail-viewbox";
import useMail from "@/hooks/use-mail";
import useMailbox from "@/hooks/use-mailbox";
import React from "react";

const Mailbox = () => {
    const { selectedMailbox, selectedEmail } = useMail();
    const { emails } = useMailbox();

    return (
        <div className="w-full flex flex-row">
            <div className="w-full flex flex-col">
                <p>{selectedMailbox && selectedMailbox.name}</p>
                <div className="flex flex-col gap-y-2 p-2 w-full">
                    {emails.map((email, index) => (
                        <MailCard email={email} key={index} />
                    ))}
                </div>
            </div>
            {selectedEmail !== null && <MailViewBox email={selectedEmail} />}
        </div>
    );
};

export default Mailbox;
