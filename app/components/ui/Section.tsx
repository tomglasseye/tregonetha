import type {Appearance, Tone, Spacing, Pattern} from '~/types'
import {Reveal} from './Reveal'
import {opt} from '~/lib/stega'

const TONE: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  mist: 'bg-mist text-lake',
  lake: 'bg-lake text-cream',
}

const SPACING: Record<Spacing, string> = {
  normal: 'py-20 md:py-section',
  tight: 'py-12 md:py-section-tight',
  none: 'py-0',
}

/**
 * The wavy edge every section hangs over the top of the next one. Drawn in
 * `currentColor`, which the stylesheet sets to the section's own background.
 * Exported so the hero and footer can use the same shape.
 */
export function WaveEdge({className = 'u-wave'}: {className?: string}) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1440 56"
      preserveAspectRatio="none"
      focusable="false"
    >
      <path
        d="M0 0H1440V26C1180 54 960 2 720 26S260 50 0 22Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Faint flowing lines, as behind the homepage hero. */
export function WaveLines({stroke = 'currentColor', opacity = 0.18}: {stroke?: string; opacity?: number}) {
  return (
    <svg
      aria-hidden
      className="u-lines-art"
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      focusable="false"
    >
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M0 ${360 + i * 50}C240 ${320 + i * 50} 480 ${400 + i * 50} 720 ${360 + i * 50}S1200 ${
            320 + i * 50
          } 1440 ${370 + i * 50}`}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          opacity={opacity * (1 - i * 0.25)}
        />
      ))}
    </svg>
  )
}

/** The short orange wave under section headings. */
export function Squiggle({className = 'u-squiggle'}: {className?: string}) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 150 12" fill="none" focusable="false">
      <path
        d="M2 6Q14 0 26 6T50 6T74 6T98 6T122 6T148 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Wraps every section. Reads `sectionAppearance` so editors control colour
 * rhythm, spacing and the wave edge from Studio without a developer.
 */
export function Section({
  appearance,
  children,
  className = '',
  as: Tag = 'section',
  reveal = true,
}: {
  appearance?: Appearance
  children: React.ReactNode
  className?: string
  as?: 'section' | 'div' | 'footer' | 'header'
  /** Opt out where the section is already above the fold. */
  reveal?: boolean
  /** Kept for call-site compatibility; no longer used. */
  grainSeed?: string
}) {
  // Cleaned: these index into the TONE/SPACING maps below.
  const tone = (opt(appearance?.tone) ?? 'cream') as Tone
  const spacing = (opt(appearance?.spacing) ?? 'normal') as Spacing
  const pattern = (opt(appearance?.pattern) ?? 'none') as Pattern
  const waveEdge = appearance?.waveEdge !== false

  return (
    <Tag
      id={opt(appearance?.anchorId) || undefined}
      data-tone={tone}
      className={`${TONE[tone] ?? TONE.cream} ${SPACING[spacing] ?? SPACING.normal} ${
        waveEdge ? 'u-wave-edge' : 'relative'
      } ${className}`}
    >
      {pattern === 'lines' ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <WaveLines />
        </div>
      ) : null}
      <div className="u-container relative">{reveal ? <Reveal>{children}</Reveal> : children}</div>
      {waveEdge ? <WaveEdge /> : null}
    </Tag>
  )
}

/** Muted text that stays legible on a dark panel. */
export function toneMuted(tone?: Tone) {
  return opt(tone) === 'lake' ? 'text-cream/75' : 'text-muted'
}

export function toneRule(tone?: Tone) {
  return opt(tone) === 'lake' ? 'border-cream/20' : 'border-rule'
}

/** Heading colour for a tone. */
export function toneHeading(tone?: Tone) {
  return opt(tone) === 'lake' ? 'text-cream' : 'text-lake'
}
