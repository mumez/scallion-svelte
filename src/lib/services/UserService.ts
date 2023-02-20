import BaseService from './BaseService';
import CoreUtils from '../utils/CoreUtils';
import type User from '../models/User';

class UserService extends BaseService {

    protected _user?: User;
    protected _token?: string;

    public setIdToken(idToken: string) {
        this._token = idToken;
        this.storeToken(idToken);
    }
    public setUser(user: User) {
        this._user = user;
        this.storeUser(user);
    }
    public clear() {
        this._user = undefined;
        this._token = undefined;
    }

    public storeToken(jwt: string) {
        CoreUtils.putToSessionStorage('_jwt', jwt);
    }

    public storeUser(user: User) {
        CoreUtils.putToSessionStorage('_user', user);
    }

    public loadToken(): string {
        return CoreUtils.getFromSessionStorage('_jwt');
    }

    public loadUser(): User | undefined {
        const userObj = CoreUtils.getFromSessionStorage('_user');
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
