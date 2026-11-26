// Configuración central de marca (White-Label)
// Edita este archivo o genera uno nuevo desde configurar.html
window.BRAND_CONFIG = {
  brandName: "JUNGLE",
  logoUrl: "logo-jungle.png",
  logoOutline: true,
  backgroundUrl: "fondo-jungle.jpg",

  // Tipografía (Google Fonts)
  fontFamily: "Luckiest Guy",

  // Paleta de colores
  primaryColor: "#ffd500",
  secondaryColor: "#ff9900",
  accentColor: "#01afff",
  darkColor: "#111111",
  cellBgColor: "rgba(255, 255, 255, 0.96)",
  cellTextColor: "#111111",
  whatsappBgColor: "#25d366",

  // Reglas del juego
  totalNumbers: 20,
  cardSize: 6,
  gridColumns: 3,

  // WhatsApp al completar cartón
  whatsappPhone: "56986532423",
  whatsappMessage: "¡LOTERÍA JUNGLE! Completé mi cartón con los números: {numbers}",

  // Colores de confeti y partículas
  confettiColors: ["#ffd500", "#01afff", "#ffffff", "#25d366", "#111111"],
  particleColors: ["#ffd500", "#ffffff", "#ffae00"],

  // Estilos de bolitas dentro de la tómbola
  ballStyles: [
    { bg1: "#ffffff", bg2: "#ffe96b", bg3: "#f5a600", text: "#111111" },
    { bg1: "#555555", bg2: "#1f1f1f", bg3: "#050505", text: "#ffd500" },
    { bg1: "#ffffff", bg2: "#fff3a8", bg3: "#ffd500", text: "#111111" },
    { bg1: "#fff8d6", bg2: "#ffd500", bg3: "#c77d00", text: "#111111" }
  ]
};
