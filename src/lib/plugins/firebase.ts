import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
	getAuth,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup
} from 'firebase/auth';

import { browser } from '$app/environment';
import appConfig from '../configs';
import type User from '../models/User';

//typeof window !== 'undefined'

let _firebaseApp;
let _analytics;
if (browser) {
	_firebaseApp = initializeApp(appConfig.firebase);
	_analytics = getAnalytics(_firebaseApp);
}
export const firebaseApp = _firebaseApp;
export const analytics = _analytics;

export const authByPopup = () => {
	return signInWithPopup(getAuth(), new GoogleAuthProvider());
};
export const authByEmailAndPassword = (email: string, password: string) => {
	return signInWithEmailAndPassword(getAuth(), email, password);
};
export const currentUser = () => {
	return getAuth().currentUser;
};
export const listenAuthStateChanged = (callbackWithUser: (user: User, token?: string) => void) => {
	return onAuthStateChanged(getAuth(), async (fsUser) => {
		const user: User = {
			uid: fsUser?.uid ?? '',
			email: fsUser?.email,
			displayName: fsUser?.displayName
		};
		const token = await fsUser?.getIdToken();
		callbackWithUser(user, token);
	});
};
