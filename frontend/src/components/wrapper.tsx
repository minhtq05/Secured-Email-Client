"use client";

import useAuth from "@/hooks/use-auth";
import React from "react";

export const AuthenticationWrapper = ({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element => {
    const { auth } = useAuth();

    return auth.user !== null && auth.access_token !== null ? (
        <div className="w-full h-full">{children}</div>
    ) : (
        <div className="flex flex-col h-screen w-screen items-center justify-center">
            <p className="text-xl font-bold">Authenticating...</p>
        </div>
    );
};
