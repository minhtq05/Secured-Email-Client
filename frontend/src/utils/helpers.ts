export const getURL = (path: string = "") => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL &&
        process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
            ? process.env.NEXT_PUBLIC_SITE_URL
            : process?.env?.NEXT_PUBLIC_VERCEL_URL &&
              process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
            ? process.env.NEXT_PUBLIC_VERCEL_URL
            : "http://localhost:3000";

    // Trim the url and remove trailing slashes
    url = url.replace(/\/+$/, "");
    // Make sure url starts with http
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure path starts without a slash
    path = path.replace(/^\/+/, "");

    return path ? `${url}/${path}` : url;
};
