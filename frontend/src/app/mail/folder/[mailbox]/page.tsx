"use client";

import { MailCard } from "@/components/mail-card";

import useMail from "@/hooks/use-mail";
import useMailbox from "@/hooks/use-mailbox";
import React from "react";

const MailboxFolder = () => {
    const { selectedMailbox } = useMail();
    const { emails } = useMailbox();

    return (
        <div className="w-full">
            <p>{selectedMailbox && selectedMailbox.name}</p>
            <div className="flex flex-col gap-y-2 p-2 w-full">
                {emails.map((email, index) => (
                    <MailCard email={email} key={index} />
                ))}
            </div>
        </div>
    );
};

export default MailboxFolder;
