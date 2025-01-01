import React, { useContext } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Folder, Plus } from "lucide-react";
import Link from "next/link";
import useAuth from "@/hooks/use-auth";
import useEmail, { EmailContext } from "@/hooks/use-mail-provider";
import { MailboxNode } from "@/types/emails";

export const MailSidebar = ({ className }: { className?: string }) => {
    const { userMailboxes } = useContext(EmailContext);

    const parseUserMailboxes = (): React.ReactNode => {
        if (!userMailboxes) return null;
        return (
            <div className="flex flex-col">
                {userMailboxes.folders.reduce(
                    (acc: React.ReactNode[], mailbox) => {
                        if (mailbox.path === "[Gmail]") {
                            // treat this folder differently
                            for (const m of mailbox.folders) {
                                acc.push(
                                    <SidebarMailbox node={m} key={m.path} />
                                );
                            }
                        } else {
                            acc.push(
                                <SidebarMailbox
                                    node={mailbox}
                                    key={mailbox.path}
                                />
                            );
                        }
                        return acc;
                    },
                    []
                )}
            </div>
        );
    };

    return (
        <div className={className}>
            {userMailboxes !== null && (
                <Sidebar>
                    <SidebarHeader>
                        <UserSidebarHeader />
                        <ComposeButton />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>
                                <span>Mailboxes</span>
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {parseUserMailboxes()}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            )}
        </div>
    );
};

const UserSidebarHeader = () => {
    const { auth } = useAuth();
    // TODO: Add user avatar
    return (
        auth.user !== null &&
        auth.access_token !== null && (
            <div className="flex items-center gap-2 px-4 py-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {auth.user.user_metadata.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {auth.user.email}
                    </p>
                </div>
            </div>
        )
    );
};

const ComposeButton = () => {
    // TODO: Add logic
    return (
        <div className="px-2 py-2">
            <Button className="w-full justify-start gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Compose
            </Button>
        </div>
    );
};

const SidebarMailbox = ({ node }: { node: MailboxNode }) => {
    const { currentMailbox, setCurrentMailbox } = useEmail();

    const mailboxIsActive = () => {
        return currentMailbox?.href === undefined
            ? false
            : currentMailbox.href === node.href;
    };

    const handleOnClick = () => {
        if (currentMailbox === null || node.href !== currentMailbox.href)
            setCurrentMailbox(node);
    };

    const childrens = () => {
        return (
            node.folders &&
            node.folders.length > 0 && (
                <div className="flex flex-col pl-4">
                    {node.folders.reduce((acc: React.ReactNode[], mailbox) => {
                        acc.push(
                            <SidebarMailbox node={mailbox} key={mailbox.path} />
                        );
                        return acc;
                    }, [])}
                </div>
            )
        );
    };

    return (
        <div className="flex flex-col">
            <SidebarMenuItem className="h-7">
                <SidebarMenuButton asChild isActive={mailboxIsActive()}>
                    <Link href={`/mail/${node.href}`} onClick={handleOnClick}>
                        <Folder />
                        <span className="text-sm">{node.name}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {childrens()}
        </div>
    );
};
