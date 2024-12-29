import { handleGetSession } from "@/app/api/auth/get-session";
import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

type Auth = {
    user: User | null;
    access_token: string | null;
};

const AuthContext = createContext<{
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}>(null!);

const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<Auth>({
        user: null,
        access_token: null,
    });

    useEffect(() => {
        handleGetSession().then(({ user, access_token, error }) => {
            if (!error && user && access_token) {
                setAuth({ user, access_token });
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        return handleGetSession().then(({ access_token }) => {
            // TODO: handle case access_token is NULL
            setAuth((prev) => ({
                ...prev,
                access_token: access_token!,
            }));
            return access_token;
        });
    };

    return { refresh };
};

export default useAuth;
