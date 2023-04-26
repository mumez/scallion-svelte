import { authByPopup, authByEmailAndPassword, listenAuthStateChanged } from '../plugins/firebase';
import type { User } from '../models/User';

import userService from './UserService';
import type { UserCredential } from 'firebase/auth';

class AuthService {
	isAuthenticated = false;

	public tryAutoLogin(resultFunc: (isAuthenticated: boolean) => void) {
		listenAuthStateChanged(async (user, token) => {
			if (user && token) {
				this.onAutoLogin(user, token);
			} else {
				this.onLogout();
			}
			resultFunc(this.isAuthenticated);
		});
	}

	private onAutoLogin(user: User, token: string) {
		userService.setIdToken(token);
		userService.setUser(user);
		this.isAuthenticated = true;
	}

	private onLogout() {
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
			email: userOrNone.email ?? undefined,
			displayName: userOrNone.displayName ?? undefined
		};
		userService.setUser(user);
		this.isAuthenticated = true;
		return user;
	}
}

export default new AuthService();
