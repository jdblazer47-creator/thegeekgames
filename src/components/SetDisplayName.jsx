import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function SetDisplayName() {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    const u = auth.currentUser;
    if (!u) return;
    try {
      await updateProfile(u, { displayName: name.trim() });
      window.location.reload(); // refresh UI
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={save} style={{ display: "flex", gap: 8 }}>
      <input
        placeholder="Choose a username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Save</button>
      {err && <span style={{ color: "tomato" }}>{err}</span>}
    </form>
  );
}

