import { Email } from "@/types/emails";
import { useEffect, useState } from "react";
import useLocalStorage from "./use-local-storage";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// should only be used by EmailProvider
export const useUserCurrentEmail = (currentEmail: Email | null) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (currentEmail !== null) {
            const newSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            newSearchParams.set("id", currentEmail.id);
            router.push(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            });
        } else if (searchParams.has("id")) {
            const newSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            newSearchParams.delete("id");
            router.push(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            });
        }
    }, [currentEmail]);
};
