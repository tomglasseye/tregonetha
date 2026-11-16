import type {HeroSection, SiteSettings} from '~/types'
import {Figure} from '../ui/Figure'
import {ButtonRow} from '../ui/Button'
import {Section as Wrapper, WaveEdge, WaveLines} from '../ui/Section'
import {opt} from '~/lib/stega'
import {logoSrc} from '~/lib/logo'

/**
 * Three layouts. `full` is the homepage: a full-bleed lake photo with the logo
 * centred over it. `text` and `split` are the inner-page banners.
 */
export function Hero({section, settings}: {section: HeroSection; settings?: SiteSettings}) {
  const {eyebrow, heading, standfirst, image, buttons, appearance} = section
  const layout = opt(section.layout) ?? 'full'

  if (layout === 'full') {
    // Full-bleed lake photo with the logo, name and tagline centred over it, as
    // on the current site. With no photo yet it falls back to the dark lake
    // green, so cream text is never left on a pale background.
    const hasImage = Boolean(image?.asset ?? image?.url)
    const showLogo = section.showLogo !== false

    return (
      <section
        id={opt(appearance?.anchorId)}
        data-tone="lake"
        className="u-wave-edge bg-lake text-cream"
      >
        <div className="relative flex min-h-[34rem] items-center justify-center overflow-hidden md:min-h-[44rem]">
          {hasImage ? (
            <>
              <Figure
                image={image}
                priority
                sizes="100vw"
                rounded={false}
                className="absolute inset-0 h-full w-full"
              />
              {/* Editors upload whatever photo they have. A bright sky or
                  sunlit water leaves cream type unreadable, so the scrim is
                  strong enough to carry text on any of them. */}
              <div aria-hidden className="absolute inset-0 bg-lake/55" />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-lake/70 via-transparent to-lake/30"
              />
            </>
          ) : (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <WaveLines stroke="#2c7a6f" opacity={0.7} />
            </div>
          )}
          <div className="u-container relative flex flex-col items-center py-24 text-center md:py-32">
            {showLogo ? (
              <img
                src={logoSrc(settings, 320)}
                alt=""
                width={160}
                height={160}
                className="mb-6 h-28 w-28 md:h-40 md:w-40"
              />
            ) : null}
            <h1 className="u-display max-w-[18ch] text-cream">{heading}</h1>
            {eyebrow ? (
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.26em] text-cream/90">
                {eyebrow}
              </p>
            ) : null}
            {standfirst ? (
              <p className="mt-5 max-w-[46ch] text-lg text-cream/90">{standfirst}</p>
            ) : null}
            <ButtonRow
              buttons={buttons}
              settings={settings}
              tone="lake"
              className="mt-8 justify-center"
            />
          </div>
        </div>
        <WaveEdge />
      </section>
    )
  }

  if (layout === 'banner') {
    // Inner-page banner: a shorter photo band with the page title at the
    // bottom left, falling back to lake green with wavy lines.
    const hasImage = Boolean(image?.asset ?? image?.url)
    return (
      <section
        id={opt(appearance?.anchorId)}
        data-tone="lake"
        className="u-wave-edge bg-lake text-cream"
      >
        <div className="relative flex min-h-[20rem] items-end overflow-hidden md:min-h-[26rem]">
          {hasImage ? (
            <>
              <Figure
                image={image}
                priority
                sizes="100vw"
                rounded={false}
                className="absolute inset-0 h-full w-full"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-lake/90 via-lake/45 to-lake/20"
              />
            </>
          ) : (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <WaveLines stroke="#2c7a6f" opacity={0.7} />
            </div>
          )}
          <div className="u-container relative pb-20 pt-24 md:pb-24">
            {eyebrow ? <p className="u-eyebrow mb-3 text-cream/85">{eyebrow}</p> : null}
            <h1 className="u-display max-w-[20ch] text-cream">{heading}</h1>
            {standfirst ? (
              <p className="mt-4 max-w-[56ch] text-lg text-cream/90">{standfirst}</p>
            ) : null}
            <ButtonRow buttons={buttons} settings={settings} tone="lake" className="mt-7" />
          </div>
        </div>
        <WaveEdge />
      </section>
    )
  }

  const onDark = opt(appearance?.tone) === 'lake'
  const headingColor = onDark ? 'text-cream' : 'text-lake'
  const supportColor = onDark ? 'text-cream/70' : 'text-muted'

  if (layout === 'text') {
    return (
      <Wrapper appearance={appearance} reveal={false} grainSeed={section._key}>
        <div className="max-w-[24ch]">
          {eyebrow ? <p className={`u-eyebrow mb-4 ${supportColor}`}>{eyebrow}</p> : null}
          <h1 className={`u-display ${headingColor}`}>{heading}</h1>
        </div>
        {standfirst ? (
          <p className={`mt-6 max-w-[56ch] text-lg ${supportColor}`}>{standfirst}</p>
        ) : null}
        <ButtonRow
          buttons={buttons}
          settings={settings}
          tone={appearance?.tone}
          className="mt-8"
        />
      </Wrapper>
    )
  }

  // split
  return (
    <Wrapper appearance={appearance} reveal={false} grainSeed={section._key}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          {eyebrow ? <p className={`u-eyebrow mb-4 ${supportColor}`}>{eyebrow}</p> : null}
          <h1 className={`u-display ${headingColor}`}>{heading}</h1>
          {standfirst ? (
            <p className={`mt-6 max-w-[48ch] text-lg ${supportColor}`}>{standfirst}</p>
          ) : null}
          <ButtonRow
            buttons={buttons}
            settings={settings}
            tone={appearance?.tone}
            className="mt-8"
          />
        </div>
        <Figure
          image={image}
          priority
          aspect={4 / 3}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-[4/5] lg:aspect-[4/3]"
        />
      </div>
    </Wrapper>
  )
}
