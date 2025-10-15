// src/appcheck-debug.js
if (process.env.NODE_ENV !== 'production') {
  // Using window to avoid CRA's no-restricted-globals on `self`
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = '9bdfc9a6-ebab-4f2b-a2be-671687cc05fe';
}
