import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css"; // 👈 import the CSS file

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
  <img 
    src="/Geekgameslogo.png" 
    alt="The Geek Games Logo" 
    className="site-logo" 
  />
  <span className="site-title">The Geek Games</span>
</Link>


        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact Us</Link>

          {!user && (
            <>
              <Link to="/login" className="nav-button">Login</Link>
              <Link to="/signup" className="nav-button primary">Sign Up</Link>
            </>
          )}

          {user && (
            <>
              <span className="nav-user">{user.displayName || user.email}</span>
              <button onClick={() => signOut(auth)} className="nav-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

