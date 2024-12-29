"use client";

import React, { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
    theme: "dark",
    setTheme: (theme: string) => {},
});

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState("dark");

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: (theme: string) => {
                    setTheme(theme);
                },
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default useTheme;
