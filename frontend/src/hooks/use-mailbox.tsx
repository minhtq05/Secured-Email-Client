"use client";

import { Email } from "@/types/emails";
import { useEffect, useState } from "react";
import useAuth from "./use-auth";
import useAxiosPrivate from "./use-axios";
import { FetchMessageObject } from "imapflow";
import useLocalStorage from "./use-local-storage";
import useMail from "./use-mail";

export default function useMailbox() {
    const { selectedMailbox } = useMail();
    const { auth } = useAuth();
    const allEmails = new Map<string, Email[]>();
    const [emails, setEmails] = useState<Email[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { get, set } = useLocalStorage();

    useEffect(() => {
        if (selectedMailbox === null) return;
        get(`emails-${selectedMailbox.path}`, []).then((res) => {
            if (!allEmails.has(selectedMailbox.path)) {
                allEmails.set(selectedMailbox.path, res);
            }
        });
        setEmails(allEmails.get(selectedMailbox.path) || []);
    }, [selectedMailbox]);

    useEffect(() => {
        if (auth?.access_token && selectedMailbox !== null) {
            axiosPrivate
                .get(`/api/mail/${selectedMailbox.path}`)
                .then((res) => {
                    const data = res.data.map((msg: FetchMessageObject) => ({
                        id: msg.uid,
                        date: msg.envelope.date,
                        from: msg.envelope.from[0],
                        to: msg.envelope.to,
                        subject: msg.envelope.subject,
                        body: "",
                    }));
                    setEmails(data);
                    set("emails", data);
                    console.log(res.data.length);
                });
        }
    }, [auth, selectedMailbox]);

    return { emails };
}
