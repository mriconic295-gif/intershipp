import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { supabase, hasSupabase } from "../lib/supabase";

const quickServices = [
  ["Website Security", "Web application and website security checks.", "/request?service=Website%20Security%20Check"],
  ["Network / Wi-Fi", "Small-office and Wi-Fi security review.", "/request?service=Wi-Fi%20%2F%20Network%20Security"],
  ["Security Assessment", "A broader review of the security surface.", "/request?service=Security%20Assessment"],
  ["Training", "Awareness, phishing and practical training.", "/request?service=Cybersecurity%20Awareness%20%2F%20Training"],
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAccount = async (currentSession) => {
    if (!supabase || !currentSession) return;
    const email = currentSession.user.email;
    const { data: rows, error } = await supabase
      .from("inquiries")
      .select("id, created_at, service, message, organization, name, email, status")
      .eq("email", email)
      .order("created_at", { ascending: false });
    if (error) setStatus(error.message);
    setItems(rows || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data?.session) { navigate("/login", { replace: true }); return; }
      setSession(data.session);
      await loadAccount(data.session);
    });
    const { data: auth } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!active) return;
      setSession(currentSession || null);
      if (!currentSession) navigate("/login", { replace: true });
    });
    return () => { active = false; auth.subscription.unsubscribe(); };
  }, [navigate]);

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((x) => !["Completed", "Closed"].includes(x.status || "Received")).length,
    completed: items.filter((x) => ["Completed", "Closed"].includes(x.status || "Received")).length,
  }), [items]);

  if (!hasSupabase || !supabase) {
    return <section className="page-pad inner-page"><Seo title="Account" description="KAVACH customer account." path="/account" noindex /><div className="page-title"><span className="section-no">ACCOUNT</span><h1>Account service<br /><em>not configured.</em></h1></div></section>;
  }

  const name = session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0] || "there";

  return (
    <section className="page-pad inner-page account-page">
      <Seo title="Customer Account" description="Manage KAVACH cybersecurity service requests from your customer account." path="/account" noindex />
      <div className="account-head">
        <div><span className="section-no">ACCOUNT / PRIVATE SPACE</span><h1>Hello,<br /><em>{name}.</em></h1><p>{session?.user?.email}</p></div>
        <button className="btn btn-dark" onClick={logout}>Logout</button>
      </div>

      <div className="account-stats">
        <div><span>ALL REQUESTS</span><strong>{stats.total}</strong></div>
        <div><span>ACTIVE</span><strong>{stats.active}</strong></div>
        <div><span>COMPLETED</span><strong>{stats.completed}</strong></div>
        <div><span>ACCOUNT</span><strong>ACTIVE</strong></div>
      </div>

      <div className="account-actions">
        <Link className="account-action accent-lime account-action-primary" to="/request"><span>01 / NEW ORDER</span><strong>Start a new security request ↗</strong><small>Choose a KAVACH service and send the scope.</small></Link>
        <Link className="account-action accent-blue" to="/services"><span>02 / SERVICES</span><strong>Explore security services ↗</strong><small>See what KAVACH can help assess and secure.</small></Link>
        <Link className="account-action accent-purple" to="/pricing"><span>03 / PRICING</span><strong>View service pricing ↗</strong><small>Review current launch, annual and institute plans.</small></Link>
      </div>

      <div className="account-service-panel">
        <div className="account-section-head"><div><span className="section-no">04 / QUICK ORDER</span><h2>Choose a service<br /><em>and start.</em></h2></div><Link className="text-link" to="/request">Open full request form →</Link></div>
        <div className="account-service-grid">{quickServices.map(([title, desc, to], index) => <Link key={title} to={to}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{desc}</p><b>↗</b></Link>)}</div>
      </div>

      <div className="account-section-head account-history-head"><div><span className="section-no">05 / YOUR REQUESTS</span><h2>Security work<br /><em>in one place.</em></h2></div><Link className="btn" to="/contact">Talk to KAVACH ↗</Link></div>
      {loading ? <div className="empty-state">Loading your requests...</div> : status ? <div className="form-status">{status}</div> : items.length ? <div className="account-orders">{items.map((item, index) => <article key={item.id}><div className="order-index">{String(index + 1).padStart(2, "0")}</div><div><span className="section-no">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "REQUEST"}</span><h3>{item.service}</h3><p>{item.organization || "KAVACH customer request"}</p><div className="order-message"><b>Requirement</b><span>{item.message}</span></div></div><span className="order-status">{item.status || "RECEIVED"}</span></article>)}</div> : <div className="empty-account"><img src="/assets/kavach-turtle-logo.png" alt="KAVACH guardian" /><div><span className="section-no">NO REQUESTS YET</span><h3>Ready when you are.</h3><p>Choose a service above and send your first request to the KAVACH team.</p><Link className="btn btn-dark" to="/request">Create new order ↗</Link></div></div>}
    </section>
  );
}
