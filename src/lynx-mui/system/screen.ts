/**
 * Lynx engine global with physical-pixel screen metrics.
 * Not declared by `@lynx-js/types`, so we declare the subset we read.
 * @see https://lynxjs.org/api/lynx-api/global/system-info.html
 */
declare const SystemInfo:
  | {
      readonly pixelWidth?: number
      readonly pixelHeight?: number
      readonly pixelRatio?: number
    }
  | undefined

/**
 * Current viewport width in CSS px (= physical `pixelWidth / pixelRatio`).
 *
 * On Lynx `SystemInfo` is a static global ("cannot be updated after init"),
 * so this is read fresh per render but is NOT reactive to rotation/resize —
 * this is an inherent platform constraint, not a degradation we chose.
 * Falls back to 0 (mobile-first) when `SystemInfo` is unavailable (e.g. a
 * headless build), which yields the smallest-breakpoint value/`down()` match.
 */
export function getScreenWidth(): number {
  if (typeof SystemInfo === 'undefined' || SystemInfo == null) return 0
  const w = SystemInfo.pixelWidth
  if (typeof w !== 'number' || w <= 0) return 0
  const ratio =
    typeof SystemInfo.pixelRatio === 'number' && SystemInfo.pixelRatio > 0
      ? SystemInfo.pixelRatio
      : 1
  return w / ratio
}
