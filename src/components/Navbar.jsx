import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for login/logout changes in Firebase
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <nav style={{
      padding: "12px 16px",
      background: "#0b1220",
      color: "#e6eef6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Link
        to="/"
        style={{ color: "#06b6d4", textDecoration: "none", fontWeight: 700 }}
      >
        The Geek Games
      </Link>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}

        {user && (
          <>
            <span style={{ opacity: 0.8, fontSize: 14 }}>{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              style={{
                background: "#0f1724",
                color: "white",
                border: "1px solid #223",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
