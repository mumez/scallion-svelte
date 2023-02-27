class ClientStorage {
    storage?: Storage;

    constructor(storageImpl: Storage | undefined) {
        this.storage = storageImpl
    }

    public put(key: string, value: any) {
        this.storage?.setItem(key, JSON.stringify(value));
    }
    public get(key: string) {
        const item = this.storage?.getItem(key);
        return item ? JSON.parse(item) : '';
    }

    public putJwt(jwt: string) {
        this.put('_jwt', jwt);
    }
    public getJwt(): string {
        return this.get('_jwt');
    }
}

export const clientStoreForSession = (typeof window !== 'undefined')
    ? new ClientStorage(sessionStorage)
    : new ClientStorage(undefined)

export const clientStore = (typeof window !== 'undefined')
    ? new ClientStorage(localStorage)
    : new ClientStorage(undefined)
