"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export const handleGetSession = async (): Promise<{
    user: User | null;
    access_token: string | null;
    error: null | string;
}> => {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error) {
        return {
            user: null,
            access_token: null,
            error: error.message,
        };
    }

    return supabase.auth
        .getSession()
        .then((res) => {
            return {
                user: user,
                access_token: res.data.session?.access_token!,
                error: null,
            };
        })
        .catch((err) => {
            return {
                user: null,
                access_token: null,
                error: err.message,
            };
        });
};
