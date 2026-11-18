import type {CatchesSection, SiteSettings} from '~/types'
import {Figure} from '../ui/Figure'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {Reveal} from '../ui/Reveal'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

const DAY = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'})

function formatDate(date?: string) {
  if (!date) return ''
  const d = new Date(`${date}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? date : DAY.format(d)
}

/**
 * Recent catches: the newest catch reports from Studio, as photo cards. Renders
 * nothing until there is at least one, so it can sit on a page ahead of time.
 */
export function Catches({section, settings}: {section: CatchesSection; settings?: SiteSettings}) {
  const {eyebrow, heading, intro, buttons, appearance} = section
  const items = (section.items ?? []).slice(0, section.limit ?? 6)
  if (!items.length) return null

  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)

  return (
    <Wrapper appearance={appearance} reveal={false}>
      <Reveal>
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />
      </Reveal>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {items.map((c, i) => (
          <Reveal as="li" key={c._id ?? i} delay={Math.min(i, 5) * 80}>
            {c.photo ? (
              <Figure image={c.photo} aspect={1} sizes={{cols: {base: 2, md: 3}, gap: {base: 16, md: 24}}} />
            ) : null}
            <p className={`mt-3 font-display text-lg ${onDark ? 'text-cream' : 'text-lake'}`}>
              {[c.weight, c.species].filter(Boolean).join(' ')}
            </p>
            <p className={`text-sm ${muted}`}>
              <time dateTime={c.date}>{formatDate(c.date)}</time>
              {c.angler ? ` · ${c.angler}` : ''}
              {c.note ? ` · ${c.note}` : ''}
            </p>
          </Reveal>
        ))}
      </ul>

      <ButtonRow buttons={buttons} settings={settings} tone={tone} className="mt-10" />
    </Wrapper>
  )
}
