import { Email } from "@/types/emails";
import { Separator } from "./ui/separator";

export const MailViewBox = ({ email }: { email: Email }) => {
    return (
        <div className="w-full flex flex-row">
            <Separator orientation="vertical" />
            <div className="flex flex-col p-2">
                <h1>Subject:{email.subject}</h1>
                <p>
                    {email.from.name === ""
                        ? email.from.address
                        : email.from.name}
                </p>
                <p>{email.body}</p>
            </div>
        </div>
    );
};
