import type {InfoListSection, SiteSettings} from '~/types'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {Reveal} from '../ui/Reveal'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

/** Label / detail pairs: seasons, opening times, parking, what's included. */
export function InfoList({section, settings}: {section: InfoListSection; settings?: SiteSettings}) {
  const {eyebrow, heading, intro, buttons, appearance} = section
  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)
  const layout = opt(section.layout) ?? 'rows'
  const items = section.items ?? []
  const rule = onDark ? 'border-cream/25' : 'border-rule'

  return (
    <Wrapper appearance={appearance} reveal={false}>
      <Reveal>
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />
      </Reveal>

      {layout === 'cards' ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item._key ?? i}
              delay={Math.min(i, 3) * 90}
              className={`rounded-panel p-6 ${onDark ? 'bg-cream/10' : tone === 'mist' ? 'bg-cream' : 'bg-mist-soft'}`}
            >
              <p className={`font-display text-xl ${onDark ? 'text-cream' : 'text-lake'}`}>{item.label}</p>
              {item.value ? <p className="mt-2 font-semibold">{item.value}</p> : null}
              {item.note ? <p className={`mt-2 whitespace-pre-line text-sm ${muted}`}>{item.note}</p> : null}
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal>
          <dl className={`max-w-3xl border-t border-dashed ${rule}`}>
            {items.map((item, i) => (
              <div
                key={item._key ?? i}
                className={`flex flex-col gap-1 border-b border-dashed py-4 sm:flex-row sm:justify-between sm:gap-8 ${rule}`}
              >
                <dt className={onDark ? 'text-cream/85' : 'text-muted'}>{item.label}</dt>
                <dd className="sm:text-right">
                  {item.value ? <span className="font-semibold">{item.value}</span> : null}
                  {item.note ? (
                    <span className={`block whitespace-pre-line text-sm ${muted}`}>{item.note}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      <ButtonRow buttons={buttons} settings={settings} tone={tone} className="mt-10" />
    </Wrapper>
  )
}
