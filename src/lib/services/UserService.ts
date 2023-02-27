import BaseService from './BaseService';
import type { User } from '../models/User';
import { clientStoreForSession } from '../utils/ClientStorage';

class UserService extends BaseService {

    protected _user?: User;
    protected _token?: string;

    public setIdToken(idToken: string) {
        console.log('JWT: ', idToken);
        this._token = idToken;
        clientStoreForSession.putJwt(idToken);
    }
    public setUser(user: User) {
        this._user = user;
        this.storeUser(user);
    }
    public clear() {
        this._user = undefined;
        this._token = undefined;
    }

    public storeUser(user: User) {
        console.log('--user---', user);
        clientStoreForSession.put('_user', user);
    }

    public loadUser(): User | undefined {
        const userObj = clientStoreForSession.get('_user');
        if (userObj) {
            this._user = {
                uid: userObj.uid,
                email: userObj.email,
                displayName: userObj.displayName
            }
        }
        return this._user;
    }

    get user(): User | null {
        if (this._user) return this._user;
        this._user = this.loadUser();
        return this._user ? this._user : null;
    }
}

export default new UserService();
