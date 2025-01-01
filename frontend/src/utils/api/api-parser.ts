interface Data {
    [key: string]: any;
}

export const apiParser = (data: Data): URLSearchParams => {
    const keys = Object.entries(data);
    const params = new URLSearchParams(keys);
    return params;
};
