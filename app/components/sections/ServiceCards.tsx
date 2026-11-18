import {Link} from 'react-router'
import type {ServiceCardsSection} from '~/types'
import {Figure} from '../ui/Figure'
import {Section as Wrapper, toneMuted} from '../ui/Section'
import {Reveal} from '../ui/Reveal'
import {LineIcon} from '../ui/LineIcon'
import {opt} from '~/lib/stega'

export function ServiceCards({section}: {section: ServiceCardsSection}) {
  const {heading, intro, appearance} = section
  const cards = section.cards ?? []
  const tone = opt(appearance?.tone)
  const onDark = tone === 'lake'
  const muted = toneMuted(tone)
  // Card titles sit one level under the section heading. On the homepage the
  // cards have no heading and follow the H1 directly, where H3s would skip a
  // level and break the outline screen readers navigate by.
  const CardTitle = heading ? 'h3' : 'h2'

  return (
    <Wrapper appearance={appearance} grainSeed={section._key} reveal={false}>
      {heading ? (
        <Reveal className="mb-14 max-w-[60ch]">
          <h2 className={`u-h2 ${onDark ? 'text-cream' : 'text-lake'}`}>{heading}</h2>
          {intro ? <p className={`mt-5 text-lg ${muted}`}>{intro}</p> : null}
        </Reveal>
      ) : null}

      <div className={`grid gap-6 sm:grid-cols-2 ${cards.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {cards.map((c, i) => {
          return (
            <Reveal key={c._key ?? i} delay={Math.min(i, 4) * 110} className="h-full">
            <Link
              to={c.href ?? '#'}
              className={`group flex h-full flex-col overflow-hidden rounded-[1.25rem] no-underline shadow-[0_1px_2px_rgba(14,74,67,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(14,74,67,0.14)] ${
                onDark ? 'bg-cream/10' : 'bg-white'
              }`}
            >
              <div className="relative">
                <Figure
                  image={c.image}
                  rounded={false}
                  aspect={4 / 3}
                  className="aspect-[4/3] overflow-hidden"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes={{cols: {base: 1, sm: 2, lg: cards.length >= 4 ? 4 : 3}, gap: 24}}
                />
                {c.icon ? (
                  <span className="absolute -bottom-6 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-lake shadow-sm">
                    <LineIcon name={c.icon} className="h-7 w-7" />
                  </span>
                ) : null}
              </div>
              <div className={`flex flex-1 flex-col px-5 pb-6 ${c.icon ? 'pt-9' : 'pt-5'}`}>
                <CardTitle className={`text-lg font-bold ${onDark ? 'text-cream' : 'text-lake'}`}>
                  {c.title}
                </CardTitle>
                {c.summary ? <p className={`mt-3 flex-1 text-sm ${muted}`}>{c.summary}</p> : null}
                <span
                  className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${
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
