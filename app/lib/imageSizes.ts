/**
 * Builds an <img sizes> value from how an image is laid out, instead of
 * guessing in vw.
 *
 * `sizes` is what the browser uses to pick a file from srcset, and it is
 * evaluated before any CSS has loaded, so it has to describe the layout in
 * media queries. Hand-written values like "(min-width: 1024px) 50vw, 100vw"
 * ignore the page gutter, the grid gap and the container's max width. Across a
 * phone screen that error is enough to push the choice up a whole step: a card
 * drawn 364px wide on a 412px phone at 1.75x would ask for 721px and get the
 * 828px file, which is what Lighthouse flagged.
 *
 * These numbers mirror app.css. Change them together:
 *   .u-container  max-width 90rem (1440px), padding-inline 1.5rem, 3rem from 64rem
 *   Tailwind breakpoints sm 640, md 768, lg 1024, xl 1280, 2xl 1536
 */

const CONTAINER_MAX = 1440
const GUTTER = 24
const GUTTER_LG = 48
const LG = 1024

const BREAKPOINTS = {sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536} as const
type Breakpoint = keyof typeof BREAKPOINTS

/** Columns per breakpoint, Tailwind-style: {base: 1, md: 2, lg: 3}. */
export type Columns = number | ({base?: number} & Partial<Record<Breakpoint, number>>)

/** Grid gap in px per breakpoint, same shape as Columns. */
export type Gap = number | ({base?: number} & Partial<Record<Breakpoint, number>>)

export type SizesLayout = {
  /** Columns the image's grid has at each breakpoint. Default 1. */
  cols?: Columns
  /** Gap between those columns in px. Default 0. */
  gap?: Gap
  /**
   * The image escapes the container and runs edge to edge (heroes, banners).
   * `fraction` is the share of the viewport it covers from `bleedFrom` up,
   * e.g. a hero photo in a 1.2fr / 1fr grid is 1.2 / 2.2.
   */
  bleed?: boolean
  fraction?: number
  bleedFrom?: Breakpoint
  /** A hard cap on rendered width in px, e.g. a 720px prose column. */
  max?: number
}

function at<T extends number>(value: number | ({base?: number} & Partial<Record<Breakpoint, number>>), bp: Breakpoint | 'base', fallback: T): number {
  if (typeof value === 'number') return value
  // Mobile-first: the value in force at `bp` is the nearest one at or below it.
  const order: (Breakpoint | 'base')[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl']
  let current: number = fallback
  for (const key of order) {
    const v = value[key as keyof typeof value]
    if (typeof v === 'number') current = v
    if (key === bp) break
  }
  return current
}

const round = (n: number) => Math.round(n * 100) / 100

/**
 * One `sizes` entry for a viewport range: the image width as a calc() of vw,
 * or a fixed px value once the container has stopped growing.
 */
function widthAt(bp: Breakpoint | 'base', layout: SizesLayout, capped: boolean): string {
  const cols = at(layout.cols ?? 1, bp, 1)
  const gap = at(layout.gap ?? 0, bp, 0)
  const minWidth = bp === 'base' ? 0 : BREAKPOINTS[bp]

  if (layout.bleed) {
    const from = layout.bleedFrom ? BREAKPOINTS[layout.bleedFrom] : 0
    const fraction = minWidth >= from ? (layout.fraction ?? 1) : 1
    const vw = round((100 * fraction) / cols)
    return layout.max ? `min(${vw}vw, ${layout.max}px)` : `${vw}vw`
  }

  const gutter = minWidth >= LG ? GUTTER_LG : GUTTER
  const gaps = gap * (cols - 1)

  if (capped) {
    const px = Math.round((CONTAINER_MAX - gutter * 2 - gaps) / cols)
    return `${layout.max ? Math.min(px, layout.max) : px}px`
  }

  const inner = gutter * 2 + gaps
  const expr = cols === 1 ? `100vw - ${inner}px` : `(100vw - ${inner}px) / ${cols}`
  return layout.max ? `min(calc(${expr}), ${layout.max}px)` : `calc(${expr})`
}

/**
 * sizes({cols: {base: 1, md: 2, lg: 3}, gap: 24})
 *   → "(min-width: 1440px) 432px, (min-width: 1024px) calc((100vw - 144px) / 3),
 *      (min-width: 768px) calc((100vw - 72px) / 2), calc(100vw - 48px)"
 */
export function sizes(layout: SizesLayout = {}): string {
  const entries: string[] = []

  // Past the container's max width every in-container image is a fixed size.
  if (!layout.bleed) entries.push(`(min-width: ${CONTAINER_MAX}px) ${widthAt('xl', layout, true)}`)

  // Only breakpoints where something actually changes need an entry.
  const points: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm']
  let last = ''
  const tail = widthAt('base', layout, false)
  const ranges: string[] = []
  for (const bp of points) {
    if (!layout.bleed && BREAKPOINTS[bp] >= CONTAINER_MAX) continue
    const w = widthAt(bp, layout, false)
    ranges.push(`${bp}|${w}`)
  }
  // Walk smallest → largest, keeping a breakpoint only when its width differs
  // from the one below it; then emit largest-first, as `sizes` requires.
  const kept: string[] = []
  for (const r of ranges.reverse()) {
    const [bp, w] = r.split('|') as [Breakpoint, string]
    if (w !== (last || tail)) kept.push(`(min-width: ${BREAKPOINTS[bp]}px) ${w}`)
    last = w
  }
  entries.push(...kept.reverse(), tail)
  return entries.join(', ')
}
