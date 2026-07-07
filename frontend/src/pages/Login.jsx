import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card blueprint-frame">
          <div className="eyebrow">Welcome back</div>
          <h1 className="auth-title">Sign in</h1>
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="auth-switch">
            New to HouseHunt? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
