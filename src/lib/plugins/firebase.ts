// import firebase from 'firebase/app';
// import config from '../configs/firebase';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import appConfig from '../configs';
import User from '/models/User';

export const firebaseApp = initializeApp(appConfig.firebase);
export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export const authByPopup = () => {
    return signInWithPopup(auth, googleProvider);
};
export const authByEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};
export const currentUser = () => {
    return auth.currentUser;
};
export const listenAuthStateChanged = (callbackWithUser: (user: User | null, token: string | null) => void) => {
    return onAuthStateChanged(auth, async (fsUser) => {
        const user = {
            uid: fsUser?.uid,
            email: fsUser?.email,
            displayName: fsUser?.displayName,
        };
        const token = await fsUser?.getIdToken();
        callbackWithUser(user ?? null, token ?? null);
    });
};
