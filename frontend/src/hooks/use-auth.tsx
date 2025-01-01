import { handleGetSession } from "@/app/api/auth/get-session";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

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
            if (error === null && user !== null && access_token != null) {
                setAuth({ user, access_token });
            } else {
                toast.error(error);
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
    const router = useRouter();

    const refresh = async () => {
        return handleGetSession().then(({ access_token, error }) => {
            if (error !== null) {
                toast.error(error);
                router.push("/auth/auth-token-error");
                return;
            }
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
