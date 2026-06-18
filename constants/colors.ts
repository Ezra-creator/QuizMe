const Colors = {
  bg: "#0A0A0F",
  card: "#13131A",
  border: "#1E1E2E",
  accent: "#7C3AED",
  accentLight: "#A78BFA",
  accentGlow: "rgba(124, 58, 237, 0.2)",
  green: "#10B981",
  greenGlow: "rgba(16, 185, 129, 0.2)",
  red: "#EF4444",
  redGlow: "rgba(239, 68, 68, 0.2)",
  text: "#F8F8FF",
  muted: "#6B6B8A",
  gold: "#F59E0B",
  white: "#FFFFFF",
} as const;

export type ColorKey = keyof typeof Colors;
export default Colors;
