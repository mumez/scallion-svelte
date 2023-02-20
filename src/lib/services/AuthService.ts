
import { authByPopup, authByEmailAndPassword, listenAuthStateChanged } from '../plugins/firebase';
import type User from '../models/User';

import userService from './UserService';
import type { UserCredential } from 'firebase/auth';


class AuthService {

    isAuthenticated = false;

    public tryAutoLogin(successFunc: () => void) {
        listenAuthStateChanged(async (user, token) => {
            if (user && token) {
                this.onAutoLogin(user, token);
                successFunc();
            } else {
                this.onLogout();
            }
        });
    }

    private onAutoLogin(user: User, token: string) {
        console.log('user :>> ', user);
        userService.setIdToken(token);
        userService.setUser(user);
        this.isAuthenticated = true;
    }

    private onLogout() {
        console.log('logout :>> ');
        userService.clear();
        this.isAuthenticated = false;
    }

    public async authByPopup(): Promise<User | null> {
        const userCredential = await authByPopup().catch((ex) => {
            console.log(ex);
            return null;
        });
        return this.userFromCredential(userCredential);
    }
    public async authByEmailAndPassword(email: string, password: string): Promise<User | null> {
        console.log('email-pass-', email, password);
        const userCredential = await authByEmailAndPassword(email, password).catch((ex) => {
            console.log(ex);
            return null;
        });
        return this.userFromCredential(userCredential);
    }

    private async userFromCredential(userCredential: UserCredential | null): Promise<User | null> {
        const userOrNone = userCredential?.user;
        if (!userOrNone) return null;
        userService.setIdToken(await userOrNone.getIdToken());
        const user: User = {
            uid: userOrNone.uid,
            email: userOrNone.email,
            displayName: userOrNone.displayName
        };
        userService.setUser(user);
        this.isAuthenticated = true;
        return user;
    }
}

export default new AuthService();
