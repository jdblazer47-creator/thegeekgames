// src/pages/Contact.jsx
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // make sure db is exported from your firebase.js
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ sending: false, ok: null, error: "" });

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, ok: null, error: "" });

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
      });

      setStatus({ sending: false, ok: true, error: "" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ sending: false, ok: false, error: err.message || "Failed to send" });
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Message</label>
        <textarea
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={status.sending}>
          {status.sending ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status.ok === true && <p>✅ Message saved. We’ll email you next (once we add the function).</p>}
      {status.ok === false && <p>❌ {status.error}</p>}
    </div>
  );
}

