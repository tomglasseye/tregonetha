import {Link} from 'react-router'
import type {ServiceCardsSection} from '~/types'
import {Figure} from '../ui/Figure'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {Reveal} from '../ui/Reveal'
import {opt} from '~/lib/stega'

export function ServiceCards({section}: {section: ServiceCardsSection}) {
  const {heading, intro, appearance} = section
  const cards = section.cards ?? []
  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)

  return (
    <Wrapper appearance={appearance} grainSeed={section._key} reveal={false}>
      {heading ? (
        <Reveal className="mb-14 max-w-[60ch]">
          <h2 className={`u-h2 ${onDark ? 'text-cream' : 'text-lake'}`}>{heading}</h2>
          {intro ? <p className={`mt-5 text-lg ${muted}`}>{intro}</p> : null}
        </Reveal>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => {
          return (
            <Reveal key={c._key ?? i} delay={Math.min(i, 4) * 110} className="h-full">
            <Link
              to={c.href ?? '#'}
              className={`group flex h-full flex-col overflow-hidden rounded-panel no-underline transition-colors ${
                onDark ? 'bg-cream/10 hover:bg-cream/15' : 'bg-mist-soft hover:bg-mist'
              }`}
            >
              <Figure
                image={c.image}
                rounded={false}
                aspect={4 / 3}
                className="aspect-[4/3] overflow-hidden"
                imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className={`text-xl font-display ${onDark ? 'text-cream' : 'text-lake'}`}>
                  {c.title}
                </h3>
                {c.summary ? <p className={`mt-3 flex-1 text-sm ${muted}`}>{c.summary}</p> : null}
                <span
                  className={`mt-5 inline-flex items-center gap-2 text-sm ${
                    onDark ? 'text-cream' : 'text-teal'
                  }`}
                >
                  Learn more
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
            </Reveal>
          )
        })}
      </div>
    </Wrapper>
  )
}
