import localforage from "localforage";

const useLocalStorage = () => {
    const get = async (key: string, defaultValue: any) => {
        return localforage
            .getItem(key)
            .then((value) => {
                return value || defaultValue;
            })
            .catch((err) => {
                return defaultValue;
            });
    };

    const set = async (key: string, value: any): Promise<Error | null> => {
        return localforage.setItem(key, value);
    };

    return { get, set };
};

export default useLocalStorage;
