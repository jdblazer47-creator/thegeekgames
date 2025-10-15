import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./Tournaments.css"; // optional if you want to style it

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Show all tournaments with a date >= now (future or active)
    const now = Timestamp.now();
    const q = query(
      collection(db, "tournaments"),
      where("eventDate", ">=", now),
      orderBy("eventDate", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setTournaments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load tournaments");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  if (loading) return <p>Loading tournaments...</p>;
  if (error) return <p style={{ color: "tomato" }}>{error}</p>;

  return (
    <div className="tournaments-page">
      <h1>🎮 Active & Upcoming Tournaments</h1>
      {tournaments.length === 0 && <p>No active tournaments right now.</p>}

      <ul className="tournament-list">
        {tournaments.map((t) => (
          <li key={t.id} className="tournament-card">
            <div className="card-header">
              <h3>{t.title}</h3>
              <span className="date">
                {t.eventDate?.toDate
                  ? t.eventDate.toDate().toLocaleString()
                  : String(t.eventDate)}
              </span>
            </div>
            <div className="card-body">
              <p><b>Game:</b> {t.game}</p>
            </div>
            <div className="card-footer">
              <Link to={`/tournament/${t.id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
