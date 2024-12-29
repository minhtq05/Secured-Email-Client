import useMail from "@/hooks/use-mail";
import { Email } from "@/types/emails";
import moment from "moment";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const MailCard = ({ email }: { email: Email }) => {
    const { setSelectedEmail } = useMail();

    const handleOpenMessage = () => {
        setSelectedEmail(email);
    };

    return (
        <div
            className="flex flex-col rounded border border-gray-200 text-gray-400 p-4 hover:text-black hover:cursor-pointer w-full"
            onClick={handleOpenMessage}
        >
            <p>Date: {moment(email.date).format("DD.MM.YYYY SS:MM:HH")}</p>
            <p className="font-semibold">
                from: '
                {email.from.name === "" ? email.from.address : email.from.name}'
            </p>
            <p>{email.subject}</p>
        </div>
    );
};
