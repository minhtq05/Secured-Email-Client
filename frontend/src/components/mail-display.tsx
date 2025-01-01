import { Email } from "@/types/emails";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import useEmail from "@/hooks/use-mail-provider";
import { Archive, ArchiveX, Cross, Mail, Trash, X } from "lucide-react";
import React from "react";

export const MailViewBox = ({ email }: { email: Email }) => {
    return (
        <div className="w-full flex flex-row">
            <div className="flex flex-col w-full">
                <div className="h-[44px] shadow flex flex-row justify-start items-center w-full p-2">
                    <MailToolbar />
                </div>
                <Separator />
                <MailContent email={email} />
            </div>
        </div>
    );
};

const MailToolbar = () => {
    const { setCurrentEmail } = useEmail();

    const BarButton = ({
        element,
        onClick,
    }: {
        element: React.ReactNode;
        onClick?: () => any;
    }) => {
        return (
            <Button variant="ghost" onClick={onClick}>
                {element}
            </Button>
        );
    };

    return (
        <>
            <div className="flex flex-row mr-auto">
                <BarButton element={<Archive />} />
                <BarButton element={<ArchiveX />} />
                <BarButton element={<Trash />} />
            </div>
            <BarButton element={<X />} onClick={() => setCurrentEmail(null)} />
        </>
    );
};

const MailContent = ({ email }: { email: Email }) => {
    return (
        <div className="p-2 gap-y-2">
            <div className="flex flex-row justify-between w-full">
                <h1 className="w-full text-xl text-wrap">{email.subject}</h1>
            </div>
            <p>
                {email.from.name} {`<${email.from.address}>`}
            </p>
            <p>{email.body}</p>
        </div>
    );
};
