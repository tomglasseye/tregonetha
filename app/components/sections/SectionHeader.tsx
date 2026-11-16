import type {Tone} from '~/types'
import {Squiggle} from '../ui/Section'
import {opt} from '~/lib/stega'

/** Eyebrow, heading with the orange squiggle, and intro — shared by the newer sections. */
export function SectionHeader({
  eyebrow,
  heading,
  intro,
  tone,
  className = 'mb-12 max-w-[62ch]',
}: {
  eyebrow?: string
  heading?: string
  intro?: string
  tone?: Tone
  className?: string
}) {
  if (!eyebrow && !heading && !intro) return null
  const onDark = opt(tone) === 'lake'
  return (
    <div className={className}>
      {eyebrow ? (
        <p className={`u-eyebrow mb-4 ${onDark ? 'text-cream/80' : 'text-teal'}`}>{eyebrow}</p>
      ) : null}
      {heading ? (
        <>
          <h2 className={`u-h2 ${onDark ? 'text-cream' : 'text-lake'}`}>{heading}</h2>
          <Squiggle />
        </>
      ) : null}
      {intro ? (
        <p className={`mt-5 whitespace-pre-line text-lg ${onDark ? 'text-cream/85' : 'text-muted'}`}>
          {intro}
        </p>
      ) : null}
    </div>
  )
}
