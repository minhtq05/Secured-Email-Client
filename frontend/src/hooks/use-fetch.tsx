import { useEffect } from "react";
import useAuth, { useRefreshToken } from "./use-auth";

const useFetchPrivate = () => {
    const { refresh } = useRefreshToken();
    const { auth } = useAuth();

    const fetchPrivate = (
        input: string | URL | globalThis.Request,
        options?: RequestInit
    ) => {
        const headers = options?.headers
            ? new Headers(options.headers)
            : new Headers();
        if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${auth?.access_token}`);
        }
        return fetch(input, { ...options, headers: headers });
    };

    return fetchPrivate;
};

export default useFetchPrivate;
