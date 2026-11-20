/** Oxocarbon Dark, by shaunsingh/IBM (MIT): one family for the whole UI.
 * Source: https://github.com/nyoom-engineering/base16-oxocarbon
 * Use neutral layers for surfaces; reserve accents for actions, states and data.
 */
export const oxocarbon = {
  background: "#161616", surface: "#262626", overlay: "#393939", border: "#525252",
  secondary: "#dde1e6", text: "#f2f4f8", bright: "#ffffff", teal: "#08bdba",
  cyan: "#3ddbd9", blue: "#78a9ff", magenta: "#ee5396", sky: "#33b1ff",
  pink: "#ff7eb6", green: "#42be65", violet: "#be95ff", ice: "#82cfff",
} as const;

export const domainColours = {
  air: oxocarbon.ice, water: oxocarbon.blue, earth: oxocarbon.green, fire: oxocarbon.pink,
} as const;

export const seriesColours = {
  workshop:oxocarbon.pink, water:oxocarbon.blue, sight:oxocarbon.cyan,
  time:oxocarbon.violet, ground:oxocarbon.green, air:oxocarbon.ice,
} as const;

/** Astro serializes these on <html>; SVG/canvas helpers consume the same values. */
export const siteTheme = {
  "--black": oxocarbon.background,
  "--page": oxocarbon.background,
  "--surface": oxocarbon.surface,
  "--raised": oxocarbon.overlay,
  "--ink": oxocarbon.text,
  "--chalk": oxocarbon.text,
  "--ink-hi": oxocarbon.bright,
  "--dim": oxocarbon.secondary,
  "--faint": oxocarbon.secondary,
  "--line": oxocarbon.overlay,
  "--line-2": oxocarbon.border,
  "--control-border": oxocarbon.secondary,
  "--navy": oxocarbon.surface,
  "--water": domainColours.water,
  "--earth": domainColours.earth,
  "--fire": domainColours.fire,
  "--air": domainColours.air,
  "--c": oxocarbon.blue,
  "--blue": oxocarbon.blue,
  "--blue-dim": oxocarbon.border,
  "--red": oxocarbon.magenta,
  "--red-dim": oxocarbon.surface,
  "--sun": oxocarbon.pink,
  "--action": oxocarbon.pink,
  "--instrument": oxocarbon.blue,
  "--accent": oxocarbon.blue,
  "--measured": oxocarbon.cyan,
  "--success": oxocarbon.green,
  "--failure": oxocarbon.magenta,
  "--medium": oxocarbon.sky,
  "--estimate": oxocarbon.violet,
  "--me": oxocarbon.pink,
} as const;
