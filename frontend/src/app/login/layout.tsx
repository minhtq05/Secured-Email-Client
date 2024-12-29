import React from "react";

const Layout = ({ children }: { children: Readonly<React.ReactNode> }) => {
    return (
        <html lang="en">
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
};

export default Layout;
