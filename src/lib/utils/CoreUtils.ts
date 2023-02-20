class CoreUtils {
    public putToSessionStorage(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    public getFromSessionStorage(key: string) {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : '';
    }
}

export default new CoreUtils();
