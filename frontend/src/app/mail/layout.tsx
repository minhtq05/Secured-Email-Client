"use client";

import { MailSidebar } from "@/components/mail-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import useAuth, { AuthProvider } from "@/hooks/use-auth";
import { MailProvider } from "@/hooks/use-mail";
import { ThemeProvider } from "@/hooks/use-theme";
import Modal from "react-modal";
import { AuthenticationWrapper } from "@/components/wrapper";

Modal.setAppElement("#root");

const MailLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en">
            <body id="root" suppressHydrationWarning>
                <ThemeProvider>
                    <AuthProvider>
                        <SidebarProvider>
                            <MailProvider>
                                <AuthenticationWrapper>
                                    <div className="flex flex-row w-full">
                                        <MailSidebar />
                                        {children}
                                    </div>
                                </AuthenticationWrapper>
                            </MailProvider>
                        </SidebarProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default MailLayout;
