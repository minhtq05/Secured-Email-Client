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
import useMail from "@/hooks/use-mail";
import { MailboxNode } from "@/types/emails";

export const MailSidebar = ({ className }: { className?: string }) => {
    const { auth } = useAuth();
    const { mailboxes } = useMail();

    return (
        <div className={className}>
            {auth.user !== null &&
                auth.access_token !== null &&
                mailboxes !== null && (
                    <Sidebar>
                        <SidebarHeader>
                            <div className="flex items-center gap-2 px-4 py-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src="/placeholder.svg"
                                        alt="User"
                                    />
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
                            <div className="px-2 py-2">
                                <Button
                                    className="w-full justify-start gap-2"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Compose
                                </Button>
                            </div>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>
                                    <span>Mailboxes</span>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <div className="flex flex-col">
                                            {mailboxes.folders &&
                                                mailboxes.folders.reduce(
                                                    (
                                                        acc: React.ReactNode[],
                                                        mailbox
                                                    ) => {
                                                        if (
                                                            mailbox.path ===
                                                            "[Gmail]"
                                                        ) {
                                                            for (const m of mailbox.folders) {
                                                                acc.push(
                                                                    <SidebarMailbox
                                                                        node={m}
                                                                        key={
                                                                            m.path
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        } else {
                                                            acc.push(
                                                                <SidebarMailbox
                                                                    node={
                                                                        mailbox
                                                                    }
                                                                    key={
                                                                        mailbox.path
                                                                    }
                                                                />
                                                            );
                                                        }
                                                        return acc;
                                                    },
                                                    []
                                                )}
                                        </div>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                )}
        </div>
    );
};

const SidebarMailbox = ({ node }: { node: MailboxNode }) => {
    const { selectedMailbox, setSelectedMailbox } = useMail();

    return (
        <div className="flex flex-col">
            <SidebarMenuItem className="h-7">
                <SidebarMenuButton
                    asChild
                    isActive={
                        selectedMailbox?.href === undefined
                            ? false
                            : selectedMailbox.href === node.href
                    }
                >
                    <Link
                        href={`/mail/${node.href}`}
                        onClick={() => setSelectedMailbox(node)}
                    >
                        <Folder />
                        <span className="text-sm">{node.name}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {node.folders && node.folders.length > 0 && (
                <div className="flex flex-col pl-4">
                    {node.folders.reduce((acc: React.ReactNode[], mailbox) => {
                        acc.push(
                            <SidebarMailbox node={mailbox} key={mailbox.path} />
                        );
                        return acc;
                    }, [])}
                </div>
            )}
        </div>
    );
};
