// src/App.js
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TournamentCreate from "./pages/TournamentCreate";
import ProtectedRoute from "./routes/ProtectedRoute"; // make sure this is a default export
import AdminRoute from "./routes/AdminRoute";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import Contact from "./pages/Contact";


export default function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />


          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <AdminRoute>
                <TournamentCreate />
              </AdminRoute>
  }
/>

          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournament/:tid" element={<TournamentDetail />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </>
  );
}

