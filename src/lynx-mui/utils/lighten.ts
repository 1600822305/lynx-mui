/**
 * Lighten / darken helpers mirroring `@mui/system`'s color manipulation.
 * Works with hex (#rgb / #rrggbb) and rgb/rgba strings.
 */

function parseColor(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const full = hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ]
  }
  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (match) return [Number(match[1]), Number(match[2]), Number(match[3])]
  return [0, 0, 0]
}

function clamp(val: number): number {
  return Math.min(255, Math.max(0, Math.round(val)))
}

/** Lighten a color by `coefficient` (0–1). Mirrors MUI `lighten()`. */
export function lighten(color: string, coefficient: number): string {
  const [r, g, b] = parseColor(color)
  return `rgb(${clamp(r + (255 - r) * coefficient)}, ${clamp(g + (255 - g) * coefficient)}, ${clamp(b + (255 - b) * coefficient)})`
}

/** Darken a color by `coefficient` (0–1). Mirrors MUI `darken()`. */
export function darken(color: string, coefficient: number): string {
  const [r, g, b] = parseColor(color)
  return `rgb(${clamp(r * (1 - coefficient))}, ${clamp(g * (1 - coefficient))}, ${clamp(b * (1 - coefficient))})`
}
