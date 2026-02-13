import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState(""); // 👈 new
  const [err, setErr] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // ✅ Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // ✅ Save username in Firebase Auth profile
      await updateProfile(userCred.user, {
        displayName: username,
      });

      // ✅ (Optional but recommended) Store user in Firestore for later
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        email,
        username,
        createdAt: serverTimestamp(),
      });

      // ✅ Redirect
      nav("/dashboard");
    } catch (e) {
      console.error("Signup error:", e);
      setErr(e.message);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSignup} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password (min 6 chars)"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {err && <p style={{ color: "tomato" }}>{err}</p>}
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}


