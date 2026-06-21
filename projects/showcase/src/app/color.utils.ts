/** Convert a 3- or 6-digit hex string to HSL [0-360, 0-100, 0-100]. */
export function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let sat = 0;
  const lit = (max + min) / 2;

  if (delta !== 0) {
    sat = delta / (1 - Math.abs(2 * lit - 1));
    switch (max) {
      case r: hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6; break;
      case g: hue = ((b - r) / delta + 2) / 6; break;
      default: hue = ((r - g) / delta + 4) / 6; break;
    }
  }
  return [Math.round(hue * 360), Math.round(sat * 100), Math.round(lit * 100)];
}

/** Convert HSL (h: 0-360, s: 0-100, l: 0-100) to hex. */
export function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100;
  const ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Return white or a dark colour for readable text on the given background. */
export function contrastColor(hex: string): string {
  const [, , l] = hexToHsl(hex);
  return l > 55 ? '#1e1b2e' : '#ffffff';
}

/** Clamp value between min and max. */
function clamp(val: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, val));
}

/** Generate semantic token overrides for the Brand Primary colour. */
export function generatePrimaryScale(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex);
  return {
    '--color-brand-primary':           hex,
    '--color-brand-primary-subtle':    hslToHex(h, clamp(s, 20, 80), 96),
    '--color-brand-primary-muted':     hslToHex(h, clamp(s, 20, 80), 90),
    '--color-interactive-default':     hex,
    '--color-interactive-hover':       hslToHex(h, s, clamp(l - 10, 10, 90)),
    '--color-interactive-active':      hslToHex(h, s, clamp(l - 18, 8, 85)),
    '--color-on-interactive':          contrastColor(hex),
    '--color-border-interactive':      hex,
    '--focus-ring-color':              hslToHex(h, s, clamp(l + 10, 20, 80)) + '66',
  };
}

/** Generate semantic token overrides for the Success colour. */
export function generateSuccessScale(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex);
  return {
    '--color-success-default':  hex,
    '--color-success-hover':    hslToHex(h, s, clamp(l - 10, 10, 90)),
    '--color-success-subtle':   hslToHex(h, clamp(s, 20, 80), 96),
    '--color-success-muted':    hslToHex(h, clamp(s, 20, 80), 88),
    '--color-border-success':   hex,
    '--color-text-success':     hslToHex(h, s, clamp(l - 22, 15, 55)),
    '--color-on-success':       contrastColor(hex),
  };
}

/** Generate semantic token overrides for the Warning colour. */
export function generateWarningScale(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex);
  return {
    '--color-warning-default':  hex,
    '--color-warning-hover':    hslToHex(h, s, clamp(l - 10, 10, 90)),
    '--color-warning-subtle':   hslToHex(h, clamp(s, 20, 80), 96),
    '--color-warning-muted':    hslToHex(h, clamp(s, 20, 80), 88),
    '--color-border-warning':   hex,
    '--color-text-warning':     hslToHex(h, s, clamp(l - 22, 15, 55)),
    '--color-on-warning':       contrastColor(hex),
  };
}

/** Generate semantic token overrides for the Danger / Error colour. */
export function generateDangerScale(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex);
  return {
    '--color-danger-default':   hex,
    '--color-danger-hover':     hslToHex(h, s, clamp(l - 10, 10, 90)),
    '--color-danger-subtle':    hslToHex(h, clamp(s, 20, 80), 96),
    '--color-danger-muted':     hslToHex(h, clamp(s, 20, 80), 88),
    '--color-border-danger':    hex,
    '--color-text-danger':      hslToHex(h, s, clamp(l - 22, 15, 55)),
    '--color-on-danger':        contrastColor(hex),
  };
}

/** Generate semantic token overrides for the Info / Accent colour. */
export function generateInfoScale(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex);
  return {
    '--color-info-default':     hex,
    '--color-info-hover':       hslToHex(h, s, clamp(l - 10, 10, 90)),
    '--color-info-subtle':      hslToHex(h, clamp(s, 20, 80), 96),
    '--color-info-muted':       hslToHex(h, clamp(s, 20, 80), 88),
    '--color-border-info':      hex,
    '--color-text-info':        hslToHex(h, s, clamp(l - 22, 15, 55)),
  };
}

/** Merge all five scale generators into one flat token map. */
export function buildTokenMap(colors: {
  primary: string;
  success: string;
  warning: string;
  danger:  string;
  info:    string;
}): Record<string, string> {
  return {
    ...generatePrimaryScale(colors.primary),
    ...generateSuccessScale(colors.success),
    ...generateWarningScale(colors.warning),
    ...generateDangerScale(colors.danger),
    ...generateInfoScale(colors.info),
  };
}
