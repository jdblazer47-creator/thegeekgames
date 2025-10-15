// src/pages/TournamentCreate.jsx
import { useState } from "react";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase"; // 👈 import auth
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TournamentCreate() {
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [dateStr, setDateStr] = useState(""); // from <input type="datetime-local">
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!isAdmin) {
      setErr("Only admins can create tournaments.");
      return;
    }

    try {
      setBusy(true);

      // Validate & convert date to Firestore Timestamp
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        setErr("Please choose a valid date & time.");
        setBusy(false);
        return;
      }
      const eventDate = Timestamp.fromDate(d);

      const payload = {
        title: title.trim(),
        game: game.trim(),
        eventDate,
        createdAt: serverTimestamp(),
      };

      // Debug: confirm claims & payload
      const token = await auth.currentUser.getIdTokenResult(true);
      console.log("claims:", token.claims); // should include { admin: true }
      console.log("payload:", payload);

      await addDoc(collection(db, "tournaments"), payload); // ✅ correct call

      nav("/tournaments");
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to create tournament");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "24px auto" }}>
      <h1>Create a Tournament</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Game
          <input value={game} onChange={(e) => setGame(e.target.value)} required />
        </label>
        <label>
          Date & time
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create tournament"}
        </button>
      </form>
      {err && <p style={{ color: "tomato", marginTop: 8 }}>{err}</p>}
    </div>
  );
}
