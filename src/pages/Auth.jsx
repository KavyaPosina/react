import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function Login() {
  const { login } = useApp(), navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = e => {
    e.preventDefault(); const result = login(form.email, form.password, form.role);
    if (!result.ok) return setError(result.message);
    navigate(`/${result.user.role}`);
  };
  return <AuthFrame title="Welcome back" subtitle="Sign in to manage your appointments">
    <form onSubmit={submit} className="form">
      <label>Login as<select name="role" value={form.role} onChange={change}><option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option></select></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={change} required placeholder="Enter your email" /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={change} required placeholder="Enter password" /></label>
      {error && <p className="error">{error}</p>}<button className="btn btn-primary full">Login</button>
    </form>
    <p className="auth-foot">New patient? <Link to="/signup">Create an account</Link></p>
    <div className="demo-box"><b>Demo accounts</b><br/>Admin: admin@demo.com / admin123<br/>Doctor: ananya@demo.com / doctor123<br/>Patient: Register a new account</div>
  </AuthFrame>;
}
export function Signup() {
  const { signup } = useApp(), navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" }), [error, setError] = useState("");
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = e => { e.preventDefault(); const result = signup(form); if (!result.ok) return setError(result.message); navigate("/patient"); };
  return <AuthFrame title="Create patient account" subtitle="Register to book your appointments">
    <form onSubmit={submit} className="form">
      <label>Full name<input name="name" value={form.name} onChange={change} required /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={change} required /></label>
      <label>Password<input name="password" type="password" minLength="6" value={form.password} onChange={change} required /></label>
      {error && <p className="error">{error}</p>}<button className="btn btn-primary full">Create Account</button>
    </form><p className="auth-foot">Already registered? <Link to="/login">Login</Link></p>
  </AuthFrame>;
}
function AuthFrame({ title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-brand"><span className="brand-icon">✚</span> MediCare</div><div className="auth-card"><h1>{title}</h1><p className="muted">{subtitle}</p>{children}</div><p className="auth-disclaimer">Academic demonstration only. Do not enter real patient information.</p></div>;
}