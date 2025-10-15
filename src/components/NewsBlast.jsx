import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./NewsBlast.css";

export default function NewsBlast() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "news"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      const doc = snap.docs[0];
      setPost(doc ? { id: doc.id, ...doc.data() } : null);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  if (loading) return <div className="news-hero skeleton" />;
  if (!post) return null;

  const dateStr = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : "";

  return (
    <section className="news-hero">
      <div className="news-glow" />
      <div className="news-content">
        <span className="news-kicker">Developers Update</span>
        <h1 className="news-title">{post.title}</h1>

        {/* Render paragraphs safely */}
        {typeof post.body === "string"
          ? post.body.trim().split(/\n{2,}/).map((para, i) => (
              <p key={i} className="news-body">{para}</p>
            ))
          : null}

        <div className="news-meta">
          <span>{dateStr}</span>
        </div>
      </div>
    </section>
  );
}

