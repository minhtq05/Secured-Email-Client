import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthRouter from "./routes/health";
import emailRouter from "./routes/emails";

const app = express();
const PORT = 8080;

// interface ImapClientEntry {
//     client: ImapFlow;
//     lastUsed: number; // timestamp for cleaning up unused clients
// }

// type Config = {
//     host: string;
//     port: number;
//     secure: boolean;
//     auth: {
//         user: string;
//         accessToken: string;
//     };
//     logger: any;
// };

// Failed: Remove caching, making the server stateless, implement streaming for efficient client initializing.
// const clientCache = new Map<string, ImapClientEntry>();

// async function createImapClient(
//     username: string,
//     config: Config
// ): Promise<ImapFlow> {
//     const client = new ImapFlow(config);
//     await client.connect();
//     clientCache.set(username, { client, lastUsed: Date.now() });
//     return client;
// }

// async function getImapClient(id: string, config: Config): Promise<ImapFlow> {
//     if (clientCache.has(id)) {
//         const entry = clientCache.get(id)!;
//         entry.lastUsed = Date.now();
//         return entry.client;
//     }
//     return await createImapClient(id, config);
// }

// const supabasePublic = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     // process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
// );

// const supabasePrivate = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
// );

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// const emailRouter = express.Router();

// emailRouter.use(validate);

// const getJWTToken = (req: express.Request) => {
//     const auth = req.headers.authorization;
//     return (auth as string).split(" ")[1];
// };

// const getGoogleOauthToken = async (
//     userId: string
// ): Promise<{ data: any | null; error: null | Error }> => {
//     const { data, error: queryError } = await supabasePrivate
//         .from("user_tokens")
//         .select("*")
//         .eq("id", userId)
//         .limit(1)
//         .single();

//     if (queryError !== null || data === null) {
//         console.log(queryError);
//         return { data: null, error: Error("unable to retrieve token") };
//     }

//     if (data.expires_at < Date.now()) {
//         const currentTime = Date.now();

//         const { token, error } = await fetch(
//             "https://oauth2.googleapis.com/token",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 body: new URLSearchParams({
//                     client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
//                     client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
//                     refresh_token: data.refresh_token,
//                     grant_type: "refresh_token",
//                 }),
//             }
//         )
//             .then((res) => res.json())
//             .then((data) => ({
//                 token: data,
//                 error: null,
//             }))
//             .catch((error) => ({
//                 token: null,
//                 error: error,
//             }));

//         if (error !== null) {
//             return { data: null, error: Error("unable to refresh token") };
//         }

//         const expires_at = currentTime + token.expires_in;
//         const { error: updateError } = await supabasePrivate
//             .from("user_tokens")
//             .update({
//                 access_token: token.access_token,
//                 expires_in: token.expires_in,
//                 expires_at: expires_at,
//             })
//             .eq("id", userId);

//         if (updateError !== null) {
//             return { data: null, error: Error("unable to update token") };
//         }

//         data.access_token = token.access_token;
//     }

//     return { data: data, error: null };
// };

// const getClientFromToken = async (
//     req: express.Request
// ): Promise<{ imapClient: ImapFlow | null; error: null | string }> => {
//     const token = getJWTToken(req);

//     const {
//         data: { user },
//         error: authError,
//     } = await supabasePublic.auth.getUser(token);

//     if (authError !== null || user === null) {
//         return { imapClient: null, error: "invalid credentials" };
//     }

//     const {
//         data: { access_token },
//         error,
//     } = await getGoogleOauthToken(user.id);

//     if (error !== null) {
//         return { imapClient: null, error: error.message };
//     }

//     const imapClient = await getImapClient(user.id, {
//         host: "imap.gmail.com",
//         port: 993,
//         secure: true,
//         auth: {
//             user: user.email as string,
//             accessToken: access_token as string,
//         },
//         logger: false,
//     });

//     return { imapClient, error: null };
// };

// emailRouter.get("/api/mail/mailboxes", async (req, res) => {
//     const { imapClient, error } = await getClientFromToken(req);

//     if (error !== null || imapClient === null) {
//         res.send({ error: error });
//         return;
//     }

//     const tree = await imapClient.listTree();

//     res.send(tree);
// });

// emailRouter.get("/api/mail/", async (req, res) => {
//     const { imapClient, error } = await getClientFromToken(req);

//     if (error !== null || imapClient === null) {
//         res.send({ error: error });
//         return;
//     }

//     if (!req.query.mailbox) {
//         res.statusCode = 400;
//         res.send({ error: "no mailbox specified" });
//         return;
//     }

//     console.log(`getting messages from ${req.query.mailbox || "unknown"}`);
//     const { limit, offset } = parseQuery(req);

//     if (limit === null || offset === null) {
//         res.statusCode = 400;
//         res.send({ error: "no limit or offset specified" });
//         return;
//     }

//     const mailboxPath = decodeURIComponent(req.query.mailbox as string);

//     try {
//         const mailbox = await imapClient.mailboxOpen(mailboxPath);
//         // const messages = await imapClient.fetchAll("1:30", {
//         //     uid: true,
//         //     envelope: true,
//         // });
//         const start = performance.now();

//         const messages = await imapClient.fetchAll(
//             `${Math.max(1, mailbox.exists - offset)}:${Math.max(
//                 1,
//                 mailbox.exists - offset - limit + 1
//             )}`,
//             {
//                 uid: true,
//                 envelope: true,
//                 source: true,
//             }
//         );

//         messages.reverse();

//         const end = performance.now();
//         console.log(`Took ${end - start} ms`);

//         res.send(
//             messages.map((msg) => ({
//                 uid: msg.uid,
//                 envelope: msg.envelope,
//             }))
//         );
//     } catch (error) {
//         console.log(error);
//         res.send({ error: error });
//     }
// });

app.use(emailRouter);
app.use(healthRouter);

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});
