// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import SetDisplayName from "../components/SetDisplayName";
import "./Dashboard.css"; //

export default function Dashboard() {
  const { user, initializing, signOut, isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (initializing || !user) return;
    const q = query(
      collection(db, "tournaments"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTournaments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
  console.error(error);
  // Hide the permission-denied message
  if (error.code !== "permission-denied") {
    setErr(error.message || "Failed to load tournaments");
  } else {
    setErr(""); // don't show anything to the user
  }
  setLoading(false);
}

    );
    return () => unsub();
  }, [user, initializing]);

  if (initializing) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Logout failed");
    }
  };

  return (
    <div className="dash">
      <header className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dash-sub">
  Signed in as <strong>{user?.displayName || user?.email}</strong>
</p>
          {user && !user.displayName && (
  <div style={{ marginTop: 10 }}>
    <small>Choose a username to personalize your account:</small>
    <SetDisplayName />
  </div>
)}
        </div>
        <div className="dash-actions">
  {isAdmin && <Link to="/create" className="btn btn-primary">➕ Create Tournament</Link>}
  <Link to="/" className="btn">🏠 Home</Link>
  <button onClick={handleLogout} className="btn">🚪 Logout</button>
</div>

      </header>

      {!!err && <p className="dash-error">{err}</p>}
      {loading && <p className="dash-hint">Loading your tournaments…</p>}

      {!loading && tournaments.length === 0 && (
  <div className="empty">
    <p>No tournaments yet.</p>
    {isAdmin && <Link to="/create" className="btn btn-primary">Create your first</Link>}
  </div>
)}


      <ul className="cards">
        {tournaments.map((t) => (
          <li key={t.id} className="card">
            <div className="card-top">
              <h3 className="card-title">{t.title}</h3>
              <Link to={`/tournament/${t.id}`} className="btn-sm">View</Link>
            </div>
            <div className="card-row"><span>Game:</span><b>{t.game}</b></div>
            <div className="card-row">
              <span>Date:</span>
              <b>
                {t.eventDate?.toDate
                  ? t.eventDate.toDate().toLocaleString()
                  : String(t.eventDate || "")}
              </b>
            </div>
            <div className="card-foot">
              <span className="muted">
                Created {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleString() : "—"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
