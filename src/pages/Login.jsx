import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { supabase, hasSupabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data?.session) navigate("/account", { replace: true });
    });
    return () => { active = false; };
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      if (!hasSupabase || !supabase) throw new Error("Login service is not configured.");
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      if (data?.user) {
        await supabase.from("login_logs").insert([{
          user_id: data.user.id,
          email: data.user.email || email.trim(),
          login_type: "customer",
          user_agent: navigator.userAgent || "",
          platform: navigator.platform || "",
          screen_width: window.screen?.width || null,
          screen_height: window.screen?.height || null,
          language: navigator.language || "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          referrer: document.referrer || "Direct"
        }]);
      }
      navigate("/account");
    } catch (error) {
      setStatus(error?.message || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setStatus("");
    if (!email.trim()) {
      setStatus("Enter your email first, then choose Forgot password.");
      return;
    }
    if (!supabase) {
      setStatus("Login service is not configured.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`
    });
    setStatus(error ? error.message : "Password reset instructions have been sent if the account exists.");
  };

  return (
    <section className="page-pad auth-page">
      <Seo title="Login" description="Secure KAVACH customer login for managing cybersecurity service requests and account details." path="/login" noindex />
      <div className="auth-shell">
        <div className="auth-visual">
          <span className="section-no">KAVACH / ACCOUNT</span>
          <img src="/assets/kavach-turtle.png" alt="Tirtal KAVACH guardian" />
          <h1>Welcome<br /><em>back.</em></h1>
          <p>Manage your security requests from one private account.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <span className="section-no">CUSTOMER LOGIN</span>
          <h2>Sign in to KAVACH.</h2>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="you@example.com" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required placeholder="Your password" /></label>
          <button className="btn btn-dark" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login ↗"}</button>
          <button className="auth-link" type="button" onClick={resetPassword}>Forgot password?</button>
          {status && <div className="form-status" role="status">{status}</div>}
          <p className="auth-switch">New to KAVACH? <Link to="/signup">Create an account ↗</Link></p>
        </form>
      </div>
    </section>
  );
}
