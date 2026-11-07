/** Canvas colours read from the design tokens so the scene follows the active theme. */
export type Rgb = readonly [number, number, number];

export interface Palette {
  accent: Rgb;
  accent2: Rgb;
  signal: Rgb;
  text: string;
  fontMono: string;
}

/* Mirrors the dark values in tokens.css; used only when a token cannot be read. */
const FALLBACK: Palette = {
  accent: [76, 201, 240],
  accent2: [124, 245, 214],
  signal: [255, 180, 84],
  text: '#e8eef7',
  fontMono: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
};

/** Parses `#rgb` or `#rrggbb`; anything else yields undefined. */
export function parseHex(value: string): Rgb | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  const hex = match?.[1];
  if (hex === undefined) return undefined;
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Reads the tokens the canvas needs from the document root. */
export function readPalette(): Palette {
  if (typeof document === 'undefined' || typeof getComputedStyle !== 'function') return FALLBACK;
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return {
    accent: parseHex(read('--accent')) ?? FALLBACK.accent,
    accent2: parseHex(read('--accent-2')) ?? FALLBACK.accent2,
    signal: parseHex(read('--signal')) ?? FALLBACK.signal,
    text: read('--text') || FALLBACK.text,
    fontMono: read('--font-mono') || FALLBACK.fontMono,
  };
}

/** Formats a token colour with an alpha clamped to [0, 1]. */
export function rgba(color: Rgb, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${String(color[0])},${String(color[1])},${String(color[2])},${a.toFixed(3)})`;
}
