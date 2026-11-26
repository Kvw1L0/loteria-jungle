(function () {
  const STORAGE_KEY = "whitelabel_brand_config_v1";

  function decodeBase64Json(str) {
    try {
      const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function loadCustomConfig() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("c");
    if (encoded) {
      const parsed = decodeBase64Json(encoded);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore storage errors
    }

    return null;
  }

  const baseConfig = window.BRAND_CONFIG || {};
  const customConfig = loadCustomConfig();
  const config = Object.assign({}, baseConfig, customConfig || {});

  // Derive ballStyles automatically if custom colors were provided without explicit ballStyles
  if (customConfig && !customConfig.ballStyles && (customConfig.primaryColor || customConfig.secondaryColor)) {
    const p = config.primaryColor || "#ffd500";
    const s = config.secondaryColor || "#ff9900";
    const d = config.darkColor || "#111111";
    config.ballStyles = [
      { bg1: "#ffffff", bg2: p, bg3: s, text: d },
      { bg1: "#555555", bg2: "#1f1f1f", bg3: "#050505", text: p },
      { bg1: "#ffffff", bg2: "#fff6cc", bg3: p, text: d },
      { bg1: "#ffffff", bg2: p, bg3: "#222222", text: d }
    ];
    config.particleColors = [p, "#ffffff", s];
    config.confettiColors = [p, config.accentColor || "#01afff", "#ffffff", s, d];
  }

  window.ACTIVE_BRAND_CONFIG = config;
  window.BRAND_STORAGE_KEY = STORAGE_KEY;

  // Load Google Font dynamically if different or needed
  if (config.fontFamily) {
    const fontId = "dynamic-brand-font";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      const familyParam = encodeURIComponent(config.fontFamily).replace(/%20/g, "+");
      link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;700;800&display=swap`;
      document.head.appendChild(link);
    }
  }

  // Apply CSS variables to :root
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", config.primaryColor || "#ffd500");
  root.style.setProperty("--brand-secondary", config.secondaryColor || "#ff9900");
  root.style.setProperty("--brand-accent", config.accentColor || "#01afff");
  root.style.setProperty("--brand-dark", config.darkColor || "#111111");
  root.style.setProperty("--brand-cell-bg", config.cellBgColor || "rgba(255, 255, 255, 0.96)");
  root.style.setProperty("--brand-cell-text", config.cellTextColor || "#111111");
  root.style.setProperty("--brand-whatsapp-bg", config.whatsappBgColor || "#25d366");
  root.style.setProperty("--brand-font", `'${config.fontFamily || "Luckiest Guy"}', sans-serif`);

  if (config.backgroundUrl) {
    root.style.setProperty("--brand-bg-image", `url('${config.backgroundUrl}')`);
  }
})();
