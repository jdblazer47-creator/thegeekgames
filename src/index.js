// --- all imports first ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import './firebase'; // initializes Firebase + App Check

// --- dev-only App Check debug token (runs only in local dev) ---
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('./appcheck-debug.dev'); // keep this file in repo; it's not bundled in prod
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
