import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["agent", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/new"
            element={
              <ProtectedRoute roles={["agent", "admin"]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit/:id"
            element={
              <ProtectedRoute roles={["agent", "admin"]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
