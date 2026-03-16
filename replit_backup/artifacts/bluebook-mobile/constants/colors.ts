const C = {
  // Backgrounds
  bg: "#F5F3EE",
  bgCard: "#FFFFFF",
  bgSurface: "#EDEBE5",

  // Brand greens
  green900: "#1A3327",
  green800: "#1F3D2E",
  green700: "#2D6A4F",
  green600: "#3A8C66",
  green500: "#52B788",
  green100: "#D8F3DC",

  // Text
  text: "#1A2E1E",
  textSecondary: "#5A6B5E",
  textMuted: "#94A89A",

  // Accents / status
  amber: "#F4A261",
  amberBg: "#FFF3E4",
  red: "#D62828",
  redBg: "#FDEAEA",
  yellow: "#E9C46A",
  yellowBg: "#FFF8E1",
  blue: "#457B9D",
  blueBg: "#EAF2F8",

  // Borders
  border: "#DDD9D0",
  borderLight: "#ECEAE3",

  // White / dark
  white: "#FFFFFF",
  black: "#0D1B11",

  // Tab bar
  tabActive: "#2D6A4F",
  tabInactive: "#94A89A",
};

export default {
  light: {
    text: C.text,
    background: C.bg,
    tint: C.green700,
    tabIconDefault: C.tabInactive,
    tabIconSelected: C.tabActive,
  },
  ...C,
};
