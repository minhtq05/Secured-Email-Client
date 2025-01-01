import { EmailContext, Status } from "@/hooks/use-mail-provider";
import React, { useContext } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";
import { MailCard } from "./mail-card";
import { MailViewBox } from "./mail-display";
import { Separator } from "./ui/separator";
import { Loader, LoaderCircle } from "lucide-react";

const Mailbox = () => {
    const { currentMailbox, currentMailboxEmails, currentEmail } =
        useContext(EmailContext);

    return (
        <div className="w-full flex flex-row h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={25}>
                    <div className="w-full flex flex-col h-screen overflow-y-scroll">
                        <div className="sticky top-0 py-2 px-3 bg-white dark:bg-dark text-xl font-bold item-center block shadow border-0">
                            {currentMailbox?.name}
                        </div>
                        <Separator />
                        {currentMailboxEmails?.status === Status.IsLoading && (
                            <div className="flex flex-row gap-1 p-1">
                                <LoaderCircle className="animate-spin duration-1000" />
                                Syncing...
                            </div>
                        )}
                        <div className="flex flex-col gap-y-2 p-2 w-full">
                            {currentMailboxEmails !== null &&
                                currentMailboxEmails.emails.map(
                                    (email, index) => (
                                        <MailCard email={email} key={index} />
                                    )
                                )}
                        </div>
                    </div>
                </ResizablePanel>
                {currentEmail !== null && (
                    <>
                        <ResizableHandle />
                        <ResizablePanel minSize={25}>
                            <MailViewBox email={currentEmail} />
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
};

export default Mailbox;
