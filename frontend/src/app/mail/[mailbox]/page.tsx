"use client";

import Mailbox from "@/components/mailbox";
import useAuth from "@/hooks/use-auth";
import useAxiosPrivate from "@/hooks/use-axios";
import useFetchPrivate from "@/hooks/use-fetch";
import React, { useEffect } from "react";

const MailboxWrapper = () => {
    return <Mailbox />;
};

export default MailboxWrapper;
