import {
  Big_Shoulders_Stencil,
  Big_Shoulders,
  Fraunces,
  DM_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";

export const fontDisplay = Big_Shoulders_Stencil({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const fontDisplayAlt = Big_Shoulders({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display-alt",
  display: "swap",
});

export const fontSerif = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const fontSansAlt = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-alt",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontDisplayAlt.variable,
  fontSerif.variable,
  fontSans.variable,
  fontSansAlt.variable,
  fontMono.variable,
].join(" ");
