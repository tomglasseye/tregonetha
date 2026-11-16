import type {EventsSection, SiteSettings} from '~/types'
import {Figure} from '../ui/Figure'
import {Button, ButtonRow} from '../ui/Button'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {Reveal} from '../ui/Reveal'
import {SectionHeader} from './SectionHeader'
import {opt} from '~/lib/stega'

const DAY = new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC'})

/** "2027-05-07" → "Fri 7 May". Dates are calendar days, so read them as UTC. */
function formatDay(date?: string) {
  if (!date) return ''
  const d = new Date(`${date}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? date : DAY.format(d)
}

/** What's On: upcoming events, newest-first by date, past ones already filtered by the query. */
export function Events({section, settings}: {section: EventsSection; settings?: SiteSettings}) {
  const {eyebrow, heading, intro, buttons, appearance} = section
  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)
  const card = onDark ? 'bg-cream/10' : tone === 'mist' ? 'bg-cream' : 'bg-mist-soft'
  const items = (section.items ?? []).slice(0, section.limit ?? 6)

  return (
    <Wrapper appearance={appearance} reveal={false}>
      <Reveal>
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} tone={tone} />
      </Reveal>

      {items.length ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((event, i) => {
            const when = [
              formatDay(event.startDate),
              event.endDate && event.endDate !== event.startDate ? `– ${formatDay(event.endDate)}` : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <Reveal
                as="li"
                key={event._id ?? i}
                delay={Math.min(i, 3) * 90}
                className={`flex flex-col overflow-hidden rounded-panel ${card}`}
              >
                {event.image?.asset || event.image?.url ? (
                  <Figure
                    image={event.image}
                    rounded={false}
                    aspect={3 / 2}
                    className="aspect-[3/2]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <p className={`u-eyebrow ${onDark ? 'text-cream/80' : 'text-teal'}`}>
                    <time dateTime={event.startDate}>{when}</time>
                    {event.time ? ` · ${event.time}` : ''}
                  </p>
                  <h3 className={`mt-2 font-display text-xl ${onDark ? 'text-cream' : 'text-lake'}`}>
                    {event.title}
                  </h3>
                  {event.description ? (
                    <p className={`mt-2 whitespace-pre-line text-sm ${muted}`}>{event.description}</p>
                  ) : null}
                  {event.button?.label ? (
                    <div className="mt-auto pt-5">
                      <Button cta={event.button} settings={settings} tone={tone} />
                    </div>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ul>
      ) : (
        <p className={`max-w-[60ch] text-lg ${muted}`}>{section.emptyMessage}</p>
      )}

      <ButtonRow buttons={buttons} settings={settings} tone={tone} className="mt-10" />
    </Wrapper>
  )
}
