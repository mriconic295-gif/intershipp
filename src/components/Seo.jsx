import { useEffect } from "react";

const siteUrl = "https://kavachsolutions.in";

export default function Seo({ title, description, path = "", noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | KAVACH Solutions` : "KAVACH Solutions | Cybersecurity & Security Solutions";
    document.title = fullTitle;

    const setMeta = (name, content) => {
      let el = document.head.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setProperty = (property, content) => {
      let el = document.head.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("author", "KAVACH Solutions");
    setProperty("og:title", fullTitle);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:url", `${siteUrl}${path}`);
    setProperty("og:image", `${siteUrl}/assets/kavach-logo.png`);
    setProperty("og:site_name", "KAVACH Solutions");
    setProperty("twitter:card", "summary_large_image");
    setProperty("twitter:title", fullTitle);
    setProperty("twitter:description", description);
    setProperty("twitter:image", `${siteUrl}/assets/kavach-logo.png`);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${path}`;
  }, [title, description, path, noindex]);

  return null;
}
