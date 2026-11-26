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

  function buildConfig(customConfig) {
    const baseConfig = window.BRAND_CONFIG || {};
    const config = Object.assign({}, baseConfig, customConfig || {});

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

    return config;
  }

  function applyTheme(config) {
    window.ACTIVE_BRAND_CONFIG = config;

    if (config.fontFamily) {
      let link = document.getElementById("dynamic-brand-font");
      if (!link) {
        link = document.createElement("link");
        link.id = "dynamic-brand-font";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      const familyParam = encodeURIComponent(config.fontFamily).replace(/%20/g, "+");
      const targetHref = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;700;800&display=swap`;
      if (link.href !== targetHref) {
        link.href = targetHref;
      }
    }

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
  }

  const params = new URLSearchParams(window.location.search);
  const urlEncoded = params.get("c");
  const isPreview = params.has("preview");

  let initialCustom = null;
  if (urlEncoded) {
    initialCustom = decodeBase64Json(urlEncoded);
  } else {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) initialCustom = JSON.parse(saved);
    } catch {}
  }

  applyTheme(buildConfig(initialCustom));
  window.BRAND_STORAGE_KEY = STORAGE_KEY;

  async function resolveBrand() {
    // If ?c= or ?preview=1 is used, respect that directly without overriding from cloud
    if (!urlEncoded && !isPreview && window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch(`/api/brand?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.config) {
            const cloudCfg = buildConfig(data.config);
            applyTheme(cloudCfg);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.config));
            } catch {}
            return cloudCfg;
          } else if (data && data.config === null) {
            // Cloud was reset to default JUNGLE
            try {
              localStorage.removeItem(STORAGE_KEY);
            } catch {}
            const defaultCfg = buildConfig(null);
            applyTheme(defaultCfg);
            return defaultCfg;
          }
        }
      } catch {
        // Offline or static local server without /api/brand: keep local/default
      }
    }
    return window.ACTIVE_BRAND_CONFIG;
  }

  window.brandReady = resolveBrand().then((cfg) => {
    if (document.body) {
      document.body.classList.add("brand-ready");
    } else {
      window.addEventListener("DOMContentLoaded", () => document.body.classList.add("brand-ready"));
    }
    return cfg;
  });
})();
