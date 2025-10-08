import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FirestoreTest from "./pages/Firestoretest"; // 👈 add this

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/firestore-test" element={<FirestoreTest />} /> {/* 👈 add this */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

