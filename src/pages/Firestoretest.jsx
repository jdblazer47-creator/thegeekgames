import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function FirestoreTest() {
  const [status, setStatus] = useState("");

  const handleTest = async () => {
    try {
      await addDoc(collection(db, "testCollection"), {
        message: "Hello Firestore!",
        createdAt: new Date().toISOString(),
      });
      setStatus("✅ Document added successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Firestore Connection Test</h2>
      <button onClick={handleTest}>Add Test Document</button>
      <p>{status}</p>
    </div>
  );
}

