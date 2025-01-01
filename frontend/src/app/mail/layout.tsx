"use client";

import { MailSidebar } from "@/components/mail-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { EmailProvider } from "@/hooks/use-mail-provider";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthenticationWrapper } from "@/components/wrappers";
import { Toaster } from "react-hot-toast";

const MailLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                <ProvidersWrapper>
                    <AuthenticationWrapper>
                        <div className="flex flex-row w-full">
                            <Toaster /> 
                            <MailSidebar />
                            {children}
                        </div>
                    </AuthenticationWrapper>
                </ProvidersWrapper>
            </body>
        </html>
    );
};

const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SidebarProvider>
                    <EmailProvider>{children}</EmailProvider>
                </SidebarProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default MailLayout;
