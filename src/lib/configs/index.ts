import firebaseConfig from './firebase';
import webDavConfig from './webDav';

export const firebase = firebaseConfig;
export const webDav = webDavConfig;

const config = {
    firebase,
    webDav,
};

export default config;
