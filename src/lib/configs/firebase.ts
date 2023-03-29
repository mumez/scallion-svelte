import { PUBLIC_FIREBASE_CFG } from '$env/static/public';

// Use JSON.stringify to generate the string from your web app's Firebase configuration
const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CFG);

export default firebaseConfig;
