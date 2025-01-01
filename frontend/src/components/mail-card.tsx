import useEmail from "@/hooks/use-mail-provider";
import { Email } from "@/types/emails";
import moment from "moment";
import { cn } from "@/lib/utils";

export const MailCard = ({ email }: { email: Email }) => {
    const { setCurrentEmail } = useEmail();

    const handleOpenMessage = () => {
        setCurrentEmail(email);
    };

    return (
        <div
            className={cn(
                "flex flex-col shadow",
                "rounded border border-gray-200",
                "text-gray-400 hover:text-black",
                "p-4 w-full",
                "hover:cursor-pointer"
            )}
            onClick={handleOpenMessage}
        >
            <p
                className={cn(
                    "flex flex-row",
                    "text-nowrap text-ellipsis overflow-hidden whitespace-nowrap"
                )}
            >
                Date: {moment(email.date).format("DD.MM.YYYY SS:MM:HH")}
            </p>
            <p
                className={cn(
                    "flex",
                    "font-semibold text-nowrap text-ellipsis overflow-hidden whitespace-nowrap"
                )}
            >
                from: '
                {email.from.name === "" ? email.from.address : email.from.name}'
            </p>
            <p
                className={cn(
                    "flex",
                    "text-nowrap text-ellipsis overflow-hidden whitespace-nowrap"
                )}
            >
                {email.subject}
            </p>
        </div>
    );
};
