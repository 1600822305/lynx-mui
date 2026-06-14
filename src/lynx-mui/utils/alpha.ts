/** Apply an alpha channel to a hex or rgb(a) color string. Mirrors MUI's `alpha()`. */
export function alpha(color: string, value: number): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const full = hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${value})`
  }
  if (color.startsWith('rgba(')) {
    const inner = color.slice(5, -1).split(',').slice(0, 3).map((s) => s.trim())
    return `rgba(${inner.join(', ')}, ${value})`
  }
  if (color.startsWith('rgb(')) {
    const inner = color.slice(4, -1).trim()
    return `rgba(${inner}, ${value})`
  }
  return color
}
