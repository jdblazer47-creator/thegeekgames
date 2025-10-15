// src/pages/TournamentDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc, onSnapshot, collection, query, where,
  getDocs, addDoc, deleteDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./TournamentDetail.css";


export default function TournamentDetail() {
  const { tid } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // current user's enrollments under this tournament
  const [mySignups, setMySignups] = useState([]);
  // admin-only: list of all signups
  const [allSignups, setAllSignups] = useState([]);

  // ----- Load tournament doc -----
  useEffect(() => {
    const ref = doc(db, "tournaments", tid);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setErr("Tournament not found");
        setT(null);
      } else {
        setT({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }, (e) => {
      console.error(e);
      setErr("Failed to load tournament");
      setLoading(false);
    });
    return () => unsub();
  }, [tid]);

  // ----- Watch my signup status (allowed by rules) -----
  useEffect(() => {
    if (!user) { setMySignups([]); return; }
    const q = query(
      collection(db, "tournaments", tid, "signups"),
      where("uid", "==", user.uid)
    );
    let stop = false;
    (async () => {
      try {
        const snap = await getDocs(q); // one-time fetch is enough
        if (!stop) setMySignups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.warn("My signups read blocked or empty:", e?.code || e);
        if (!stop) setMySignups([]);
      }
    })();
    return () => { stop = true; };
  }, [tid, user]);

  // ----- Admin: load all signups -----
  useEffect(() => {
    if (!isAdmin) { setAllSignups([]); return; }
    const q = collection(db, "tournaments", tid, "signups");
    const unsub = onSnapshot(q, (snap) => {
      setAllSignups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (e) => {
      console.warn("Admin signup list error:", e?.code || e);
      setAllSignups([]);
    });
    return () => unsub();
  }, [tid, isAdmin]);

  const enrolled = useMemo(() => mySignups.length > 0, [mySignups]);

  // ----- Actions -----
  const handleRegister = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await addDoc(collection(db, "tournaments", tid, "signups"), {
        uid: user.uid,
        displayName: user.displayName ?? user.email,
        createdAt: serverTimestamp(),
      });
      // refresh mySignups (optional; snapshot of query would also work)
      const snap = await getDocs(
        query(collection(db, "tournaments", tid, "signups"), where("uid","==",user.uid))
      );
      setMySignups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      alert(e?.message ?? "Registration failed");
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(
        query(collection(db, "tournaments", tid, "signups"), where("uid","==",user.uid))
      );
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
      setMySignups([]);
    } catch (e) {
      console.error(e);
      alert(e?.message ?? "Unable to leave");
    }
  };

  if (loading) return <div className="container"><p>Loading…</p></div>;
  if (err) return <div className="container"><p style={{color:"tomato"}}>{err}</p></div>;
  if (!t) return <div className="container"><p>Not found.</p></div>;

  const dateStr = t.eventDate?.toDate ? t.eventDate.toDate().toLocaleString() : String(t.eventDate || "");

  return (
    <div className="container" style={{maxWidth: 900, margin: "2rem auto"}}>
      <Link to="/" className="btn">← Back</Link>

      <h1 style={{marginTop: "1rem"}}>{t.title}</h1>
      <p><b>Game:</b> {t.game || "—"}</p>
      <p><b>Date:</b> {dateStr}</p>

      {t.rules && (
  <>
    <h3 style={{ marginTop: "1rem" }}>Rules</h3>
    <pre className="rulesBox">{t.rules}</pre>
  </>
)}


      <div style={{marginTop: "1rem"}}>
        {!user && (
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Sign in to Register
          </button>
        )}
        {user && !enrolled && (
          <button className="btn btn-primary" onClick={handleRegister}>
            Register
          </button>
        )}
        {user && enrolled && (
          <button className="btn" onClick={handleLeave}>
            Leave Tournament
          </button>
        )}
      </div>

      {isAdmin && (
        <>
          <h3 style={{marginTop:"2rem"}}>Enrolled Players ({allSignups.length})</h3>
          {allSignups.length === 0 ? (
            <p>No signups yet.</p>
          ) : (
            <ul style={{listStyle:"none", padding:0}}>
              {allSignups.map(s => (
                <li key={s.id} style={{padding:"8px 0", borderBottom:"1px solid #222"}}>
                  {s.displayName || s.uid} <span style={{opacity:.6}}>({s.uid})</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
