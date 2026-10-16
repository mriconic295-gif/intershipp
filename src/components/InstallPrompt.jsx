import React, { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [event, setEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("kavach-install-prompt-seen") === "1";
    if (seen) return undefined;
    const handler = (e) => { e.preventDefault(); setEvent(e); setVisible(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const close = () => { localStorage.setItem("kavach-install-prompt-seen", "1"); setVisible(false); setEvent(null); };
  const install = async () => {
    if (!event) return close();
    await event.prompt();
    await event.userChoice;
    close();
  };

  if (!visible) return null;
  return <aside className="install-prompt" role="dialog" aria-label="Install KAVACH"><div className="install-orb"><img src="/assets/kavach-logo.png" alt=""/></div><div><span className="section-no">KAVACH / APP MODE</span><strong>Install KAVACH</strong><p>Keep the security workspace one tap away.</p></div><button className="install-now" onClick={install}>Install ↗</button><button className="install-close" onClick={close} aria-label="Close">×</button></aside>;
}
