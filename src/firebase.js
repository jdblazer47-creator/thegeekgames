// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider, getToken as getAppCheckToken } from 'firebase/app-check';

// All values come from env (CRA requires REACT_APP_ prefix)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,          // thegeekgames-b6d1f.firebaseapp.com
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,            // thegeekgames-b6d1f
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,    // thegeekgames-b6d1f.appspot.com
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// ✅ Real App Check (no debug token here). Put the site key in env.
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
// ✅ Correct Firestore init
export const db = getFirestore(app, "geekgames");

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Optional: dev-only sanity log so you can confirm App Check is active
if (process.env.NODE_ENV !== 'production') {
  getAppCheckToken(appCheck, true)
    .then(({ token }) =>
      console.log('App Check token (dev):', (token || '').slice(0, 12) + '…')
    )
    .catch((e) => console.error('App Check getToken error:', e));
}


