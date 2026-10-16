import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { supabase, hasSupabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      if (!hasSupabase || !supabase) throw new Error("Account service is not configured.");
      if (form.password.length < 8) throw new Error("Password must contain at least 8 characters.");
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { full_name: form.name.trim() } }
      });
      if (error) throw error;
      if (data?.session) navigate("/account");
      else setStatus("Account created. Check your email if confirmation is enabled, then log in.");
    } catch (error) {
      setStatus(error?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-pad auth-page">
      <Seo title="Create Account" description="Create a KAVACH customer account to manage cybersecurity service requests." path="/signup" noindex />
      <div className="auth-shell">
        <div className="auth-visual auth-visual-alt">
          <span className="section-no">TIRTAL / YOUR GUARDIAN</span>
          <img src="/assets/kavach-turtle.png" alt="Tirtal KAVACH guardian" />
          <h1>Build your<br /><em>secure space.</em></h1>
          <p>Keep your KAVACH service requests and updates together.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <span className="section-no">CREATE ACCOUNT</span>
          <h2>Join KAVACH.</h2>
          <label>Full name<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required placeholder="Your name" /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required placeholder="you@example.com" /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" /></label>
          <button className="btn btn-dark" type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account ↗"}</button>
          {status && <div className="form-status" role="status">{status}</div>}
          <p className="auth-switch">Already have an account? <Link to="/login">Login ↗</Link></p>
        </form>
      </div>
    </section>
  );
}
