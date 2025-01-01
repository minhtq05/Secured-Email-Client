import localforage from "localforage";
import toast from "react-hot-toast";

const useLocalStorage = () => {
    const get = async (key: string, defaultValue?: any) => {
        return localforage
            .getItem(key)
            .then((value) => {
                return value || defaultValue;
            })
            .catch((err) => {
                toast.error("no item in cache");
                if (defaultValue) return defaultValue;
                throw Error("no item in cache");
            });
    };

    const set = async (key: string, value: any): Promise<Error | null> => {
        return localforage.setItem(key, value).catch((err) => console.log(err));
    };

    return { get, set };
};

export default useLocalStorage;
