import React, { useEffect, useMemo, useState } from "react";
import { supabase, hasSupabase } from "../lib/supabase";
import Seo from "../components/Seo";

const statuses = ["Received", "Reviewing", "Scheduled", "In Progress", "Completed", "Closed"];

function formatPlatform(log) {
  const ua = String(log?.user_agent || "");
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone / iPad";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return log?.platform || "Unknown device";
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);

  const checkOwner = async (currentSession) => {
    if (!supabase || !currentSession?.user?.id) return false;
    const { data, error } = await supabase
      .from("admin_owners")
      .select("user_id")
      .eq("user_id", currentSession.user.id)
      .maybeSingle();
    if (error) {
      console.error("Owner check error:", error);
      return false;
    }
    return Boolean(data?.user_id);
  };

  const loadInquiries = async () => {
    if (!supabase || !isOwner) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      console.error("Inquiry load error:", error);
      setMsg(error.message);
      return;
    }
    setItems(data || []);
  };

  const loadLogs = async () => {
    if (!supabase || !isOwner) return;
    setLogsLoading(true);
    const { data, error } = await supabase
      .from("login_logs")
      .select("id, user_id, email, login_type, logged_at, user_agent, platform, screen_width, screen_height, language, timezone, referrer")
      .order("logged_at", { ascending: false })
      .limit(100);
    setLogsLoading(false);
    if (error) {
      console.error("Login log load error:", error);
      setMsg(error.message);
      return;
    }
    setLogs(data || []);
  };

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const current = data?.session || null;
      setSession(current);
      if (current) setIsOwner(await checkOwner(current));
    });
    const { data: auth } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession || null);
    });
    return () => {
      mounted = false;
      auth.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setIsOwner(false);
      return;
    }
    checkOwner(session).then(setIsOwner);
  }, [session]);

  useEffect(() => {
    if (session && isOwner) {
      loadInquiries();
      loadLogs();
    }
  }, [session, isOwner]);

  const writeLoginLog = async (ownerSession) => {
    if (!supabase || !ownerSession?.user) return;
    const { error } = await supabase.from("login_logs").insert([{
      user_id: ownerSession.user.id,
      email: ownerSession.user.email || email.trim(),
      login_type: "admin",
      user_agent: navigator.userAgent || "",
      platform: navigator.platform || "",
      screen_width: window.screen?.width || null,
      screen_height: window.screen?.height || null,
      language: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      referrer: document.referrer || "Direct",
    }]);
    if (error) console.error("Login log write error:", error);
  };

  const login = async (event) => {
    event.preventDefault();
    setMsg("");
    if (!supabase) return setMsg("Supabase is not configured.");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      return setMsg(error.message);
    }
    const owner = await checkOwner(data?.session);
    if (!owner) {
      await supabase.auth.signOut();
      setLoading(false);
      return setMsg("This account is not the KAVACH host/admin owner.");
    }
    setSession(data?.session || null);
    setIsOwner(true);
    setPassword("");
    await writeLoginLog(data?.session);
    setLoading(false);
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setIsOwner(false);
    setItems([]);
    setLogs([]);
    setMsg("");
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setMsg("");
    if (!supabase || !session || !isOwner) return setMsg("Only the KAVACH host can change the admin password.");
    const form = event.currentTarget;
    const data = new FormData(form);
    const oldPassword = String(data.get("oldPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (!oldPassword || !newPassword || !confirmPassword) return setMsg("Enter old password, new password and confirmation.");
    if (newPassword.length < 8) return setMsg("New password must contain at least 8 characters.");
    if (newPassword !== confirmPassword) return setMsg("New password and confirmation do not match.");
    if (oldPassword === newPassword) return setMsg("New password must be different from the old password.");

    setLoading(true);
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: oldPassword,
    });
    if (reauthError) {
      setLoading(false);
      return setMsg("Old password is incorrect.");
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) return setMsg(error.message);
    form.reset();
    setMsg("Admin password changed successfully.");
  };

  const updateStatus = async (id, status) => {
    if (!supabase || !isOwner) return;
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) return setMsg(error.message);
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => [item.name, item.organization, item.email, item.phone, item.service, item.message, item.status].some((value) => String(value || "").toLowerCase().includes(needle)));
  }, [items, query]);

  const exportCsv = () => {
    const header = ["created_at", "name", "organization", "phone", "email", "service", "status", "message"];
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [header, ...filtered.map((item) => header.map((key) => escape(item[key])))].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kavach-inquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hasSupabase || !supabase) return <section className="page-pad inner-page"><Seo title="Admin" description="KAVACH private administration." path="/admin" noindex /><div className="page-title"><span className="section-no">09 / ADMIN</span><h1>Control room<br/><em>not configured.</em></h1><p>Add the Supabase environment variables before using the private admin area.</p></div></section>;

  if (!session || !isOwner) return <section className="page-pad inner-page admin-page"><Seo title="Admin Control Room" description="KAVACH private administration." path="/admin" noindex /><div className="admin-login-shell"><div className="admin-login-visual"><span className="section-no">09 / PRIVATE CONTROL ROOM</span><img src="/assets/kavach-logo.png" alt="KAVACH guardian"/><h1>Owner<br/><em>access.</em></h1><p>Private KAVACH workspace for requests, services and security operations.</p></div><form className="admin-login" onSubmit={login}><span className="section-no">HOST LOGIN</span><h2>Sign in.</h2><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required placeholder="Host email"/></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required placeholder="Admin password"/></label><button className="btn btn-dark" type="submit" disabled={loading}>{loading ? "Checking owner..." : "Enter control room ↗"}</button>{msg && <div className="form-status" role="alert">{msg}</div>}</form></div></section>;

  const received = items.filter((x) => (x.status || "Received") === "Received").length;
  const active = items.filter((x) => !["Completed", "Closed"].includes(x.status || "Received")).length;
  const completed = items.filter((x) => ["Completed", "Closed"].includes(x.status || "Received")).length;

  return <section className="page-pad inner-page admin-page">
    <Seo title="Admin Control Room" description="Private KAVACH administration dashboard." path="/admin" noindex />
    <div className="admin-head"><div><span className="section-no">09 / ADMIN CONTROL ROOM</span><h1>Operations<br/><em>dashboard.</em></h1><p>Private host workspace for customer requests, service orders, status tracking and account security.</p></div><button className="btn btn-dark" onClick={logout}>Logout</button></div>

    <div className="admin-stats"><div><span>ALL REQUESTS</span><strong>{items.length}</strong></div><div><span>NEW</span><strong>{received}</strong></div><div><span>ACTIVE</span><strong>{active}</strong></div><div><span>COMPLETED</span><strong>{completed}</strong></div></div>

    <div className="admin-quick-actions">
      <a href="#requests"><span>01 / ORDERS</span><strong>Manage new orders ↗</strong></a>
      <a href="#password"><span>02 / SECURITY</span><strong>Change admin password ↗</strong></a>
      <a href="#login-history"><span>03 / ACTIVITY</span><strong>View login history ↗</strong></a>
      <a href="/services"><span>04 / SERVICES</span><strong>Open KAVACH services ↗</strong></a>
    </div>

    <div className="admin-toolbar" id="requests"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, service, email, message..."/><button className="btn" onClick={() => { loadInquiries(); loadLogs(); }} disabled={loading || logsLoading}>{loading || logsLoading ? "Refreshing..." : "Refresh ↻"}</button><button className="btn" onClick={exportCsv}>Export CSV ↓</button></div>

    <div className="admin-tools" id="password"><div><span className="section-no">HOST ONLY</span><h2>Admin password</h2><p>Changing the admin password requires the current/old password first.</p></div><form onSubmit={changePassword} className="password-form"><input name="oldPassword" type="password" autoComplete="current-password" placeholder="Old password" required/><input name="newPassword" type="password" minLength={8} autoComplete="new-password" placeholder="New password" required/><input name="confirmPassword" type="password" minLength={8} autoComplete="new-password" placeholder="Confirm new password" required/><button className="btn" type="submit" disabled={loading}>Change password</button></form></div>

    {msg && <div className="form-status" role="status">{msg}</div>}

    <div className="inquiry-table"><div className="inquiry-head"><span>REQUEST</span><span>SERVICE</span><span>CONTACT</span><span>STATUS</span><span>DATE</span></div>{filtered.map((item) => <article key={item.id}><div><strong>{item.name}</strong><small>{item.organization || "No organisation"}</small><p>{item.message}</p></div><span>{item.service}</span><span>{item.email}<br/>{item.phone}</span><select value={item.status || "Received"} onChange={(e) => updateStatus(item.id, e.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><span>{item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</span></article>)}{!filtered.length && <p className="empty-state">No inquiries match the current view.</p>}</div>

    <section className="admin-login-history" id="login-history">
      <div className="admin-section-heading"><div><span className="section-no">05 / LOGIN ACTIVITY</span><h2>Who signed in<br/><em>and when.</em></h2></div><button className="btn" onClick={loadLogs} disabled={logsLoading}>{logsLoading ? "Loading..." : "Refresh logs ↻"}</button></div>
      <div className="login-log-list">{logs.map((log) => <article key={log.id}><div className="log-time"><strong>{log.logged_at ? new Date(log.logged_at).toLocaleString() : "—"}</strong><small>{log.email}</small></div><div><strong>{formatPlatform(log)}</strong><p>{log.user_agent || "User agent unavailable"}</p></div><div><span>{log.login_type === "admin" ? "HOST / ADMIN" : "CUSTOMER"}</span><span>{log.timezone || "Timezone unavailable"}</span><span>{log.language || "Language unavailable"}</span><span>{log.screen_width && log.screen_height ? `${log.screen_width} × ${log.screen_height}` : "Screen size unavailable"}</span></div></article>)}{!logs.length && <p className="empty-state">No recorded owner logins yet.</p>}</div>
    </section>
  </section>;
}
