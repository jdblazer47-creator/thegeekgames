import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import NewsBlast from "../components/NewsBlast"; // ✅ already imported
import "./Home.css"; // optional

export default function Home() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const now = Timestamp.now();
    const q = query(
      collection(db, "tournaments"),
      where("eventDate", ">=", now),
      orderBy("eventDate", "asc"),
      limit(3)
    );
    const unsub = onSnapshot(q, (snap) => {
      setTournaments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {/* 👇 Make the News Blast the center focus */}
      <NewsBlast />

      <h1>Active Tournaments</h1>
      <p>Welcome to The Geek Games! Login or Sign Up to register for tournaments.</p>

      {user && (
        <div style={{ marginTop: 16 }}>
          <Link
            to="/dashboard"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #1f2937",
              background: "#0ea5e9",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      <section style={{ marginTop: 32 }}>
        <h2>🔥 Upcoming Tournaments</h2>

        {tournaments.length === 0 && (
          <p style={{ opacity: 0.8 }}>No upcoming tournaments right now.</p>
        )}

        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {tournaments.map((t) => (
            <li
              key={t.id}
              style={{
                background: "#0b1220",
                color: "white",
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <h3 style={{ marginBottom: 4 }}>{t.title}</h3>
              <p style={{ margin: "4px 0" }}>
                <b>Game:</b> {t.game}
              </p>
              <p style={{ margin: "4px 0" }}>
                <b>Date:</b>{" "}
                {t.eventDate?.toDate
                  ? t.eventDate.toDate().toLocaleString()
                  : String(t.eventDate)}
              </p>
              <Link
                to={`/tournament/${t.id}`}
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  background: "#2563eb",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                View Tournament
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 16 }}>
          <Link
            to="/tournaments"
            style={{
              display: "inline-block",
              background: "#10b981",
              color: "white",
              padding: "8px 14px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            View All Tournaments
          </Link>
        </div>
      </section>
    </div>
  );
}
